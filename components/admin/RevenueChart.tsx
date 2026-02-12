"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function RevenueChart({ rooms }: any) {
  const bookedRooms = rooms.filter(
    (r: any) => r.status === "booked"
  );

  const totalRevenue = bookedRooms.reduce(
    (sum: number, r: any) => sum + r.harga,
    0
  );

  const data = [
    { name: "Pendapatan", value: totalRevenue },
    { name: "Kosong", value: 0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Estimasi Pendapatan
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
            >
              {data.map((entry, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-center font-bold text-lg">
        Rp {totalRevenue.toLocaleString()}
      </p>
    </div>
  );
}
