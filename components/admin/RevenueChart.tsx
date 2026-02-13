"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RevenueChartProps {
  rooms: any[];
}

export default function RevenueChart({ rooms }: RevenueChartProps) {
  // Mengolah data pendapatan berdasarkan tipe kamar
  const data = rooms.reduce((acc: any[], room: any) => {
    const existingType = acc.find((item) => item.name === room.tipe);
    if (existingType) {
      existingType.value += room.status === "booked" ? room.harga : 0;
    } else {
      acc.push({
        name: room.tipe,
        value: room.status === "booked" ? room.harga : 0,
      });
    }
    return acc;
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="w-full h-[350px] mt-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-700"> Estimasi Pendapatan per Tipe</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `Rp ${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: "#f9fafb" }}
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
            /* PERBAIKAN KRUSIAL: Menggunakan tipe 'any' dan pengecekan eksplisit 
               untuk menghindari error build di Vercel 
            */
            formatter={(value: any) => [
              `Rp ${Number(value).toLocaleString("id-ID")}`,
              "Pendapatan"
            ]}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}