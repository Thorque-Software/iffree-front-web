'use client';

import React, { useEffect, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { getServiceDetails } from "@/services/ApiHandler";
import { ServiceDetail } from "@/types/domain";
import Link from "next/link";



const ServicesPage = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ServiceDetail[]>([]);

  const fetchData = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const res = await getServiceDetails({ page, pageSize: pagination.pageSize });
      setData(res.items);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page);
  }, [pagination.page]);
  
  return (
    <div>
      <div className="flex  items-center mb-6">
        <Link href="/admin/services/new" className="bg-blue-600 text-white px-4 py-2 rounded mr-4">+ Nuevo servicio</Link>
        <input
          type="text"
          placeholder="Buscar"
          className="border rounded px-3 py-2 w-1/3"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          data.map((service) => (
            <ServiceCard key={service.id} serviceDetail={service} />
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
