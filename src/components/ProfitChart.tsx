'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

type ProfitData = {
  day: string;
  profit: number;
};

export default function ProfitChart() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [data, setData] = useState<ProfitData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfitData = async (year: number, month: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/providers/1/get-profit?year=${year}&month=${month}`);
      const json = await res.json();
      // Suponiendo que la API devuelve algo como [{ day: '2024-12-01', profit: 100 }, ...]
      setData(json);
    } catch (error) {
      console.error('Error fetching profit data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitData(year, month);
  }, [year, month]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="flex gap-4 mb-4">
        <select value={year} onChange={handleYearChange} className="border p-2 rounded">
          {Array.from({ length: 5 }).map((_, i) => {
            const y = new Date().getFullYear() - 2 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
        <select value={month} onChange={handleMonthChange} className="border p-2 rounded">
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {format(new Date(year, i, 1), 'MMMM')}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="day" tickFormatter={(day) => format(new Date(day), 'dd')} />
            <YAxis />
            <Tooltip labelFormatter={(day) => format(new Date(day), 'PPP')} />
            <Bar dataKey="profit" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
