"use client";

import { Boat } from "@/types/domain";
import { PostProviderBoat, uploadMediaProviderBoat } from "@/services/ApiHandler";
import React,{useEffect, useState} from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import BoatForm from "@/components/BoatForm";

export default function NewBoatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    if (user?.providerId) setProviderId(user.providerId);
  }, [user]);


  const handleSubmit = async (values: Partial<Boat>, mediaPayload: FormData | number[] | null) => {
    try {
      const response = await PostProviderBoat(providerId, values);
      const newBoatId = String(response?.id);
      if (mediaPayload && mediaPayload instanceof FormData && Array.from(mediaPayload.keys()).length > 0) {
        await uploadMediaProviderBoat(providerId, newBoatId, mediaPayload);
      }
      Swal.fire({
        icon: 'success',
        title: 'Servicio creado con éxito',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        router.push('/providerBoat/boats');
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
      <h1 className="text-3xl font-bold mb-6">Nueva embarcación</h1>
      <BoatForm onSubmit={handleSubmit}/>
    </div>
  );
}
