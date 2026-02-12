"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users } from "lucide-react";

export default function StatusGrid({ initialRooms }: any) {
  const [rooms, setRooms] = useState(initialRooms);

  const toggleStatus = async (room: any) => {
    const newStatus =
      room.status === "booked" ? "available" : "booked";

    const { error } = await supabase
      .from("rooms")
      .update({ status: newStatus })
      .eq("id", room.id);

    if (!error) {
      setRooms((prev: any) =>
        prev.map((r: any) =>
          r.id === room.id
            ? { ...r, status: newStatus }
            : r
        )
      );
    }
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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
            <div className="flex items-center justify-center gap-1 text-xs mt-2">
              <Users size={14} />
              {room.kapasitas} orang
            </div>
          </div>
        );
      })}
    </div>
  );
}
