"use client";

import React from "react";
import { useEffect, useState } from "react";
import ServiceForm from "@/components/ServiceForm";
import { Service } from "@/types/domain";
import { getOneServiceDetailProvider,PutServiceProvider,reorderMedia } from "@/services/ApiHandler";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface EditServicePageProps {
  params: Promise<{ service_id: string }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { service_id: serviceId } = React.use(params);
  const { user } = useAuth();  
  const router = useRouter();
  const [providerId,setProviderId]=useState<string>("");
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<Service | null>(null);

  const fetchService = async (providerIdParams: string) => {
      setLoading(true);
      try {
        const serviceData = await getOneServiceDetailProvider(providerIdParams, serviceId);
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if(!user) return;
    if (user.providerId) {
      setProviderId(user.providerId);
      fetchService(user.providerId);
    }
  }, [serviceId, user]);



  const handleSubmit = async (values: Partial<Service>, mediaPayload: FormData | number[] | null) => {
    try {
      await PutServiceProvider(providerId, serviceId, values);
      if (mediaPayload && mediaPayload instanceof Array && mediaPayload.length > 0) {        
        await reorderMedia(serviceId, mediaPayload);
      }
      Swal.fire({
        icon: 'success',
        title: 'Servicio actualizado con éxito',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        router.push('/provider/services');
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
      <ServiceForm initialValues={service} onSubmit={handleSubmit} isAdmin={false} />
    </div>
  );
}
