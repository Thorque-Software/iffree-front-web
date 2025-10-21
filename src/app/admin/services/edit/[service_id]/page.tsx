"use client";

import React from "react";
import { useEffect, useState } from "react";
import ServiceForm from "@/components/ServiceForm";
import { Service } from "@/types/domain";
import { getOneServiceDetail,PutService,reorderMedia } from "@/services/ApiHandler";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface EditServicePageProps {
  params: Promise<{ service_id: string }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { service_id: id } = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<Service | null>(null);

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
      if (mediaPayload && mediaPayload instanceof Array && mediaPayload.length > 0) {
        await reorderMedia(id, mediaPayload);
      }
      Swal.fire({
        icon: 'success',
        title: 'Servicio actualizado con éxito',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        router.push('/admin/services');
      });
      
    } catch (error) {
      console.error("Error updating service:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el servicio',
        text: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
      });
    }
  };

  if (!service || loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Editar servicio</h1>
      <ServiceForm initialValues={service} onSubmit={handleSubmit} />
    </div>
  );
}
