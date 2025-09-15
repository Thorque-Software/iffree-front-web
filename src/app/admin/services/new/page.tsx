// app/nuevo-servicio/page.tsx
"use client";
import { useRef, useState } from "react";
import { XMarkIcon, MagnifyingGlassIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Combobox, Input , Textarea} from "@headlessui/react";

interface Proveedor {
  id: number;
  name: string;
}

const proveedores = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "María López" },
  { id: 3, name: "Pedro Maldonado" },
];

export default function NewService() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<Proveedor | null>(null);
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? proveedores
      : proveedores.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-8">
      <div className="w-full max-w-5xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Nuevo servicio</h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del servicio */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre del servicio
            </label>
            <Input
              type="text"
              className="w-full bg-white rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Value"
            />
          </div>

          {/* Cupo máximo */}
          <div>
            <label className="block text-sm font-medium mb-1">Cupo máximo</label>
            <Input
              type="number"
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              placeholder="Value"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <Textarea
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              placeholder="Value"
              rows={3}
            />
          </div>

          {/* Cupo mínimo */}
          <div>
            <label className="block text-sm font-medium mb-1">Cupo mínimo</label>
            <Input
              type="number"
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              placeholder="Value"
            />
          </div>
          
          {/* Precio */}
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <Input
              type="text"
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              placeholder="Value"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <Input
              type="text"
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              placeholder="Value"
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium mb-2">Imágenes</label>
            <div className="flex flex-col items-start space-x-2 mb-2">
                <button
                type="button"
                onClick={handleClickUpload}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 mb-3 rounded-md"
                >
                <ArrowUpTrayIcon className="w-4 h-4" />
                Subir imágenes
                </button>

                {/* Input oculto */}
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Lista de previews */}
                <div className="space-y-2">
                    {files.map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                        <div
                        key={index}
                        className="w-full flex items-center justify-between border rounded-md p-2"
                        >
                        <div className="w-full flex items-center gap-2">
                            <img
                            src={url}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded"
                            />
                            <span className="text-sm truncate max-w-[200px]">
                            {file.name}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                        </div>
                    );
                    })}
                </div>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium mb-1">Ubicación</label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                className="w-full bg-white rounded-md border border-gray-300 p-2"
                placeholder="Value"
              />
              <button
                type="button"
                className="p-2 rounded-md bg-gray-100 border hover:bg-gray-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2">
              <img
                src="/map-example.png"
                alt="mapa"
                className="w-full h-40 object-cover rounded-md border"
              />
            </div>
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium mb-1">Proveedor</label>
            <Combobox value={selected} onChange={setSelected}>
                <Combobox.Input
                className="w-full bg-white rounded-md border border-gray-300 p-2"
                displayValue={(p: { name: string }) => p?.name}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar proveedor..."
                />
                <Combobox.Options className="mt-1 border rounded-md bg-white shadow-lg">
                {filtered.map((p) => (
                    <Combobox.Option
                    key={p.id}
                    value={p}
                    className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                    >
                    {p.name}
                    </Combobox.Option>
                ))}
                </Combobox.Options>
            </Combobox>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <Input type="checkbox" className="h-4 w-4 text-blue-500" />
              Servicio con confirmación manual de reservas
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Input type="checkbox" className="h-4 w-4 text-blue-500" />
              Marcar como oferta
            </label>
          </div>
        </form>

        {/* Botón */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
