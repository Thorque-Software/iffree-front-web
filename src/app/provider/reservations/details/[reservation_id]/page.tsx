'use client';

import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Swal from 'sweetalert2';
import { DataTable } from '@/components/DataTable';
import { Reservation, FinalUser } from '@/types/domain';
import { getReservationProviderById, DeleteProviderReservation,PutProviderReservationStatus, PutProviderReservationToConfirm } from '@/services/ApiHandler';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';


const attendeeColumns: ColumnDef<FinalUser>[] = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'lastname', header: 'Apellido' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'docNumber', header: 'Documento' },
  { accessorKey: 'dateOfBirth', header: 'Nacimiento' },
];

const reservationSelectStatuses = [
  { label: 'En Proceso de Pago', value: 'paying' },
  { label: 'Pagada', value: 'payed' },
];

const reservationStatuses = [
  { label: 'Por Confirmar', value: 'to_confirm' },
  { label: 'Por Pagar', value: 'to_pay' },
  { label: 'Pagada', value: 'payed' },
  { label: 'En Proceso de Pago', value: 'paying' },
  { label: 'Cancelada', value: 'cancelled' },
];

interface ReservationDetailProps {
  params: Promise<{ reservation_id: string }>;
}

const ReservationDetail = ({ params }: ReservationDetailProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");
  const { reservation_id } = React.use(params);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (providerIdParams?: string) => {
    setLoading(true);
    const providerIdToUse = providerIdParams || providerId;
    try {
      const res = await getReservationProviderById(providerIdToUse, reservation_id);
      setReservation(res);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (user && user.providerId) {
      setProviderId(user.providerId);
      fetchData(user.providerId);
    }
  }, [reservation_id,user]);

  const handleChangeStatus = async (newStatus: string) => {
    if (!reservation) return;
    try {
      if(newStatus==="decline" || newStatus==="confirm"){
        await PutProviderReservationToConfirm(providerId, reservation_id, newStatus as "confirm" | "decline");
      }else await PutProviderReservationStatus(providerId, reservation_id, newStatus);
      Swal.fire('Actualizado', 'El estado de la reserva fue actualizado', 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Sí, cancelar',
    });

    if (result.isConfirmed) {
      try {
        await DeleteProviderReservation(providerId, reservation_id);
        Swal.fire('Cancelada', 'La reserva fue cancelada', 'success');
        router.push('/provider/reservations');
      } catch (error) {
        Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
      }
    }
  };

  if (loading || !reservation) {
    return <p className="text-center py-6">Cargando reserva...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold mb-2">Reserva #{reservation.id}</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          onClick={handleCancelReservation}
        >
          Cancelar Reserva
        </button>
      </div>

      {/* Info de la reserva */}
      <div className="grid bg-white grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow">
        <div>
          <h2 className="text-xl font-semibold mb-2">Reserva</h2>
          <ul className="space-y-1 text-gray-800">
            <li>
              <strong>Estado:</strong>{' '}
              {reservation.status === "to_confirm" ? (             
                <div className="flex gap-2">
                  <span className="ml-2 text-red-600 font-semibold">Por Confirmar</span>
                  <button
                    onClick={() => handleChangeStatus("confirm")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleChangeStatus("decline")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Rechazar
                  </button>
                </div>
              ) : reservation.finalUser ? (
                // Caso 1: tiene finalUser y status != to_confirm → solo mostrar texto
                <span className="ml-2">{reservationStatuses.find(s => s.value === reservation.status)?.label || reservation.status}</span>
              ) : (
                // Caso 2: no tiene finalUser → select editable
                <select
                  value={reservation.status}
                  onChange={(e) => handleChangeStatus(e.target.value)}
                  className="border p-1 rounded"
                >
                  {reservationSelectStatuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}
            </li>
            <li><strong>Precio Final:</strong> ${reservation?.finalPrice}</li>
            <li><strong>Creada:</strong> {new Date(reservation.createdAt).toLocaleString()}</li>
          </ul>
        </div>
        {reservation.finalUser && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Usuario Final</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>Nombre:</strong> {reservation.finalUser.name} {reservation.finalUser.lastname}</li>
            <li><strong>Email:</strong> {reservation.finalUser.email}</li>
            <li><strong>Documento:</strong> {reservation.finalUser.docNumber}</li>
            <li><strong>Fecha Nac.:</strong> {reservation.finalUser.dateOfBirth}</li>
          </ul>
        </div>
      )}
      </div>
      

      {/* Info del turno */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Turno</h2>
        <ul className="space-y-1 text-gray-800">
          <li><strong>Servicio:</strong> {reservation.shift.service?.name}</li>
          <li><strong>Descripción:</strong> {reservation.shift.service?.description}</li>
          <li><strong>Inicio:</strong> {new Date(reservation.shift?.start).toLocaleString()}</li>
          <li><strong>Fin:</strong> {new Date(reservation.shift?.end).toLocaleString()}</li>
          <li><strong>Capacidad:</strong> {reservation.shift?.maxCapacity}</li>
        </ul>
      </div>

      {/* Tabla de asistentes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Asistentes</h2>
        <DataTable
          columns={attendeeColumns}
          data={reservation.attendees}
          total={reservation.attendees.length}
          pagination={{ page: 1, pageSize: reservation.attendees.length }}
          loading={false}
          onPageChange={() => {}}
          searchable={false}
        />
      </div>
    </div>
  );
};

export default ReservationDetail;
