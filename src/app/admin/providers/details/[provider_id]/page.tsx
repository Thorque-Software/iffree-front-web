"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import { getOneProvider, getServiceDetails } from "@/services/ApiHandler";
import { Provider, ServiceDetail } from "@/types/domain";
import ServiceCard from "@/components/ServiceCard";

interface ProviderDetailPageProps {
  params: Promise<{ provider_id: string }>;
}

const ProviderDetailPage = ({ params }: ProviderDetailPageProps) => {
  const { provider_id } = React.use(params);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Provider Info
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await getOneProvider(provider_id);
        if (res) setProvider(res);
      } catch (error) {
        console.error("Error fetching provider:", error);
      }
    };
    fetchProvider();
  }, [provider_id]);

  // ✅ Fetch Services (solo de este provider)
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getServiceDetails({
        page: pagination.page,
        pageSize: pagination.pageSize,
        filters: { providerId: provider_id },
      });
      setServices(res.items);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pagination.page, provider_id]);

  if (!provider) return <p className="p-4">Cargando proveedor...</p>;

  return (
    <div className="p-6 space-y-6">

      {/* ✅ Info del proveedor */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-xl font-bold mb-2">{provider.fullname}</h1>
        <p><strong>Email:</strong> {provider.email}</p>
        <p><strong>Teléfono:</strong> {provider.phoneNumber || "N/A"}</p>
        <p><strong>CUIL:</strong> {provider.cuil}</p>
        <p><strong>Ciudad:</strong> {provider.city?.name}</p>
        <p><strong>Tipo:</strong> {provider.type}</p>
        <p><strong>Confirma reservas:</strong> {provider.needConfirmation ? "Sí" : "No"}</p>

        <Link
          href={`/admin/providers/edit/${provider.id}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Editar proveedor
        </Link>
      </div>

      {/* ✅ Servicios del proveedor */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Servicios de este proveedor</h2>

        {loading ? (
          <p>Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p>No hay servicios aún.</p>
        ) : (
          services.map((service) => (
            <ServiceCard key={service.id} serviceDetail={service} onDelete={() => {}} />
          ))
        )}

        {/* 🔁 Paginación */}
        <div className="flex justify-center mt-4">
          <button
            disabled={pagination.page <= 1 || loading}
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            className="mr-2 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ◀
          </button>
          <span>Página {pagination.page}</span>
          <button
            disabled={services.length < pagination.pageSize || loading}
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            className="ml-2 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
