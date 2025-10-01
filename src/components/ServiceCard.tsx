"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ServiceDetail } from "@/types/domain";
import { useSignedMedia } from "@/services/useSignedMedia";
import ConfirmModal from "./ConfirmModal";
import { DeleteService } from "@/services/ApiHandler";
import Swal from 'sweetalert2'

interface ServiceCardProps {
  serviceDetail: ServiceDetail;
  onDelete: (serviceDetailId: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ serviceDetail, onDelete }) => {
  const { urls: medias, loading } = useSignedMedia(serviceDetail.mediaService);
  const [currentMedia, setCurrentMedia] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextMedia = () =>
    setCurrentMedia((prev) => (prev + 1 < medias.length ? prev + 1 : 0));
  const prevMedia = () =>
    setCurrentMedia((prev) => (prev - 1 >= 0 ? prev - 1 : medias.length - 1));

  const handleDelete = async () => {
    const result = await DeleteService(serviceDetail.id);
    if (result) {
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'El servicio ha sido eliminado con éxito.',
      });
      window.location.reload();
    }
    setShowModal(false);
  };

  return (
    <div className="w-full border border-gray-200 rounded-md shadow-md flex h-48 overflow-hidden mb-4">
      {/* Imagen / Video */}
      <div className="relative w-48 h-full flex-shrink-0 bg-gray-100">
        {loading ? (
          <img src="/loading.gif" className="w-12 h-12 m-auto" />
        ) : medias.length > 0 ? (
          <>
            {medias[currentMedia].url.match(/\.(mp4|webm)(\?.*)?$/i) ? (
              <video
                src={medias[currentMedia].url}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={medias[currentMedia].url}
                className="w-full h-full object-cover"
              />
            )}
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
          <h3 className="text-lg font-semibold">{serviceDetail.name}</h3>
          <p className="text-gray-700">${serviceDetail.price}</p>
          <p className="text-sm text-gray-500 leading-tight">
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

        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/services/shifts/${serviceDetail.id}`}
            className="bg-gray-800 text-white px-3 py-1 rounded"
          >
            Ver
          </Link>
          <Link
            href={`/admin/services/edit/${serviceDetail.id}`}
            className="border px-3 py-1 rounded"
          >
            Editar
          </Link>
          <button
            onClick={() => onDelete(serviceDetail.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Borrar
          </button>
        </div>
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
