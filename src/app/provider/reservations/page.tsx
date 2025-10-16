'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getReservationsProvider } from '@/services/ApiHandler';
import { Reservation } from '@/types/domain';
import { DataTable } from '@/components/DataTable';
import { formatDate } from '@/utils/utils';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";


const columns: ColumnDef<Reservation>[] = [
  { accessorKey: 'shift.start', header: 'Inicio', cell: ({ row }) => formatDate(row.original.shift.start) },
  {
    id: 'cliente',
    header: 'Cliente',
    cell: ({ row }) => {
      const { finalUser } = row.original;
      if(!finalUser) return 'N/A';
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
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <Link href={`/provider/reservations/details/${row.original.id}`} className="bg-green-700 text-white px-4 py-2 rounded mr-4">Detalle</Link>
      );
    },
  },
];

const ReservationTable = () => {
  const searchParams = useSearchParams();
  const shiftId = searchParams.get('shiftId') || undefined;
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");
  const [data, setData] = useState<Reservation[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');


  const fetchData = async (page: number, searchParams?: string, filtersParams?: Record<string, any>, providerIdParams?: string) => {
    if (!providerId && !providerIdParams) return;
    setLoading(true);
    try {
      const providerIdToUse = providerIdParams || providerId;
      const sear = searchParams || search;
      const filt = filtersParams || filters;
      const res = await getReservationsProvider(providerIdToUse, { page, pageSize: pagination.pageSize, search: sear, filters: { ...filt, shiftId } });
      setData(res.items);
      setPagination(res.pagination);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && user.providerId) {
      setProviderId(user.providerId);
      fetchData(1, "", filters, user.providerId);
    }
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-semibold mb-6">Reservas</h1>
        <Link href="/provider/reservations/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Nueva Reserva
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={data}
        total={total}
        pagination={pagination}
        loading={loading}
        onPageChange={(page) => fetchData(page)}
        onSearch={(term) => {
          fetchData(1, term);
          setSearch(term);
        }}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          fetchData(1, "", newFilters);
        }}
        filterConfig={[
          { key: 'status', label: 'Estado', type: 'select', options: [
            { label: 'Por Confirmar', value: 'to_confirm' },
            { label: 'Por Pagar', value: 'to_pay' },
            { label: 'Pagada', value: 'payed' },
            { label: 'En Proceso de Pago', value: 'paying' },
          ] },
        ]}
      />
    </div>
  );
};

export default ReservationTable;
