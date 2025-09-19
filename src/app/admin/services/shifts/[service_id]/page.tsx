'use client';

import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getShifts, getOneServiceDetail } from '@/services/ApiHandler';
import { Shift, ServiceDetail } from '@/types/domain';
import { DataTable } from '@/components/DataTable';

const columns: ColumnDef<Shift>[] = [
  { accessorKey: 'start', header: 'Inicio' },
  { accessorKey: 'end', header: 'Fin' },
  { accessorKey: 'maxCapacity', header: 'Capacidad Máxima' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'availablePlaces', header: 'Lugares Disponibles' },
];

interface ShiftTableProps {
  params: Promise<{ service_id: string }>;
}

const ShiftsTable = ({ params }: ShiftTableProps) => {
  const [data, setData] = useState<Shift[]>([]);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { service_id } = React.use(params);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const res = await getShifts({ page, pageSize: pagination.pageSize, serviceId: service_id });
      setData(res.items);
      setPagination(res.pagination);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page);
  }, [pagination.page]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const res = await getOneServiceDetail(service_id);
        setServiceDetails(res || null);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  if (!serviceDetails) {
    return <p className="text-center py-6">Cargando información del servicio...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-4xl font-semibold mb-2">{serviceDetails.name}</h1>
        <p className="text-lg text-gray-700">{serviceDetails.description || 'Sin descripción'}</p>
      </div>

      {/* Información general */}
      <div className="grid bg-white grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow">
        <div>
          <h2 className="text-xl font-semibold mb-2">Información del Servicio</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>Tipo:</strong> {serviceDetails.serviceType?.name}</li>
            <li><strong>Precio:</strong> ${serviceDetails.price}</li>
            <li><strong>Duración:</strong> {serviceDetails.duration} minutos</li>
            <li><strong>Capacidad sugerida:</strong> {serviceDetails.suggestedMaxCapacity}</li>
            <li><strong>Solo adultos:</strong> {serviceDetails.forAdultsOnly ? 'Sí' : 'No'}</li>
            <li><strong>Puntuación promedio:</strong> {serviceDetails.avgScore ?? 'N/A'}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Proveedor</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>Nombre:</strong> {serviceDetails.provider.fullname}</li>
            <li><strong>Email:</strong> {serviceDetails.provider.email}</li>
            <li><strong>CUIL:</strong> {serviceDetails.provider.cuil}</li>
            <li><strong>Tipo:</strong> {serviceDetails.provider.type === 'boat' ? 'Náutico' : 'Normal'}</li>
            <li><strong>Confirmación requerida:</strong> {serviceDetails.provider.needConfirmation ? 'Sí' : 'No'}</li>
          </ul>
        </div>
      </div>

      {/* Tabla de turnos */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Próximas salidas</h2>
        <DataTable
          columns={columns}
          data={data}
          total={total}
          pagination={pagination}
          loading={loading}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          searchable={false}
        />
      </div>
    </div>
  );
};

export default ShiftsTable;
