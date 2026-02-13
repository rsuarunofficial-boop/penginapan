"use client";

import { useState, useEffect } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react";

export default function KeuanganPage() {
  const supabase = createClientSupabase();
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("Semua");
  const [timeRange, setTimeRange] = useState("Bulan Ini");

  // Hitung Statistik
  const totalPemasukan = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalPengeluaran = 0; // Bisa dikembangkan jika ada tabel pengeluaran
  const labaBersih = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-8 w-full pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Keuangan</h1>
          <p className="text-gray-500">Kelola pemasukan dan pengeluaran wisma</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Tambah Transaksi
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Total Pemasukan</p>
              <h2 className="text-2xl font-bold text-gray-900">Rp {totalPemasukan.toLocaleString('id-ID')}</h2>
            </div>
            <ArrowUpCircle className="text-emerald-500" size={40} />
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Pengeluaran</p>
              <h2 className="text-2xl font-bold text-gray-900">Rp {totalPengeluaran.toLocaleString('id-ID')}</h2>
            </div>
            <ArrowDownCircle className="text-red-500" size={40} />
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-sm font-medium">Laba Bersih</p>
              <h2 className="text-2xl font-bold text-gray-900">Rp {labaBersih.toLocaleString('id-ID')}</h2>
            </div>
            <TrendingUp className="text-blue-500" size={40} />
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input className="pl-10" placeholder="Cari transaksi..." />
        </div>
        <div className="flex gap-2">
          {["Semua", "Pemasukan", "Pengeluaran"].map(type => (
            <Button 
              key={type}
              variant={filterType === type ? "default" : "outline"}
              onClick={() => setFilterType(type)}
              className="rounded-full"
            >
              {type}
            </Button>
          ))}
        </div>
        <select 
          className="border rounded-lg p-2 bg-white outline-none focus:ring-2 ring-blue-500"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option>Bulan Ini</option>
          <option>Bulan Lalu</option>
          <option>3 Bulan Terakhir</option>
          <option>Semua Waktu</option>
        </select>
      </div>

      {/* Riwayat Transaksi */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg">Riwayat Transaksi</h3>
        </div>
        <div className="divide-y">
          {/* Contoh Baris Transaksi */}
          <div className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                <ArrowUpCircle size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Pembayaran Tamu - Kamar 101</p>
                <p className="text-xs text-gray-500">13 Feb 2026 • Tunai</p>
              </div>
            </div>
            <p className="font-bold text-emerald-600">+ Rp 150.000</p>
          </div>
        </div>
      </div>
    </div>
  );
}