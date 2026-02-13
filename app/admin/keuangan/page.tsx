"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, ArrowUpCircle, ArrowDownCircle, TrendingUp, 
  X, Trash2, Pencil, Calendar, Download, FileSpreadsheet, FileText 
} from "lucide-react";
import FinancialChart from "@/components/admin/FinancialChart";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ description: "", amount: "", type: "pengeluaran" });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("Semua Waktu");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      const now = new Date();
      if (timeRange === "Bulan Ini") {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        query = query.gte("created_at", firstDay);
      } else if (timeRange === "Bulan Lalu") {
        const firstDayLalu = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastDayLalu = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
        query = query.gte("created_at", firstDayLalu).lte("created_at", lastDayLalu);
      } else if (timeRange === "3 Bulan Terakhir") {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
        query = query.gte("created_at", threeMonthsAgo);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, timeRange]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter(t => 
    t.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.room_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FUNGSI EXPORT ---
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTransactions.map((t) => ({
        Tanggal: new Date(t.created_at).toLocaleDateString("id-ID"),
        Keterangan: t.room_number === "NON-KAMAR" ? t.guest_name : `Sewa Kamar ${t.room_number}`,
        Tipe: t.amount > 0 ? "Pemasukan" : "Pengeluaran",
        Nominal: Math.abs(t.amount),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, `Laporan_Keuangan_Wisma_Amri_${timeRange.replace(" ", "_")}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Laporan Keuangan Wisma Amri - ${timeRange}`, 14, 15);
    const tableRows = filteredTransactions.map((t) => [
      new Date(t.created_at).toLocaleDateString("id-ID"),
      t.room_number === "NON-KAMAR" ? t.guest_name : `Sewa Kamar ${t.room_number}`,
      t.amount > 0 ? "Pemasukan" : "Pengeluaran",
      `Rp ${Math.abs(t.amount).toLocaleString("id-ID")}`,
    ]);
    autoTable(doc, {
      head: [["Tanggal", "Keterangan", "Tipe", "Nominal"]],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] }
    });
    doc.save(`Laporan_Keuangan_Wisma_Amri_${timeRange.replace(" ", "_")}.pdf`);
  };

  // --- LOGIKA MODAL ---
  const openEditModal = (t: Transaction) => {
    setEditId(t.id);
    setFormData({
      description: t.guest_name,
      amount: Math.abs(t.amount).toString(),
      type: t.amount > 0 ? "pemasukan" : "pengeluaran"
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ description: "", amount: "", type: "pengeluaran" });
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalAmount = formData.type === "pengeluaran" 
        ? -Math.abs(Number(formData.amount)) 
        : Math.abs(Number(formData.amount));
      const payload = { guest_name: formData.description, amount: finalAmount };
      if (editId) {
        const { error } = await supabase.from("transactions").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("transactions").insert([{
          ...payload, room_number: "NON-KAMAR", created_at: new Date().toISOString()
        }]);
        if (error) throw error;
      }
      closeModal();
      fetchTransactions();
    } catch (err) {
      alert("Gagal menyimpan transaksi");
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Hapus transaksi ini?")) return;
    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  const totalPemasukan = filteredTransactions.filter(t => t.amount > 0).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalPengeluaran = filteredTransactions.filter(t => t.amount < 0).reduce((acc, curr) => acc + Math.abs(Number(curr.amount)), 0);
  const labaBersih = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-8 w-full pb-10 relative">
      {/* HEADER & NAVIGASI TOMBOL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Keuangan</h1>
          <p className="text-gray-500">Kelola arus kas Wisma Amri</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button onClick={exportToExcel} variant="outline" className="flex-1 md:flex-none border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="flex-1 md:flex-none border-red-200 text-red-700 hover:bg-red-50 rounded-xl">
            <FileText className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button onClick={() => setShowModal(true)} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100">
            <Plus className="mr-2 h-4 w-4" /> Tambah Transaksi
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50/50 border-emerald-100 p-6 flex justify-between items-center rounded-2xl">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Total Pemasukan</p>
              <h2 className="text-2xl font-bold text-gray-900">Rp {totalPemasukan.toLocaleString('id-ID')}</h2>
            </div>
            <ArrowUpCircle className="text-emerald-500" size={40} />
        </Card>
        <Card className="bg-red-50/50 border-red-100 p-6 flex justify-between items-center rounded-2xl">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Pengeluaran</p>
              <h2 className="text-2xl font-bold text-gray-900">Rp {totalPengeluaran.toLocaleString('id-ID')}</h2>
            </div>
            <ArrowDownCircle className="text-red-500" size={40} />
        </Card>
        <Card className="bg-blue-50/50 border-blue-100 p-6 flex justify-between items-center rounded-2xl">
            <div>
              <p className="text-blue-600 text-sm font-medium">Laba Bersih</p>
              <h2 className="text-2xl font-bold text-gray-900">Rp {labaBersih.toLocaleString('id-ID')}</h2>
            </div>
            <TrendingUp className="text-blue-500" size={40} />
        </Card>
      </div>
      
      <Card className="p-6 bg-white shadow-sm border rounded-2xl">
        <FinancialChart transactions={filteredTransactions} />
      </Card>

      {/* FILTER SECTION */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10 rounded-xl border-gray-200" 
            placeholder="Cari transaksi atau nomor kamar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Calendar className="text-gray-400 hidden md:block" size={20} />
          <select 
            className="w-full md:w-48 p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all cursor-pointer"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>Semua Waktu</option>
            <option>Bulan Ini</option>
            <option>Bulan Lalu</option>
            <option>3 Bulan Terakhir</option>
          </select>
        </div>
      </div>

      {/* RIWAYAT TRANSAKSI */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg text-gray-800">Riwayat Transaksi</h3>
          {loading && <span className="text-sm text-blue-600 animate-pulse font-medium">Sinkronisasi...</span>}
        </div>
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Tidak ada transaksi ditemukan.</div>
          ) : (
            filteredTransactions.map((t) => {
              const isIncome = t.amount > 0;
              return (
                <div key={t.id} className="p-4 hover:bg-gray-50/80 flex justify-between items-center group transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {isIncome ? <ArrowUpCircle size={22} /> : <ArrowDownCircle size={22} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">
                        {t.room_number === "NON-KAMAR" ? t.guest_name : `Pembayaran ${t.guest_name} - Kamar ${t.room_number}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-black text-right ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isIncome ? "+" : "-"} Rp {Math.abs(t.amount).toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(t)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => deleteTransaction(t.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL EDIT / TAMBAH */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">{editId ? "Edit Transaksi" : "Tambah Transaksi"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveTransaction} className="p-6 space-y-5">
              <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
                <button type="button" onClick={() => setFormData({...formData, type: 'pengeluaran'})} className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${formData.type === 'pengeluaran' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}>Pengeluaran</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'pemasukan'})} className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${formData.type === 'pemasukan' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}>Pemasukan</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Keterangan</label>
                  <Input required className="rounded-xl mt-1.5 border-gray-200" placeholder="Listrik, Air, Gaji..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Nominal (Rp)</label>
                  <Input required type="number" className="rounded-xl mt-1.5 border-gray-200" placeholder="0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" className="flex-1 rounded-xl py-6" onClick={closeModal}>Batal</Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-6 shadow-lg shadow-blue-100">
                  {editId ? "Simpan Perubahan" : "Simpan Transaksi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}