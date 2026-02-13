"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface OccupancyChartProps {
  rooms: any[];
}

export default function OccupancyChart({ rooms }: OccupancyChartProps) {
  // Mengolah data untuk menghitung jumlah kamar tersedia vs terisi
  const stats = rooms.reduce(
    (acc, room) => {
      if (room.status === "booked") {
        acc.booked += 1;
      } else {
        acc.available += 1;
      }
      return acc;
    },
    { booked: 0, available: 0 }
  );

  const data = [
    { name: "Terisi", value: stats.booked },
    { name: "Tersedia", value: stats.available },
  ];

  // Warna: Merah untuk Terisi, Hijau/Emerald untuk Tersedia
  const COLORS = ["#ef4444", "#10b981"];

  return (
    <div className="w-full h-[350px] mt-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center md:text-left">
        Persentase Hunian
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
            /* PERBAIKAN UNTUK VERCEL: 
               Memastikan formatter menerima nilai yang valid untuk menghindari Type Error 
            */
            formatter={(value: any) => [`${value} Kamar`, "Status"]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-sm font-medium text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}