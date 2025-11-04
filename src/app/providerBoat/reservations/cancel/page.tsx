"use client";

import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getProviderBoats, CancelProviderBoatReservations } from "@/services/ApiHandler"; 
import { Boat } from "@/types/domain";

export default function CancelShiftsView() {
  const router = useRouter();
  const { user } = useAuth();

  const [range, setRange] = useState<any>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<string>("");

  useEffect(() => {
    if (user?.providerId) {
      fetchBoats(user.providerId);
    }
  }, [user]);

  const fetchBoats = async (providerId: string) => {
    try {
      const res = await getProviderBoats(providerId,{page:1,pageSize:100});
      setBoats(res.items);
    } catch (error) {
      console.error("Error fetching boats:", error);
    }
  };

  const handleCancel = async () => {
    if (!selectedBoat) {
      Swal.fire("Error", "Selecciona una embarcación.", "error");
      return;
    }

    Swal.fire({
      title: "¿Cancelar salidas?",
      text: `Se cancelarán las salidas del ${format(range[0].startDate, "dd/MM/yyyy")} al ${format(range[0].endDate, "dd/MM/yyyy")} para la embarcación seleccionada.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await CancelProviderBoatReservations(
            user?.providerId || "",
            Number(selectedBoat),
            range[0].startDate.toISOString(),
            range[0].endDate.toISOString()
          );

          Swal.fire({
            icon: "success",
            title: "Salidas canceladas",
            text: "Las salidas del barco para el rango seleccionado fueron canceladas correctamente.",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => router.push("/providerBoat/reservations"));
        } catch (error) {
          console.error("Error al cancelar salidas:", error);
          Swal.fire({
            icon: "error",
            title: "Error al cancelar",
            text:
              error instanceof Error
                ? error.message
                : "Ha ocurrido un error inesperado.",
          });
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Cancelar Turnos</h1>

      {/* Paso 1: Selección de rango */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          1. Selecciona un rango de fechas
        </h2>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />
        <p className="mt-2 text-sm text-gray-600">
          Desde {format(range[0].startDate, "dd/MM/yyyy")} hasta{" "}
          {format(range[0].endDate, "dd/MM/yyyy")}
        </p>
      </div>

      {/* Paso 2: Selección de barco */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">2. Selecciona un barco</h2>
        <select
          value={selectedBoat}
          onChange={(e) => setSelectedBoat(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">-- Selecciona un barco --</option>
          {boats.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de cancelación */}
      <button
        disabled={!selectedBoat}
        onClick={handleCancel}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar turnos del rango
      </button>
    </div>
  );
}
