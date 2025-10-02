"use client";
import { useEffect, useState } from "react";
import { Combobox, Input, Textarea } from "@headlessui/react";
import { Service,Provider,ServiceType,ServiceDetail } from "@/types/domain";
import {getProviders, getServiceTypes, deleteMedia, uploadOneMedia} from "@/services/ApiHandler";
import MediaLoad from "./MediaLoad";
import { useSignedMedia } from "@/services/useSignedMedia";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false, // ⛔ evita que se renderice en el servidor
});

type UploadOneImageResponse = {
  id: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};


interface ServiceFormProps {
  initialValues?: Partial<ServiceDetail>;
  onSubmit: (values: Partial<Service>, mediaPayload: FormData | number[] | null) => Promise<void>;
}

export default function ServiceForm({ initialValues = {}, onSubmit }: ServiceFormProps) {
  const [mediaPayload, setMediaPayload] = useState<FormData | number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
  const [queryServiceType, setQueryServiceType] = useState("");
  const [queryProvider, setQueryProvider] = useState("");
  const [formData, setFormData] = useState<Partial<Service>>(initialValues);
  const { urls: signedUrls, loading: signedUrlsLoading } = useSignedMedia(initialValues?.mediaService ?? []);
  

  const filteredServiceTypes =
    queryServiceType === ""
        ? serviceTypes
        : serviceTypes.filter((c) =>
            c.name.toLowerCase().includes(queryServiceType.toLowerCase())
    );

  const filteredProviders =
    queryProvider === ""
        ? providers
        : providers.filter((p) =>
            p.fullname.toLowerCase().includes(queryProvider.toLowerCase())
    );

  useEffect(() => {
    const fetchData = async () => {
    setLoading(true);
      try {
        const resProviders = await getProviders({ page: 1, pageSize: 100 });
        const resServiceTypes = await getServiceTypes();
        setServiceTypes(resServiceTypes.items);
        setProviders(resProviders.items);
    } finally {
        setLoading(false);
    }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialValues?.provider) {
      setSelectedProvider(initialValues.provider);
      setFormData(prev => ({ ...prev, providerId: initialValues.provider?.id }));
    }
    if (initialValues?.serviceType) {
      setSelectedServiceType(initialValues.serviceType);
      setFormData(prev => ({ ...prev, serviceTypeId: initialValues.serviceType?.id }));
    }
    console.log("cleanup");
  }, []);


  const handleChange = (field: keyof Service, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (formData.forAdultsOnly === undefined ) formData.forAdultsOnly = false;
  await onSubmit(
    {
      ...formData,
      providerId: selectedProvider?.id,
      serviceTypeId: selectedServiceType?.id,
    },
    mediaPayload
  );
};
  if(loading) return <div>Cargando...</div>;
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Nombre */}
      <div>
        <label className="block text-sm mb-1">Nombre del servicio</label>
        <Input
          type="text"
          value={formData.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Cupo máximo */}
      <div>
        <label className="block text-sm mb-1">Cupo máximo</label>
        <Input
          type="number"
          value={formData.suggestedMaxCapacity ?? ""}
          onChange={(e) => handleChange("suggestedMaxCapacity", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <Textarea
          value={formData.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Duración */}
      <div>
        <label className="block text-sm mb-1">Duración (minutos)</label>
        <Input
          type="number"
          value={formData.duration ?? ""}
          onChange={(e) => handleChange("duration", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm mb-1">Precio</label>
        <Input
          type="number"
          value={formData.price ?? ""}
          onChange={(e) => handleChange("price", Number(e.target.value))}
          className="w-full bg-white rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="relative">
        <label className="block text-sm mb-1">Tipo de servicio</label>
        <Combobox value={selectedServiceType} onChange={setSelectedServiceType}>
          <div className="relative">
            <Combobox.Input
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              displayValue={(c: ServiceType) => c?.name}
              onChange={(e) => setQueryServiceType(e.target.value)}
            />
            <Combobox.Options className="absolute z-450 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
              {filteredServiceTypes.map((c) => (
                <Combobox.Option
                  key={c.id}
                  value={c}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                >
                  {c.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>


      {/* Ubicación con lat/long */}
      <div className="col-span-2">
        <label className="block text-sm mb-1">Ubicación</label>
        <LocationPicker
          value={{
            lat: formData.locationLat,
            lng: formData.locationLong,
          }}
          onChange={(loc) =>
            setFormData((prev) => ({
              ...prev,
              locationLat: loc.lat,
              locationLong: loc.lng,
            }))
          }
        />
      </div>

      {/* Proveedor */}
      <div className="relative">
        <label className="block text-sm mb-1">Proveedor</label>
        <Combobox value={selectedProvider} onChange={setSelectedProvider}>
          <div className="relative">
            <Combobox.Input
              className="w-full bg-white rounded-md border border-gray-300 p-2"
              displayValue={(p: Provider) => p?.fullname}
              onChange={(e) => setQueryProvider(e.target.value)}
            />
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
              {filteredProviders.map((p) => (
                <Combobox.Option
                  key={p.id}
                  value={p}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                >
                  {p.fullname}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>
    


      {/* Checkboxes */}
      <div className="flex flex-col space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <Input
            type="checkbox"
            checked={formData.forAdultsOnly ?? false}
            onChange={(e) => handleChange("forAdultsOnly", e.target.checked)}
          />
          Solo adultos
        </label>
      </div>

      {/* Imágenes */}
      {!signedUrlsLoading && <MediaLoad
        mode={initialValues?.id ? "edit" : "create"}
        initialMedias={signedUrls}
        onUpload={async (file) => {
          const response = await uploadOneMedia(String(initialValues.id!), file) as UploadOneImageResponse;
          const id_media = response?.id;
          return {id: id_media, url: URL.createObjectURL(file)}; // MOCK
        }}
        onDelete={async (mediaId) => {
          await deleteMedia(String(initialValues.id!), mediaId);
        }}
        onChange={(result) => setMediaPayload(result)}
        label="Subir media"
      />}

      {/* Botón submit */}
      <div className="col-span-2 flex justify-center">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </div>
    </form>
  );
}
