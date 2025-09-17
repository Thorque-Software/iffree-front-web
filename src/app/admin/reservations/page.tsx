'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getReservations } from '@/services/ApiHandler';
import { Reservation } from '@/types/domain';
import { DataTable } from '@/components/DataTable';


const columns: ColumnDef<Reservation>[] = [
  { accessorKey: 'shift.start', header: 'Inicio' },
  {
    id: 'cliente',
    header: 'Cliente',
    cell: ({ row }) => {
      const { finalUser } = row.original;
      return `${finalUser.name} ${finalUser.lastname}`;
    },
  },
  { accessorKey: 'shift.service.name', header: 'Servicio' },
  { accessorKey: 'shift.attendees', header: 'Asistentes', cell: ({ row }) => row.original.attendees.length },
  { accessorKey: 'shift.service.price', header: 'Monto', cell: ({ row }) => {
    const price = row.original.shift.service?.price ?? 0;
    const attendeesCount = row.original.attendees.length;
    return `$${price * attendeesCount}`;
  }},
  { accessorKey: 'status', header: 'Estado', cell: ({ row }) => {
    const status = row.original.status;
    switch (status) {
      case 'to_confirm': return 'Por Confirmar';
      case 'to_pay': return 'Por Pagar';
      case 'payed': return 'Pagada';
      case 'paying': return 'En Proceso de Pago';
      default: return status;
    }
  }},
];

const ReservationTable = () => {
  const [data, setData] = useState<Reservation[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const res = await getReservations({ page, pageSize: pagination.pageSize, search });
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

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-6">Reservas</h1>
      <DataTable
        columns={columns}
        data={data}
        total={total}
        pagination={pagination}
        loading={loading}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onSearch={(term) => fetchData(1, term)}
      />
    </div>
  );
};

export default ReservationTable;
