"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Boat } from "@/types/domain";
import { getOneProviderBoat,PutProviderBoat,reorderMediaProviderBoat } from "@/services/ApiHandler";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import BoatForm from "@/components/BoatForm";

interface EditBoatPageProps {
  params: Promise<{ boat_id: string }>;
}

export default function EditBoatPage({ params }: EditBoatPageProps) {
  const { boat_id: boatId } = React.use(params);
  const { user } = useAuth();  
  const router = useRouter();
  const [providerId,setProviderId]=useState<string>("");
  const [loading, setLoading] = useState(false);
  const [boat, setBoat] = useState<Boat | null>(null);

  const fetchBoat = async (providerIdParams: string) => {
      setLoading(true);
      try {
        const boatData = await getOneProviderBoat(providerIdParams, boatId);
        setBoat(boatData);
      } catch (error) {
        console.error("Error fetching boat:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if(!user) return;
    if (user.providerId) {
      setProviderId(user.providerId);
      fetchBoat(user.providerId);
    }
  }, [boatId, user]);



  const handleSubmit = async (values: Partial<Boat>, mediaPayload: FormData | number[] | null) => {
    try {
      await PutProviderBoat(providerId, boatId, values);
      if (mediaPayload && mediaPayload instanceof Array && mediaPayload.length > 0) {
        await reorderMediaProviderBoat(providerId, boatId, mediaPayload);
      }
      Swal.fire({
        icon: 'success',
        title: 'Embarcación actualizada con éxito',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        router.push('/providerBoat/boats');
      });
      
    } catch (error) {
      console.error("Error updating boat:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar la embarcación',
        text: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
      });
    }
  };

  if (!boat || loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Editar embarcación</h1>
      <BoatForm initialValues={boat} onSubmit={handleSubmit} />
    </div>
  );
}
