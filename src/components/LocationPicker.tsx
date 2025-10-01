"use client";
import { useEffect, useState } from "react";
import { Input } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2";

// Fix Leaflet icons en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// --- Geocoding ---
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await res.json();
  if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  return null;
}

// --- Reverse Geocoding ---
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  return data?.display_name ?? null;
}

// --- Map Helpers ---
function LocationMarker({ setLocation }: { setLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

interface LocationPickerProps {
  value: { lat?: number; lng?: number };
  onChange: (value: { lat?: number; lng?: number }) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [search, setSearch] = useState(""); // solo para buscar
  const [displayAddress, setDisplayAddress] = useState("");

  // Si hay lat/lng iniciales, hacer reverse para mostrar dirección en input
  useEffect(() => {
    if (value.lat && value.lng) {
      reverseGeocode(value.lat, value.lng).then((addr) => {
        if (addr) setDisplayAddress(addr);
      });
    }
  }, [value.lat, value.lng]);

  const handleSearch = async () => {
    if (!search) return;
    const coords = await geocodeAddress(search);
    if (coords) {
      onChange({ lat: coords[0], lng: coords[1] });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Dirección no encontrada',
        text: 'Por favor, intenta con otra dirección.',
      });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    onChange({ lat, lng });
    reverseGeocode(lat, lng).then((addr) => {
      if (addr) setDisplayAddress(addr);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          value={search || displayAddress}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar dirección..."
          className="flex-1 bg-white rounded-md border border-gray-300 p-2"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Buscar
        </button>
      </div>

      <MapContainer
        center={[value.lat ?? -34.603722, value.lng ?? -58.381592]}
        zoom={13}
        className="w-full h-64 rounded border"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {value.lat && value.lng && (
          <>
            <Marker position={[value.lat, value.lng]} />
            <RecenterMap lat={value.lat} lng={value.lng} />
          </>
        )}
        <LocationMarker setLocation={handleMapClick} />
      </MapContainer>
    </div>
  );
}
