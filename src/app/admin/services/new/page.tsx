"use client";

import ServiceForm from "@/components/ServiceForm";
import { Service } from "@/types/domain";
import { PostService, uploadMedia } from "@/services/ApiHandler";
import React,{useState} from "react";

export default function NewServicePage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (values: Partial<Service>, mediaPayload: FormData | number[] | null) => {
    try {
      const response = await PostService(values);
      const newServiceId = String(response?.id);
      if (mediaPayload) {
        mediaPayload instanceof FormData && await uploadMedia(newServiceId, mediaPayload);
        console.log("Media uploaded", mediaPayload);
      }
      setMessage("Servicio creado con éxito");

    } catch (error) {
      console.error("Error creating service:", error);
      setMessage("Error al crear el servicio");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Nuevo servicio</h1>
      {message && <p className="mb-4 text-center">{message}</p>}
      <ServiceForm onSubmit={handleSubmit} />
    </div>
  );
}
