"use client";
import { useEffect, useState } from "react";
import { Combobox, Input } from "@headlessui/react";
import { Boat, Dock, boatType } from "@/types/domain";
import { getBoatTypes, getDocks, deleteMedia, uploadOneMedia } from "@/services/ApiHandler";
import { useSignedMedia } from "@/services/useSignedMedia";
import MediaLoad from "./MediaLoad";

type UploadOneImageResponse = {
  id: number;
  path: string;
};

interface BoatFormProps {
  initialValues?: Partial<Boat>;
  onSubmit: (values: Partial<Boat>, mediaPayload: FormData | number[] | null) => Promise<void>;
}

export default function BoatForm({ initialValues = {}, onSubmit }: BoatFormProps) {
  const [loading, setLoading] = useState(false);
  const [mediaPayload, setMediaPayload] = useState<FormData | number[] | null>(null);
  const [boatTypes, setBoatTypes] = useState<boatType[]>([]);
  const [docks, setDocks] = useState<Dock[]>([]);
  const [selectedBoatType, setSelectedBoatType] = useState<boatType | null>(null);
  const [selectedDock, setSelectedDock] = useState<Dock | null>(null);
  const [queryBoatType, setQueryBoatType] = useState("");
  const [queryDock, setQueryDock] = useState("");
  const [formData, setFormData] = useState<Partial<Boat>>(initialValues);
  const { urls: signedUrls, loading: signedUrlsLoading } = useSignedMedia(initialValues?.mediaBoats ?? []);

  const filteredBoatTypes =
    queryBoatType === ""
      ? boatTypes
      : boatTypes.filter((bt) => bt.name.toLowerCase().includes(queryBoatType.toLowerCase()));

  const filteredDocks =
    queryDock === ""
      ? docks
      : docks.filter((d) => d.name.toLowerCase().includes(queryDock.toLowerCase()));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        //const [resBoatTypes, resDocks] = await Promise.all([getBoatTypes(), getDocks()]);
        const resBoatTypes =  await getBoatTypes();
        setBoatTypes(resBoatTypes.items);
        setDocks([{id:1,name:"Muelle 1",locationLat:0,locationLong:0},{id:2,name:"Muelle 2",locationLat:0,locationLong:0}]); // Temporal hasta tener el endpoint
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialValues.boatType) {
      setSelectedBoatType(initialValues.boatType);
      setFormData((prev) => ({ ...prev, boatTypeId: initialValues.boatType?.id }));
    }
    if (initialValues.dock) {
      setSelectedDock(initialValues.dock);
      setFormData((prev) => ({ ...prev, dockId: initialValues.dock?.id }));
    }
  }, [initialValues]);

  const handleChange = (field: keyof Boat, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(
      {
        ...formData,
        status: formData.status ? formData.status : "active",
        licenseType: formData.licenseType ? formData.licenseType : "basic",
        boatTypeId: selectedBoatType?.id,
        dockId: selectedDock?.id,
      },
      mediaPayload
    );
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Nombre */}
      <div>
        <label className="block text-sm mb-1">Nombre del barco</label>
        <Input
          required
          type="text"
          value={formData.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Potencia del motor */}
      <div>
        <label className="block text-sm mb-1">Potencia del motor (HP)</label>
        <Input
          required
          type="number"
          value={formData.enginePower ?? ""}
          onChange={(e) => handleChange("enginePower", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Capacidad */}
      <div>
        <label className="block text-sm mb-1">Capacidad (personas)</label>
        <Input
          required
          type="number"
          value={formData.capacity ?? ""}
          onChange={(e) => handleChange("capacity", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Tipo de licencia */}
      <div>
        <label className="block text-sm mb-1">Tipo de licencia requerida</label>
        <select
          required
          value={formData.licenseType ?? ""}
          onChange={(e) => handleChange("licenseType", e.target.value)}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        >
          <option value="" disabled>Seleccione un tipo</option>
          <option value="basic">Básica</option>
          <option value="professional">Profesional</option>
          <option value="special">Especial</option>
        </select>
      </div>

      {/* Eslora */}
      <div>
        <label className="block text-sm mb-1">Eslora (m)</label>
        <Input
          required
          type="number"
          value={formData.eslora ?? ""}
          onChange={(e) => handleChange("eslora", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Manga */}
      <div>
        <label className="block text-sm mb-1">Manga (m)</label>
        <Input
          required
          type="number"
          value={formData.manga ?? ""}
          onChange={(e) => handleChange("manga", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm mb-1">Estado</label>
        <select
          required
          value={formData.status ?? ""}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        >
          <option value="" disabled>Seleccione un estado</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
      </div>

      {/* Puntal */}
      <div>
        <label className="block text-sm mb-1">Puntal (m)</label>
        <Input
          required
          type="number"
          value={formData.puntal ?? ""}
          onChange={(e) => handleChange("puntal", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Capacidad del tanque */}
      <div>
        <label className="block text-sm mb-1">Capacidad del tanque (L)</label>
        <Input
          type="number"
          value={formData.tankCapacity ?? ""}
          onChange={(e) => handleChange("tankCapacity", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Autonomía */}
      <div>
        <label className="block text-sm mb-1">Autonomía (km)</label>
        <Input
          type="number"
          value={formData.autonomy ?? ""}
          onChange={(e) => handleChange("autonomy", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm mb-1">Precio por día ($)</label>
        <Input
          type="number"
          value={formData.price ?? ""}
          onChange={(e) => handleChange("price", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      

      {/* Tipo de barco */}
      <div className="relative">
        <label className="block text-sm mb-1">Tipo de barco</label>
        <Combobox value={selectedBoatType} onChange={setSelectedBoatType}>
          <div className="relative">
            <Combobox.Input
              required
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              displayValue={(bt: boatType) => bt?.name}
              onChange={(e) => setQueryBoatType(e.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">▾</Combobox.Button>
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
              {filteredBoatTypes.map((bt) => (
                <Combobox.Option key={bt.id} value={bt} className="cursor-pointer px-3 py-2 hover:bg-gray-100">
                  {bt.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      {/* Muelle */}
      <div className="relative">
        <label className="block text-sm mb-1">Muelle</label>
        <Combobox value={selectedDock} onChange={setSelectedDock}>
          <div className="relative">
            <Combobox.Input
              required
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              displayValue={(d: Dock) => d?.name}
              onChange={(e) => setQueryDock(e.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">▾</Combobox.Button>
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
              {filteredDocks.map((d) => (
                <Combobox.Option key={d.id} value={d} className="cursor-pointer px-3 py-2 hover:bg-gray-100">
                  {d.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      {/* Imágenes */}
      {!signedUrlsLoading && (
        <div className="col-span-2">
          <MediaLoad
            mode={initialValues?.id ? "edit" : "create"}
            initialMedias={signedUrls}
            onUpload={async (file) => {
              const response = (await uploadOneMedia(String(initialValues.id!), file)) as UploadOneImageResponse;
              return { id: response.id, url: URL.createObjectURL(file) };
            }}
            onDelete={async (mediaId) => {
              await deleteMedia(String(initialValues.id!), mediaId);
            }}
            onChange={(result) => setMediaPayload(result)}
            label="Subir imágenes"
          />
        </div>
      )}

      {/* Botón submit */}
      <div className="col-span-2 flex justify-center">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </div>
    </form>
  );
}
