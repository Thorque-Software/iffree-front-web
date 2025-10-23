"use client";

import { Service } from "@/types/domain";
import { PostService, uploadMedia } from "@/services/ApiHandler";
import React from "react";
import ServiceForm from "@/components/ServiceForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function NewServicePage() {
  const router = useRouter();

  const handleSubmit = async (values: Partial<Service>, mediaPayload: FormData | number[] | null) => {
    try {
      const response = await PostService(values);
      const newServiceId = String(response?.id);
      console.log("Service created", mediaPayload);
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
        router.push('/admin/services');
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
      <ServiceForm onSubmit={handleSubmit} />
    </div>
  );
}
