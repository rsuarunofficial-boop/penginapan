"use client";

import { useState } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import RoomForm from "./RoomForm";

export default function RoomTable({ initialRooms }: any) {
  const supabase = createClientSupabase(); // ✅ WAJIB

  const [rooms, setRooms] = useState(initialRooms ?? []);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const deleteRoom = async (id: string) => {
    const confirmDelete = window.confirm("Hapus kamar ini?");
    if (!confirmDelete) return;

    setLoadingId(id);

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id);

    setLoadingId(null);

    if (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus kamar");
      return;
    }

    setRooms((prev: any[]) =>
      prev.filter((room) => room.id !== id)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Daftar Kamar
        </h2>

        <button
          onClick={() => setEditingRoom({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Kamar
        </button>
      </div>

      {rooms.length === 0 ? (
        <p className="text-gray-500">Belum ada data kamar.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">No</th>
              <th className="text-left py-2">Tipe</th>
              <th className="text-left py-2">Harga</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room: any) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{room.nomor_kamar}</td>
                <td>{room.tipe}</td>
                <td>Rp {room.harga}</td>
                <td>{room.status}</td>
                <td className="space-x-3">
                  <button
                    onClick={() => setEditingRoom(room)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteRoom(room.id)}
                    disabled={loadingId === room.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {loadingId === room.id ? "Menghapus..." : "Hapus"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingRoom !== null && (
        <RoomForm
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={(savedRoom: any) => {
            if (editingRoom.id) {
              // Update
              setRooms((prev: any[]) =>
                prev.map((r) =>
                  r.id === savedRoom.id ? savedRoom : r
                )
              );
            } else {
              // Create
              setRooms((prev: any[]) => [...prev, savedRoom]);
            }

            setEditingRoom(null);
          }}
        />
      )}
    </div>
  );
}
