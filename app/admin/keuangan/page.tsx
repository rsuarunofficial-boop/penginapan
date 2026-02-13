"use client";

import { useState, useEffect } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, TrendingUp, X } from "lucide-react";
import FinancialChart from "@/components/admin/FinancialChart";

interface Transaction {
  id: string;
  amount: number;
  room_number: string;
  guest_name: string;
  created_at: string;
  type: 'pemasukan' | 'pengeluaran';
}

export default function KeuanganPage() {
  const supabase = createClientSupabase();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // State untuk form transaksi baru
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "pengeluaran"
  });

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

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Jika pengeluaran, ubah nominal menjadi negatif
      const finalAmount = formData.type === "pengeluaran" 
        ? -Math.abs(Number(formData.amount)) 
        : Math.abs(Number(formData.amount));

      const { error } = await supabase
        .from("transactions")
        .insert([{
          guest_name: formData.description,
          amount: finalAmount,
          room_number: "NON-KAMAR",
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      setShowModal(false);
      setFormData({ description: "", amount: "", type: "pengeluaran" });
      fetchTransactions();
    } catch (err) {
      alert("Gagal menambah transaksi");
    }
  };

  // Kalkulasi Statistik
  const totalPemasukan = transactions
    .filter(t => Number(t.amount) > 0)
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  const totalPengeluaran = transactions
    .filter(t => Number(t.amount) < 0)
    .reduce((acc, curr) => acc + Math.abs(Number(curr.amount)), 0);

  const labaBersih = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-8 w-full pb-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Keuangan</h1>
          <p className="text-gray-500">Kelola arus kas Wisma Amri</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Tambah Transaksi
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Total Pemasukan</p>
              <h2 className="text-2xl font-bold">Rp {totalPemasukan.toLocaleString('id-ID')}</h2>
            </div>
            <ArrowUpCircle className="text-emerald-500" size={40} />
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Pengeluaran</p>
              <h2 className="text-2xl font-bold">Rp {totalPengeluaran.toLocaleString('id-ID')}</h2>
            </div>
            <ArrowDownCircle className="text-red-500" size={40} />
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-sm font-medium">Laba Bersih</p>
              <h2 className="text-2xl font-bold">Rp {labaBersih.toLocaleString('id-ID')}</h2>
            </div>
            <TrendingUp className="text-blue-500" size={40} />
          </CardContent>
        </Card>
      </div>
      
      {/* Grafik */}
      <Card className="p-6 bg-white shadow-sm border rounded-2xl">
        <FinancialChart transactions={transactions} />
      </Card>

      {/* Tabel Riwayat */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg">Riwayat Transaksi</h3>
          {loading && <span className="text-sm text-gray-400">Memuat data...</span>}
        </div>
        <div className="divide-y">
          {transactions.length === 0 && !loading ? (
            <div className="p-10 text-center text-gray-400">Belum ada transaksi recorded.</div>
          ) : (
            transactions.map((t) => {
              const isIncome = Number(t.amount) > 0;
              return (
                <div key={t.id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {isIncome ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {t.room_number === "NON-KAMAR" ? t.guest_name : `Pembayaran ${t.guest_name} - Kamar ${t.room_number}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isIncome ? "+" : "-"} Rp {Math.abs(Number(t.amount)).toLocaleString('id-ID')}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- CUSTOM MODAL TAMBAH TRANSAKSI --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Tambah Transaksi</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'pengeluaran'})}
                    className={`flex-1 py-2 rounded-lg border font-medium transition-all ${formData.type === 'pengeluaran' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600'}`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'pemasukan'})}
                    className={`flex-1 py-2 rounded-lg border font-medium transition-all ${formData.type === 'pemasukan' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600'}`}
                  >
                    Pemasukan
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <Input 
                  required
                  placeholder="Contoh: Bayar Listrik / Air"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                <Input 
                  required
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}