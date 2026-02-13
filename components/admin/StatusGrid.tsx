"use client";

import { useState, useEffect } from "react";
import { createClientSupabase } from "@/lib/supabase/client";

export default function StatusGrid({ initialRooms }: { initialRooms: any[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const supabase = createClientSupabase();

  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  const toggleStatus = async (room: any) => {
    // Tentukan status baru
    const isNowBooked = room.status !== "booked";
    const newStatus = isNowBooked ? "booked" : "available";
    
    // 1. Optimistic Update (agar UI langsung berubah tanpa menunggu server)
    const previousRooms = [...rooms];
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, status: newStatus } : r))
    );

    try {
      // 2. Update status kamar di tabel 'rooms'
      const { error: roomError } = await supabase
        .from("rooms")
        .update({ status: newStatus })
        .eq("id", room.id);

      if (roomError) throw roomError;

      // 3. Jika status berubah menjadi 'booked', catat ke tabel 'transactions'
      if (isNowBooked) {
        const { error: transError } = await supabase
          .from("transactions")
          .insert([
            {
              room_id: room.id,
              room_number: room.nomor_kamar,
              amount: room.harga || 0, // Pastikan kolom 'harga' ada di tabel rooms Anda
              guest_name: "Tamu Umum", // Anda bisa kembangkan ini dengan modal input nama nanti
              check_in: new Date().toISOString(),
            },
          ]);

        if (transError) throw transError;
        console.log("Transaksi berhasil dicatat");
      }
    } catch (error) {
      console.error("Gagal memproses perubahan:", error);
      alert("Terjadi kesalahan saat memperbarui data.");
      // Rollback UI jika gagal
      setRooms(previousRooms);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {rooms?.map((room) => (
        <div
          key={room.id}
          onClick={() => toggleStatus(room)}
          className={`cursor-pointer rounded-2xl p-5 text-center border-2 transition-all duration-200 active:scale-95 shadow-sm ${
            room.status === "booked" 
            ? "bg-red-50 border-red-200 text-red-600 shadow-red-100" 
            : "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-emerald-100"
          }`}
        >
          <div className="text-2xl font-black">{room.nomor_kamar}</div>
          <div className={`text-[10px] font-bold uppercase mt-2 px-3 py-1 rounded-full inline-block ${
            room.status === "booked" ? "bg-red-200/50" : "bg-emerald-200/50"
          }`}>
            {room.status === "booked" ? "Terisi" : "Tersedia"}
          </div>
        </div>
      ))}
    </div>
  );
}