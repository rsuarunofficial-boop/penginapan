"use client";

import { useState, useEffect } from "react";
import { createClientSupabase } from "@/lib/supabase/client"; 
import { Users } from "lucide-react";

export default function StatusGrid({ initialRooms }: any) {
  // Gunakan state untuk menyimpan data kamar agar bisa update secara dinamis
  const [rooms, setRooms] = useState(initialRooms);
  const supabase = createClientSupabase();

  // Sinkronisasi state jika initialRooms berubah dari parent (Dashboard)
  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  const toggleStatus = async (room: any) => {
    const newStatus = room.status === "booked" ? "available" : "booked";

    // Optimistic Update: Ubah UI terlebih dahulu agar terasa sangat cepat
    const previousRooms = [...rooms];
    setRooms((prev: any) =>
      prev.map((r: any) =>
        r.id === room.id ? { ...r, status: newStatus } : r
      )
    );

    const { error } = await supabase
      .from("rooms")
      .update({ status: newStatus })
      .eq("id", room.id);

    if (error) {
      console.error("Gagal update status:", error.message);
      // Jika gagal di database, kembalikan ke state sebelumnya
      setRooms(previousRooms);
      alert("Gagal memperbarui status di database.");
      return;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {rooms?.map((room: any) => {
        const isBooked = room.status === "booked";

        return (
          <div
            key={room.id}
            onClick={() => toggleStatus(room)}
            className={`
              cursor-pointer rounded-xl p-4 text-center font-semibold shadow-sm
              transition-all duration-200 transform hover:scale-105 active:scale-95
              border-2
              ${
                isBooked
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
              }
            `}
          >
            <div className="text-xl font-bold">
              {room.nomor_kamar}
            </div>

            <div className={`text-[10px] uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full inline-block ${isBooked ? "bg-red-200" : "bg-emerald-200"}`}>
              {isBooked ? "Terisi" : "Tersedia"}
            </div>

            <div className="flex items-center justify-center gap-1 text-xs mt-3 opacity-80 border-t pt-2 border-current/10">
              <Users size={12} />
              <span>{room.kapasitas} Orang</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}