"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FinancialChartProps {
  transactions: any[];
}

export default function FinancialChart({ transactions }: FinancialChartProps) {
  // PROSES DATA: Mengelompokkan berdasarkan bulan dan memisahkan Pemasukan/Pengeluaran
  const monthlyData = transactions.reduce((acc: any[], curr: any) => {
    const date = new Date(curr.created_at);
    const month = date.toLocaleString('id-ID', { month: 'short' });
    const amount = Number(curr.amount) || 0;
    
    const existing = acc.find(d => d.name === month);
    
    if (existing) {
      if (amount > 0) {
        existing.pemasukan += amount;
      } else {
        existing.pengeluaran += Math.abs(amount);
      }
    } else {
      acc.push({ 
        name: month, 
        pemasukan: amount > 0 ? amount : 0, 
        pengeluaran: amount < 0 ? Math.abs(amount) : 0 
      });
    }
    return acc;
  }, []);

  const sortedData = [...monthlyData].reverse();

  return (
    <div className="w-full h-[350px] mt-4">
      <h3 className="text-lg font-bold mb-6 text-gray-800">Grafik Keuangan</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => value >= 1000000 ? `${value / 1000000}Jt` : value.toLocaleString('id-ID')}
          />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            // PERBAIKAN DI SINI: Menambahkan pengecekan tipe data untuk memuaskan TypeScript
            formatter={(value: any) => {
              const numValue = Number(value);
              return !isNaN(numValue) ? `Rp ${numValue.toLocaleString('id-ID')}` : 'Rp 0';
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="center" 
            iconType="circle" 
            wrapperStyle={{ paddingBottom: '20px' }} 
          />
          <Bar 
            dataKey="pemasukan" 
            name="Pemasukan" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
            barSize={40}
          />
          <Bar 
            dataKey="pengeluaran" 
            name="Pengeluaran" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}