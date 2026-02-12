"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientSupabase } from "@/lib/supabase/client"; 
import { Users } from "lucide-react";

export default function StatusGrid({ initialRooms }: { initialRooms: any[] }) {
  // Menggunakan fungsi inisialisasi untuk memastikan state sinkron sejak awal
  const [rooms, setRooms] = useState(initialRooms);
  const supabase = createClientSupabase();

  // Sinkronisasi state jika data dari parent (Server Component) berubah
  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  // Menggunakan useCallback untuk stabilitas referensi fungsi
  const toggleStatus = useCallback(async (room: any) => {
    const newStatus = room.status === "booked" ? "available" : "booked";

    // Simpan snapshot untuk rollback jika terjadi error
    const previousRooms = [...rooms];

    // 1. Optimistic Update (UI berubah instan)
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, status: newStatus } : r))
    );

    try {
      const { error } = await supabase
        .from("rooms")
        .update({ status: newStatus })
        .eq("id", room.id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Gagal update status:", error.message);
      // 2. Rollback ke data asli jika database menolak perubahan
      setRooms(previousRooms);
      alert(`Gagal memperbarui kamar ${room.nomor_kamar}. Silakan coba lagi.`);
    }
  }, [rooms, supabase]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {rooms?.map((room) => {
        const isBooked = room.status === "booked";

        return (
          <div
            key={room.id}
            onClick={() => toggleStatus(room)}
            className={`
              group cursor-pointer rounded-xl p-4 text-center font-semibold shadow-sm
              transition-all duration-200 transform hover:scale-[1.03] active:scale-95
              border-2 select-none
              ${
                isBooked
                  ? "bg-red-50 border-red-100 text-red-600 hover:border-red-300 shadow-red-100"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:border-emerald-300 shadow-emerald-100"
              }
            `}
          >
            <div className="text-2xl font-black mb-1">
              {room.nomor_kamar}
            </div>

            <div className={`
              text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md
              ${isBooked ? "bg-red-200/50" : "bg-emerald-200/50"}
            `}>
              {isBooked ? "Terisi" : "Tersedia"}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs mt-3 pt-2 border-t border-current/10 opacity-70 group-hover:opacity-100 transition-opacity">
              <Users size={14} />
              <span>{room.kapasitas} Orang</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}