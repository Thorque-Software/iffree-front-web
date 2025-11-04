"use client";

import React, { useEffect, useState } from "react";
import BoatCard from "@/components/BoatCard";
import { getProviderBoats, DeleteProviderBoat } from "@/services/ApiHandler";
import { Boat } from "@/types/domain";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";

const BoatPage = () => {
  const { user } = useAuth();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [totalItems, setTotalItems] = useState(1);
  const [loading, setLoading] = useState(false);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [providerId, setProviderId] = useState<string>("");

  const [filters, setFilters] = useState({
    name: "",
    cheaperThan: "",
  });
  const [debouncedName, setDebouncedName] = useState(filters.name);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedName(filters.name), 500);
    return () => clearTimeout(handler);
  }, [filters.name]);

  const fetchData = async (page?: number, providerIdParam?: string) => {
    setLoading(true);
    try {
      const providerIdToUse = providerIdParam || providerId;
      const res = await getProviderBoats(providerIdToUse, {
        page: page || pagination.page,
        pageSize: pagination.pageSize,
        filters: { ...filters, name: debouncedName },
      });
      setBoats(res.items);
      setPagination(res.pagination);
      setTotalItems(res.total);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (boatId: number) => {
    const result = await DeleteProviderBoat(providerId, boatId);
    if (result) {
      Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: "El barco ha sido eliminado con éxito.",
      });
      fetchData();
    }
  };

  useEffect(() => {
    if (user) {
      setProviderId(user?.providerId || "");
      fetchData(1, user?.providerId);
    }
  }, [user]);

  useEffect(() => {
    if (!providerId) return;
    fetchData(1);
  }, [debouncedName, filters.cheaperThan]);

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

          <input
            type="number"
            value={filters.cheaperThan}
            onChange={(e) => setFilters({ ...filters, cheaperThan: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 border"
            placeholder="Precio menor a"
          />

          <button
            onClick={() => setFilters({ name: "", cheaperThan: "" })}
            className="text-sm text-gray-500 hover:underline mt-2"
          >
            Limpiar filtros
          </button>

          <Link
            href="/providerBoat/boats/new"
            className="mb-5 bg-blue-600 text-white px-4 py-2 rounded mr-4 text-center"
          >
            + Nuevo barco
          </Link>
        </div>
      </div>

      {/* === LISTA DE BARCOS === */}
      <div className="flex-1">
        {loading ? (
          <p>Cargando...</p>
        ) : boats && boats.length > 0 ? (
          boats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} onDelete={handleDelete}/>
          ))
        ) : (
          <p>No hay barcos disponibles</p>
        )}

        {/* === Paginación === */}
        <div className="flex justify-center mt-4">
          <button
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchData(Math.max(pagination.page - 1, 1))}
            className="mr-3 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ◀
          </button>
          {loading ? (
            <span>Cargando...</span>
          ) : (
            <span>
              Página {pagination.page} de{" "}
              {Math.ceil(totalItems / pagination.pageSize)}
            </span>
          )}
          <button
            disabled={
              pagination.page >= Math.ceil(totalItems / pagination.pageSize) || loading
            }
            onClick={() =>
              fetchData(Math.min(pagination.page + 1, Math.ceil(totalItems / pagination.pageSize)))
            }
            className="ml-3 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoatPage;
