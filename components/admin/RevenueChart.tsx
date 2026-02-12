"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function RevenueChart({ rooms }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safety check untuk memastikan rooms adalah array
  const safeRooms = rooms || [];

  const bookedRooms = safeRooms.filter(
    (r: any) => r.status === "booked"
  );

  const totalRevenue = bookedRooms.reduce(
    (sum: number, r: any) => sum + (r.harga || 0),
    0
  );

  // Data untuk Pie Chart
  // Jika pendapatan 0, kita beri nilai kecil agar chart tetap muncul (opsional)
  const data = [
    { name: "Pendapatan Aktif", value: totalRevenue || 0 },
  ];

  const COLORS = ["#10b981"]; // Warna hijau (Emerald-500)

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Estimasi Pendapatan</h2>
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-400">Memuat Chart...</p>
        </div>
        <p className="mt-4 text-center font-bold text-lg text-gray-300">Rp 0</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Estimasi Pendapatan
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        {/* Tambahkan minWidth={0} untuk menghilangkan warning terminal */}
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60} // Membuatnya menjadi Donut Chart agar lebih modern
              outerRadius={100}
              paddingAngle={5}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               formatter={(value: number) => `Rp ${value.toLocaleString()}`}
               contentStyle={{ borderRadius: '8px', border: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-center font-bold text-2xl text-emerald-600">
        Rp {totalRevenue.toLocaleString()}
      </p>
    </div>
  );
}