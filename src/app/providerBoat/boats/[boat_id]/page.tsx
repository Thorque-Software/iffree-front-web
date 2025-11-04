'use client';

import React, { useEffect, useState } from 'react';
import { getOneProviderBoat} from '@/services/ApiHandler';
import { Boat } from '@/types/domain';
import { useAuth } from '@/hooks/useAuth';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface BoatDetailProps {
  params: Promise<{ boat_id: string }>;
}

const BoatDetailPage = ({ params }: BoatDetailProps) => {
  const { user } = useAuth();
  const [boat, setBoat] = useState<Boat | null>(null);
  const [loading, setLoading] = useState(false);
  const { boat_id } = React.use(params);

  const fetchBoat = async (providerId: string, boatId: string) => {
    setLoading(true);
    try {
      const res = await getOneProviderBoat(providerId, boatId);
      setBoat(res || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.providerId && boat_id) 
      fetchBoat(user.providerId , boat_id);
  }, [boat_id, user]);

  if (loading || !boat) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        Cargando información del barco...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* HEADER */}
      <header className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{boat.name}</h1>
          <p className="text-gray-600 mt-1">
            {boat.boatType?.name || 'Tipo desconocido'} • {boat.licenseType}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Precio estimado</p>
          <p className="text-3xl font-bold text-blue-600">
            ${boat.price.toLocaleString('es-AR')}
          </p>
        </div>
      </header>

      {/* INFORMACIÓN GENERAL */}
      <section className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Información General</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 text-gray-700">
          <Info label="Capacidad" value={`${boat.capacity} personas`} />
          <Info label="Eslora" value={`${boat.eslora} m`} />
          <Info label="Manga" value={`${boat.manga} m`} />
          <Info label="Puntal" value={`${boat.puntal} m`} />
          <Info label="Autonomía" value={`${boat.autonomy} km`} />
          <Info label="Capacidad del tanque" value={`${boat.tankCapacity} L`} />
          <Info label="Potencia del motor" value={`${boat.enginePower} HP`} />
          <Info
            label="Estado"
            value={boat.status === 'active' ? 'Activo' : 'Inactivo'}
            valueClass={
              boat.status === 'active' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
            }
          />
        </div>
      </section>

      {/* PROVEEDOR */}
      <section className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Proveedor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-700">
          <Info label="Nombre" value={boat.provider.fullname} />
          <Info label="Email" value={boat.provider.email} />
          <Info label="Teléfono" value={boat.provider.phoneNumber || 'No informado'} />
          <Info label="CUIL" value={boat.provider.cuil} />
        </div>
      </section>

      {/* MUELLE */}
      <section className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ubicación del Muelle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-700">
          <Info label="Muelle" value={boat.dock.name} />
          <MapContainer
            center={[boat.dock.locationLat ?? -40.7620705, boat.dock.locationLong ?? -71.6472417]}
            zoom={13}
            className="w-full h-64 rounded border col-span-1 sm:col-span-2"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {boat.dock.locationLat && boat.dock.locationLong && (
              <>
              <Marker position={[boat.dock.locationLat, boat.dock.locationLong]}>
                <Popup>{boat.dock.name}</Popup>
              </Marker>
            </>
            )}
          </MapContainer>
        </div>
      </section>
    </div>
  );
};

/** Subcomponente para filas de información */
const Info = ({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: string | number | null | undefined;
  valueClass?: string;
}) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-base font-medium ${valueClass}`}>
      {value ?? 'No disponible'}
    </span>
  </div>
);

export default BoatDetailPage;
