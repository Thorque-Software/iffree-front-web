"use client";

import React from "react";
import { useEffect, useState } from "react";
import ServiceForm from "@/components/ServiceForm";
import { Service } from "@/types/domain";
import { getOneServiceDetail,PutService,reorderMedia } from "@/services/ApiHandler";

interface EditServicePageProps {
  params: Promise<{ service_id: string }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { service_id: id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const serviceData = await getOneServiceDetail(id);
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (values: Partial<Service>, mediaPayload: FormData | number[] | null) => {
    try {
      await PutService(id, values);
      if (mediaPayload && mediaPayload instanceof Array) {
        await reorderMedia(id, mediaPayload);
      }
      setMessage("Servicio actualizado con éxito");
    } catch (error) {
      console.error("Error updating service:", error);
      setMessage("Error al actualizar el servicio");
    }
  };

  if (!service || loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Editar servicio</h1>
      {message && <p className="mb-4 text-center">{message}</p>}
      <ServiceForm initialValues={service} onSubmit={handleSubmit} />
    </div>
  );
}
