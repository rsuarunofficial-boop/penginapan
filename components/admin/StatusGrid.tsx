"use client";

import { useState } from "react";
// Pastikan path ini sesuai dengan file yang sudah kita perbaiki sebelumnya
import { createClientSupabase } from "@/lib/supabase/client"; 
import { Users } from "lucide-react";

export default function StatusGrid({ initialRooms }: any) {
  const [rooms, setRooms] = useState(initialRooms);
  
  // PERBAIKAN: Inisialisasi client supabase di dalam komponen
  const supabase = createClientSupabase();

  const toggleStatus = async (room: any) => {
    const newStatus =
      room.status === "booked" ? "available" : "booked";

    // Sekarang variabel 'supabase' sudah terdefinisi
    const { error } = await supabase
      .from("rooms")
      .update({ status: newStatus })
      .eq("id", room.id);

    if (error) {
      console.error("Gagal update status:", error.message);
      return;
    }

    // Update state lokal agar UI berubah seketika
    setRooms((prev: any) =>
      prev.map((r: any) =>
        r.id === room.id
          ? { ...r, status: newStatus }
          : r
      )
    );
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
              cursor-pointer rounded-xl p-4 text-center font-semibold shadow
              transition transform hover:scale-105
              ${
                isBooked
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              }
            `}
          >
            <div className="text-lg">
              {room.nomor_kamar}
            </div>

            <div className="text-xs mt-1">
              {isBooked ? "Terisi" : "Tersedia"}
            </div>

            {/* Kapasitas */}
            <div className="flex items-center justify-center gap-1 text-xs mt-2 opacity-70">
              <Users size={14} />
              {room.kapasitas} orang
            </div>
          </div>
        );
      })}
    </div>
  );
}