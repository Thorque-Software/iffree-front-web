"use client";
import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { findPlaces, getPlaceName, placesDetails } from "@/services/ApiHandler";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface Suggestion {
  text: string;
  placeId: string;
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const res = await getPlaceName(lat, lng);
  return res?.place ?? null;
}

function LocationMarker({
  setLocation,
}: {
  setLocation: (lat: number, lng: number) => void;
}) {
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
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Si ya hay coordenadas iniciales → reverse geocode
  useEffect(() => {
    if (value.lat && value.lng) {
      reverseGeocode(value.lat, value.lng).then(
        (addr) => addr && setSearch(addr)
      );
    }
  }, [value.lat, value.lng]);

  // Autocompletar con debounce
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const results = await findPlaces(search);
      setSuggestions(results);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // Selección de sugerencia
  const handleSelect = async (selectedText: string) => {
    setSearch(selectedText);
    setSuggestions([]);

    const s = suggestions.find((s) => s.text === selectedText);
    if (!s) return;

    const coords = await placesDetails(s.placeId);
    if (coords) {
      onChange({ lat: coords.latitude, lng: coords.longitude });
    } else {
      Swal.fire({
        icon: "error",
        title: "No se pudo obtener coordenadas",
      });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    onChange({ lat, lng });
    reverseGeocode(lat, lng).then((addr) => addr && setSearch(addr));
  };

  return (
    <div className="space-y-2 relative">
      <Combobox value={search} onChange={handleSelect}>
        <div className="relative flex-1">
          <Combobox.Input
            className="w-full bg-white rounded-md border border-gray-300 p-2"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar dirección..."
          />
          {suggestions.length > 0 && (
            <Combobox.Options
              className="
                absolute z-[1000]
                mt-1
                w-full
                bg-white
                border border-gray-300
                rounded-md
                shadow-lg
                max-h-60
                overflow-auto
              "
            >
              {suggestions.map((s) => (
                <Combobox.Option
                  key={s.placeId}
                  value={s.text}
                  className={({ active }) =>
                    `cursor-pointer select-none p-2 text-sm ${
                      active ? "bg-blue-100" : ""
                    }`
                  }
                >
                  {s.text}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>

      <MapContainer
        center={[value.lat ?? -40.7620705, value.lng ?? -71.6472417]}
        zoom={13}
        className="w-full h-64 rounded border z-[0]"
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
