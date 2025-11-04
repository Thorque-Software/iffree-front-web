"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ProfitResponse,Service } from "@/types/domain";

type ProfitChartProps = {
  fetchProfit: (year: number, month: number) => Promise<ProfitResponse>;
  services: Service[];
};

export default function ProfitChart({
  fetchProfit,
  services,
}: ProfitChartProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [data, setData] = useState<{ name: string; profit: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const profitData = await fetchProfit(year, month);
      const mappedData = profitData.subtotals.map((s) => {
        const service = services.find((srv) => srv.id === s.serviceId);
        return {
          name: service?.name || "Desconocido",
          profit: s.totalProfit,
        };
      });
      setData(mappedData);
    } catch (err) {
      console.error("Error fetching profit data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (services.length > 0) handleFetch();
  }, [year, month, services]);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl mx-auto border border-gray-200">
      {/* Header: Selectores y botón */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleFetch}
          disabled={loading}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {/* Gráfico */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="profit" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-700">
          Total mensual:{" "}
          <span className="font-semibold text-gray-900">
            {data.reduce((acc, cur) => acc + cur.profit, 0).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </span>
        </p>
      </div>
    </div>
  );
}
