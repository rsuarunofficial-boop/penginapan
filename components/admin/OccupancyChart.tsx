"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function OccupancyChart({ rooms }: any) {
  // State untuk memastikan komponen sudah terpasang di browser (Client-side)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = rooms?.length || 0;
  const booked = rooms?.filter(
    (r: any) => r.status === "booked"
  ).length || 0;
  const available = total - booked;

  const data = [
    { name: "Terisi", value: booked, color: "#ef4444" }, // Merah (Tailwind red-500)
    { name: "Tersedia", value: available, color: "#3b82f6" }, // Biru (Tailwind blue-500)
  ];

  // Jika belum mounted (SSR), tampilkan kontainer kosong dengan tinggi tetap
  // agar layout tidak bergeser (layout shift) saat hydration.
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tingkat Hunian</h2>
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-400">Memuat Chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Tingkat Hunian
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        {/* Tambahkan minWidth={0} untuk menghilangkan warning di terminal */}
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}