"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ServiceDetail } from "@/types/domain";
import { useSignedMedia } from "@/services/useSignedMedia";
import ConfirmModal from "./ConfirmModal";

interface ServiceCardProps {
  serviceDetail: ServiceDetail;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ serviceDetail }) => {
  const { urls: medias, loading } = useSignedMedia(serviceDetail.mediaService);
  const [currentMedia, setCurrentMedia] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextMedia = () =>
    setCurrentMedia((prev) => (prev + 1 < medias.length ? prev + 1 : 0));
  const prevMedia = () =>
    setCurrentMedia((prev) => (prev - 1 >= 0 ? prev - 1 : medias.length - 1));

  const handleDelete = () => {
    console.log("Eliminando servicio con id:", serviceDetail.id);
    // acá haces tu fetch o dispatch a API para eliminar
    setShowModal(false);
  };

  return (
    <div className="border border-gray-200 p-4 rounded shadow-md max-w-xs flex flex-col justify-between h-full">
      <div>
        <div className="relative w-full h-48 flex items-center justify-center bg-gray-100 rounded">
          {loading ? (
            <img
              src="/loading.gif"
              alt="Cargando..."
              className="w-16 h-16 object-contain"
            />
          ) : medias.length > 0 ? (
            <>
              {medias[currentMedia].url.match(/\.(mp4|webm)(\?.*)?$/i) ? (
                <video
                  src={medias[currentMedia].url}
                  controls
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <img
                  src={medias[currentMedia].url}
                  alt={serviceDetail.name}
                  className="w-full h-48 object-cover rounded"
                />
              )}
              {!loading && medias.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
                  >
                    {">"}
                  </button>
                </>
              )}
            </>
          ) : (
            <img
              src="/no_image.jpg"
              alt="Sin imagen"
              className="w-full h-48 object-cover rounded"
            />
          )}
        </div>

        <h3 className="text-lg font-semibold mt-2">{serviceDetail.name}</h3>
        <p className="text-gray-700">${serviceDetail.price}</p>
        <p className="text-sm text-gray-500">
          Proveedor: {serviceDetail.provider.fullname} <br />
          Descripción:{" "}
          {serviceDetail.description.length > 100
            ? serviceDetail.description.slice(0, 100) + "..."
            : serviceDetail.description}{" "}
          <br />
          Cupo sugerido: {serviceDetail.suggestedMaxCapacity} <br />
          Solo adultos: {serviceDetail.forAdultsOnly ? "Sí" : "No"}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <Link
          href={`/admin/services/shifts/${serviceDetail.id}`}
          className="bg-gray-800 text-white px-2 py-1 rounded text-center flex-1"
        >
          Ver
        </Link>
        <Link
          href={`/admin/services/edit/${serviceDetail.id}`}
          className="border px-2 py-1 rounded text-center flex-1"
        >
          Editar
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-2 py-1 rounded flex-1"
        >
          Borrar
        </button>
      </div>

      {showModal && (
        <ConfirmModal
          title="¿Seguro que quieres eliminar este servicio?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ServiceCard;
