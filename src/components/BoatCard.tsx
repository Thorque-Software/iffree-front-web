"use client";

import React, { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSignedMedia } from "@/services/useSignedMedia";
import { Boat } from "@/types/domain";

interface BoatCardProps {
  boat: Boat;
  onDelete: (boatId: number) => void;
}

const BoatCard: React.FC<BoatCardProps> = ({ boat, onDelete}) => {
  const { urls: medias, loading } = useSignedMedia(boat?.mediaBoats || []);

  const [currentMedia, setCurrentMedia] = useState(0);

  const nextMedia = () =>
    setCurrentMedia((prev) => (prev + 1 < medias.length ? prev + 1 : 0));
  const prevMedia = () =>
    setCurrentMedia((prev) => (prev - 1 >= 0 ? prev - 1 : medias.length - 1));

  const handleDelete = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(boat.id);
      }
    });
  };

  return (
    <div className="w-full border border-gray-200 rounded-md shadow-md flex h-48 overflow-hidden mb-4">
      {/* Imagen */}
      <div className="relative w-48 h-full flex-shrink-0 bg-gray-100">
        {loading ? (
          <img src="/loading.gif" className="w-12 h-12 m-auto" />
        ) : medias.length > 0 ? (
          <>
            <img
              src={medias[currentMedia].url}
              className="w-full h-full object-cover"
            />
            {medias.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute top-1/2 left-1 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded"
                >
                  {"<"}
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute top-1/2 right-1 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded"
                >
                  {">"}
                </button>
              </>
            )}
          </>
        ) : (
          <img src="/no_image.jpg" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{boat.name}</h3>
          <p className="text-gray-700">${boat.price}</p>
          <p className="text-sm text-gray-500 leading-tight">
            Tipo: {boat.boatType?.name} <br />
            Capacidad: {boat.capacity} personas <br />
            Motor: {boat.enginePower} HP <br />
            Puerto: {boat.dock?.name}
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Link
            href={`/providerBoat/boats/${boat.id}`}
            className="bg-gray-800 text-white px-3 py-1 rounded"
          >
            Ver
          </Link>
          <Link
            href={`/providerBoat/boats/edit/${boat.id}`}
            className="border px-3 py-1 rounded"
            >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoatCard;
