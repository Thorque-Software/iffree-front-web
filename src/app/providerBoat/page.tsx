'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getProviderBoatReservations } from '@/services/ApiHandler';
import { ReservationBoat} from '@/types/domain';
import { DataTable } from '@/components/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'


const columns: ColumnDef<ReservationBoat>[] = [
  {
    accessorKey: 'boat.name',
    header: 'Embarcación',
  },
  {
    accessorKey: 'finalUser',
    header: 'Cliente',
    cell: ({ row }) => {
      const user = row.original.finalUser
      const fullName =
        user?.name || user?.lastname
          ? `${user?.name ?? ''} ${user?.lastname ?? ''}`.trim()
          : 'N/A'
      return fullName
    },
  },
  {
    accessorKey: 'dock.name',
    header: 'Muelle',
  },
  {
    accessorKey: 'start',
    header: 'Fecha de Inicio',
    cell: ({ row }) => format(new Date(row.original.start), 'dd/MM/yyyy', { locale: es }),
  },
  {
    accessorKey: 'end',
    header: 'Fecha de Fin',
    cell: ({ row }) => format(new Date(row.original.end), 'dd/MM/yyyy', { locale: es }),
  },
];

const ShiftsTable = () => {
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");
  const [data, setData] = useState<ReservationBoat[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  const fetchData = async (providerIdParams?: string) => {
    setLoading(true);
    try {
      const providerIdToUse = providerIdParams || providerId;
      const res = await getProviderBoatReservations(providerIdToUse,undefined, undefined, total, pagination);
      setData(res.items);
      setTotal(res.total);
      setPagination((prev) => ({ ...prev, page: pagination.page }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      if(user && user.providerId) {
      setProviderId(user.providerId);
      fetchData(user.providerId);    
      }
    }, [user]);

  useEffect(() => {
      if (!providerId) return;
      fetchData();
    }, [pagination.page]);


  return (
    <div>
      <h1 className="text-4xl font-semibold mb-6">Proximas salidas</h1>
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
  );
};

export default ShiftsTable;
