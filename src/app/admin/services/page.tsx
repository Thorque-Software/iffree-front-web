'use client';

import React, { useEffect, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { getServiceDetails, getServiceTypes,getProviders, DeleteService } from "@/services/ApiHandler";
import { ServiceDetail,Provider,ServiceType } from "@/types/domain";
import Link from "next/link";
import Swal from "sweetalert2";



const ServicesPage = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ServiceDetail[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    providerId: "",
    serviceTypeId: "",
    forAdultsOnly: "",
    cheaperThan: "",
  });
  const [debouncedName, setDebouncedName] = useState(filters.name);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedName(filters.name), 500);
    return () => clearTimeout(handler);
  }, [filters.name]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getServiceDetails({
        page: pagination.page,
        pageSize: pagination.pageSize,
        filters: { ...filters, name: debouncedName },
      });
      setData(res.items);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceDetailId: number) => {
      const result = await DeleteService(serviceDetailId);
      if (result) {
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El servicio ha sido eliminado con éxito.',
        });
        fetchData();
      }
    };

  useEffect(() => {
    const fetchProvidersAndServiceTypes = async () => {
    setLoading(true);
      try {
        const resProviders = await getProviders({ page: 1, pageSize: 100 });
        const resServiceTypes = await getServiceTypes();
        setServiceTypes(resServiceTypes.items);
        setProviders(resProviders.items);
    } finally {
        setLoading(false);
    }
    };
    fetchProvidersAndServiceTypes();
  }, []);

  useEffect(() => {
    fetchData();
  }, [debouncedName, filters.providerId, filters.serviceTypeId, filters.forAdultsOnly, filters.cheaperThan, pagination.page]);

  return (
    <div className="flex gap-4">
      {/* === PANEL DE FILTROS === */}
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm h-fit">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 border"
            placeholder="Nombre"
          />

          <select
            value={filters.providerId}
            onChange={(e) => setFilters({ ...filters, providerId: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 border"
          >
            <option value="">Proveedor</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.fullname}</option>
            ))}
          </select>

          <select
            value={filters.serviceTypeId}
            onChange={(e) => setFilters({ ...filters, serviceTypeId: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 border"
          >
            <option value="">Tipo de Servicio</option>
            {serviceTypes.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={filters.forAdultsOnly}
            onChange={(e) => setFilters({ ...filters, forAdultsOnly: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 border"
          >
            <option value="">Solo Adultos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>

          <input
            type="number"
            value={filters.cheaperThan}
            onChange={(e) => setFilters({ ...filters, cheaperThan: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 border"
            placeholder="Precio menor a"
          />

          <button
            onClick={() => setFilters({ name: "", providerId: "", serviceTypeId: "", forAdultsOnly: "", cheaperThan: "" })}
            className="text-sm text-gray-500 hover:underline mt-2"
          >
            Limpiar filtros
          </button>
          <Link href="/admin/services/new" className="mb-5 bg-blue-600 text-white px-4 py-2 rounded mr-4 text-center">+ Nuevo servicio</Link>
        </div>
      </div>

      {/* === LISTA DE SERVICIOS A LA DERECHA === */}
      <div className="flex-1">
        {loading ? <p>Cargando...</p> : data.map((service) => (
          <ServiceCard key={service.id} serviceDetail={service} onDelete={handleDelete} />
        ))}
        <div className="flex justify-center mt-4">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="mr-3 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ◀
            </button>
            <span>Página {pagination.page}</span>
            <button
              disabled={data.length < pagination.pageSize || loading}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="ml-3 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ▶
            </button>
          </div>
      </div>
    </div>
  );
};
export default ServicesPage;
