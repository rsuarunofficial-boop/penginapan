"use client";

import { useState, useEffect } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react";

// 1. Definisikan tipe data agar TypeScript tidak protes 'never'
interface Transaction {
  id: string;
  amount: number;
  room_number: string;
  guest_name: string;
  created_at: string;
  type: 'pemasukan' | 'pengeluaran'; // Tambahkan ini jika ada pengeluaran nanti
}

export default function KeuanganPage() {
  const supabase = createClientSupabase();
  
  // 2. Berikan tipe data <Transaction[]> pada useState
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("Semua");
  const [timeRange, setTimeRange] = useState("Bulan Ini");

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }

  // 3. Kalkulasi sekarang aman karena TS tahu 't' punya property 'amount'
  const totalPemasukan = transactions
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  const totalPengeluaran = 0; 
  const labaBersih = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-8 w-full pb-10">
      {/* ... bagian header sama seperti sebelumnya ... */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards dengan format mata uang Indonesia */}
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Total Pemasukan</p>
              <h2 className="text-2xl font-bold text-gray-900">
                Rp {totalPemasukan.toLocaleString('id-ID')}
              </h2>
            </div>
            <ArrowUpCircle className="text-emerald-500" size={40} />
          </CardContent>
        </Card>
        {/* ... Card lainnya ... */}
      </div>

      {/* Tabel Riwayat Asli dari Database */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Riwayat Transaksi</h3>
          {loading && <span className="text-sm text-gray-400">Memuat data...</span>}
        </div>
        <div className="divide-y">
          {transactions.length === 0 && !loading ? (
            <div className="p-10 text-center text-gray-400">Belum ada transaksi recorded.</div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <ArrowUpCircle size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Pembayaran {t.guest_name} - Kamar {t.room_number}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-emerald-600">
                  + Rp {Number(t.amount).toLocaleString('id-ID')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
