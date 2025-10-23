"use client";

import { Service } from "@/types/domain";
import { PostProviderService, uploadMedia } from "@/services/ApiHandler";
import React,{useEffect, useState} from "react";
import ServiceForm from "@/components/ServiceForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function NewServicePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    if (user?.providerId) setProviderId(user.providerId);
  }, [user]);


  const handleSubmit = async (values: Partial<Service>, mediaPayload: FormData | number[] | null) => {
    try {
      const response = await PostProviderService(providerId, values);
      const newServiceId = String(response?.id);
      if (mediaPayload && mediaPayload instanceof FormData && Array.from(mediaPayload.keys()).length > 0) {
        await uploadMedia(newServiceId, mediaPayload);
        console.log("Media uploaded", mediaPayload);
      }
      Swal.fire({
        icon: 'success',
        title: 'Servicio creado con éxito',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        router.push('/provider/services');
      });

    } catch (error) {
      console.error("Error creating service:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear el servicio',
        text: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Nuevo servicio</h1>
      <ServiceForm onSubmit={handleSubmit} isAdmin={false} />
    </div>
  );
}
