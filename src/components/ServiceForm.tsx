"use client";
import { useEffect, useRef, useState } from "react";
import { XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Combobox, Input, Textarea } from "@headlessui/react";
import { Service,Provider,ServiceType } from "@/types/domain";
import {getProviders, getServiceTypes} from "@/services/ApiHandler";
import LocationPicker from "./LocationPicker";


interface ServiceFormProps {
  initialValues?: Partial<Service>;
  onSubmit: (values: Partial<Service>, files: File[]) => Promise<void>;
}

export default function ServiceForm({ initialValues = {}, onSubmit }: ServiceFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
  const [queryServiceType, setQueryServiceType] = useState("");
  const [queryProvider, setQueryProvider] = useState("");
  const [formData, setFormData] = useState<Partial<Service>>(initialValues);

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

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (field: keyof Service, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(
      {
        ...formData,
        providerId: selectedProvider?.id ,
        serviceTypeId: selectedServiceType?.id
      },
      files
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
      <div className="col-span-2">
        <label className="block text-sm mb-1">Imágenes</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          <ArrowUpTrayIcon className="w-4 h-4 inline" /> Subir imágenes
        </button>
        <Input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="mt-2 space-y-2">
          {files.map((f, i) => {
            const url = URL.createObjectURL(f);
            return (
              <div key={i} className="flex items-center gap-2 border rounded p-2">
                <img src={url} alt={f.name} className="w-12 h-12 object-cover rounded" />
                <span className="truncate">{f.name}</span>
                <button type="button" onClick={() => handleRemoveFile(i)}>
                  <XMarkIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón submit */}
      <div className="col-span-2 flex justify-center">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </div>
    </form>
  );
}
