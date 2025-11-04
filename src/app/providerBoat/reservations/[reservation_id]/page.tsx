'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';
import { DeleteProviderBoatReservation, getOneProviderBoatReservation } from '@/services/ApiHandler';
import { ReservationBoat } from '@/types/domain';

// Importar el mapa de forma dinámica
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

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

const ReservationBoatDetail = ({ params }: ReservationDetailProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [reservation, setReservation] = useState<ReservationBoat | null>(null);
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState<string>("");
  const { reservation_id } = React.use(params);

  const fetchReservation = async (providerIdParams?: string) => {
    setLoading(true);
    const providerIdToUse = providerIdParams || providerId;
    try {
      const res = await getOneProviderBoatReservation(providerIdToUse, reservation_id);
      setReservation(res);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo obtener la reserva', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user && user.providerId){
      setProviderId(user.providerId);
      fetchReservation(user.providerId);
    }
  }, [reservation_id, user]);


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
        await DeleteProviderBoatReservation(providerId, reservation.id.toString());
        Swal.fire('Cancelada', 'La reserva fue cancelada correctamente', 'success');
        router.push('/providerBoat/reservations');
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

      {/* Info principal */}
      <div className="grid bg-white grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow">
        {/* Datos de la reserva */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Reserva</h2>
          <ul className="space-y-1 text-gray-800">
            <li>
              <strong>Estado:</strong> {reservationStatuses.find(s => s.value === reservation.status)?.label || reservation.status}
            </li>
            <li><strong>Precio Final:</strong> ${reservation.finalPrice}</li>
            <li><strong>Inicio:</strong> {new Date(reservation.start).toLocaleString()}</li>
            <li><strong>Fin:</strong> {new Date(reservation.end).toLocaleString()}</li>
          </ul>
        </div>

        {/* Datos del usuario */}
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

      {/* Información del bote */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Bote</h2>
        <ul className="space-y-1 text-gray-800">
          <li><strong>Nombre:</strong> {reservation.boat.name}</li>
          <li><strong>Potencia:</strong> {reservation.boat.enginePower} HP</li>
          <li><strong>Capacidad:</strong> {reservation.boat.capacity} personas</li>
          <li><strong>Licencia requerida:</strong> {reservation.boat.licenseType}</li>
          <li><strong>Eslora:</strong> {reservation.boat.eslora} m</li>
          <li><strong>Manga:</strong> {reservation.boat.manga} m</li>
          <li><strong>Puntal:</strong> {reservation.boat.puntal} m</li>
          <li><strong>Autonomía:</strong> {reservation.boat.autonomy} km</li>
        </ul>
      </div>

      {/* Información del muelle */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Muelle</h2>
        <ul className="space-y-1 text-gray-800">
          <li><strong>Nombre:</strong> {reservation.dock.name}</li>
          <li><strong>Boya:</strong> {reservation.dock.boya ? 'Sí' : 'No'}</li>
          <li>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-700">
                <strong>Ubicación:</strong>
                <MapContainer
                center={[reservation.dock.locationLat ?? -40.7620705, reservation.dock.locationLong ?? -71.6472417]}
                zoom={13}
                className="w-full h-64 rounded border col-span-1 sm:col-span-2"
                >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {reservation.dock.locationLat && reservation.dock.locationLong && (
                    <>
                    <Marker position={[reservation.dock.locationLat, reservation.dock.locationLong]}>
                    <Popup>{reservation.dock.name}</Popup>
                    </Marker>
                </>
                )}
                </MapContainer>
            </div>
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default ReservationBoatDetail;
