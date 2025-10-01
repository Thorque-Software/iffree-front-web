import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ---------------- Types ----------------
export type MediaItem = { id: number; url: string };

export interface CargarMediaProps {
  mode: "create" | "edit";
  /** Sólo para modo edit */
  initialMedias?: MediaItem[];
  /** Requerido en edit: sube un archivo y devuelve {id,url} */
  onUpload?: (file: File) => Promise<MediaItem>;
  /** Requerido en edit: elimina un media por id */
  onDelete?: (mediaId: number) => Promise<void>;
  /**
   * Create => devuelve FormData con las medias en el orden actual (clave: images[])
   * Edit => devuelve number[] con los IDs de medios en el orden actual
   */
  onChange: (result: FormData | number[]) => void;
  /** Permitir múltiples archivos por selección */
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
}

// ---------------- Utils ----------------
const isVideoUrl = (url: string) => /\.(mp4|webm)(\?.*)?$/i.test(url);
const isVideoFile = (file: File) => file.type.startsWith("video/") || /\.(mp4|webm)$/i.test(file.name);

// item para modo create (sin ID todavía)
let tempIdSeq = -1;
const nextTempId = () => tempIdSeq--;

// ---------------- Sortable Item ----------------
interface SortableItemProps {
  id: number; // puede ser negativo en create (temporal)
  preview: React.ReactNode;
  onRemove: () => void;
}

function SortableItem({ id, preview, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border p-3 bg-white shadow-sm">
      <button
        type="button"
        className="cursor-grab select-none rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
        aria-label="Arrastrar para reordenar"
        {...attributes}
        {...listeners}
      >
        ⇅
      </button>
      <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {preview}
      </div>
      <div className="ml-auto">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

// ---------------- Componente principal ----------------
export default function MediaLoad({
  mode,
  initialMedias = [],
  onUpload,
  onDelete,
  onChange,
  multiple = true,
  disabled = false,
  label = "Subir media",
}: CargarMediaProps) {
  // Estado unificado de lista
  // En create: items con id temporal negativo y "file" adjunto
  // En edit: items con id real y "url" (sin file)
  type Item =
    | ({ kind: "local"; file: File; tempUrl: string } & { id: number })
    | ({ kind: "remote"; url: string } & { id: number });

  const [items, setItems] = useState<Item[]>(() =>
    mode === "edit"
      ? initialMedias.map((m) => ({ id: m.id, kind: "remote" as const, url: m.url }))
      : []
  );

  // Sensores DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  // ---- Helpers de preview ----
  const renderPreview = (it: Item) => {
    const src = it.kind === "local" ? it.tempUrl : it.url;
    const video = it.kind === "local" ? isVideoFile(it.file) : isVideoUrl(it.url);
    return video ? (
      <video src={src} className="h-16 w-16 object-cover" controls muted />
    ) : (
      <img src={src} className="h-16 w-16 object-cover" alt="media" />
    );
  };

  // ---- Notificar al padre según modo ----
  const emitChange = useCallback(
    (list: Item[]) => {
      if (mode === "create") {
        const fd = new FormData();
        // Clave solicitada: images[]
        list.forEach((it) => {
          if (it.kind === "local") {
            fd.append("images", it.file, it.file.name);
          } else {
            // En create normalmente no habrá remotos, pero por las dudas ignoramos
          }
        });
        onChange(fd);
      } else {
        const ids = list.map((it) => it.id);
        onChange(ids);
      }
    },
    [mode, onChange]
  );

  useEffect(() => {
    emitChange(items);
  }, [items]);

  // ---- Handlers ----
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || disabled) return;
    const toAdd = Array.from(files).filter((f) => {
      if (f.type.startsWith("image/")) return true;
      return isVideoFile(f); // sólo mp4/webm
    });

    if (mode === "create") {
      const locals: Item[] = toAdd.map((f) => ({
        id: nextTempId(),
        kind: "local",
        file: f,
        tempUrl: URL.createObjectURL(f),
      }));
      setItems((prev) => [...prev, ...locals]);
    } else {
      // edit: subir cada archivo inmediatamente
      if (!onUpload) {
        console.warn("onUpload es requerido en modo edit");
        return;
      }
      for (const f of toAdd) {
        const created = await onUpload(f); // {id,url}
        setItems((prev) => [...prev, { id: created.id, kind: "remote", url: created.url }]);
      }
    }
  };

  const removeItem = async (id: number) => {
    if (disabled) return;
    const item = items.find((x) => x.id === id);
    if (!item) return;

    if (mode === "create") {
      // liberar URL
      if (item.kind === "local") URL.revokeObjectURL(item.tempUrl);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } else {
      if (!onDelete) {
        console.warn("onDelete es requerido en modo edit");
        return;
      }
      await onDelete(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((x) => x.id === active.id);
      const newIndex = prev.findIndex((x) => x.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // ---- Drop zone ----
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDrop = (e: DragEvent) => {
      prevent(e);
      const dt = e.dataTransfer;
      if (!dt) return;
      if (dt.files && dt.files.length) {
        handleFilesSelected(dt.files);
      }
    };
    el.addEventListener("dragover", prevent);
    el.addEventListener("dragenter", prevent);
    el.addEventListener("drop", handleDrop);
    return () => {
      el.removeEventListener("dragover", prevent);
      el.removeEventListener("dragenter", prevent);
      el.removeEventListener("drop", handleDrop);
    };
  }, []);

  // cleanup object URLs en create
  useEffect(() => {
    return () => {
      if (mode === "create") {
        items.forEach((it) => {
          if (it.kind === "local") URL.revokeObjectURL(it.tempUrl);
        });
      }
    };
  }, [mode, items]);

  const ids = useMemo(() => items.map((x) => x.id), [items]);

  return (
    <div className="col-span-2">
      <label className="block text-sm mb-1">{label}</label>

      <div
        ref={dropRef}
        className="flex flex-col gap-3 rounded-2xl border-3 border-dashed border-gray-300 p-4"
      >
        {/* Botones */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Subir
          </button>
          <span className="text-sm text-gray-600">
            Arrastrá y soltá archivos aquí o hacé clic en “Subir”. (Imágenes o videos .mp4 / .webm)
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*,video/mp4,video/webm"
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {/* Lista ordenable */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {items.map((it) => (
                <SortableItem
                  key={it.id}
                  id={it.id}
                  preview={renderPreview(it)}
                  onRemove={() => removeItem(it.id)}
                />)
              )}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="text-sm text-gray-500">No hay media seleccionada todavía.</div>
        )}
      </div>
    </div>
  );
}
