"use client";

import { useState } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import RoomForm from "./RoomForm";
import { Pencil, Trash2, Plus } from "lucide-react"; // Import Ikon

export default function RoomTable({ initialRooms }: any) {
  const supabase = createClientSupabase();

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
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b bg-gray-50/50">
        <h2 className="font-bold text-lg text-gray-800">
          Daftar Kamar
        </h2>

        <button
          onClick={() => setEditingRoom({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium shadow-sm"
        >
          <Plus size={18} /> Tambah Kamar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/30 border-b text-gray-500">
              <th className="text-left py-4 px-6 font-semibold">No. Kamar</th>
              <th className="text-left py-4 px-6 font-semibold">Tipe</th>
              <th className="text-left py-4 px-6 font-semibold">Harga</th>
              <th className="text-left py-4 px-6 font-semibold">Status</th>
              <th className="text-center py-4 px-6 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Belum ada data kamar.
                </td>
              </tr>
            ) : (
              rooms.map((room: any) => (
                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 font-medium text-gray-900">{room.nomor_kamar}</td>
                  <td className="py-4 px-6 text-gray-600 capitalize">{room.tipe}</td>
                  <td className="py-4 px-6 text-gray-600">
                    Rp {Number(room.harga).toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider ${
                      room.status === 'available' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                    }`}>
                      {room.status === 'available' ? 'Tersedia' : 'Terisi'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingRoom(room)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Kamar"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => deleteRoom(room.id)}
                        disabled={loadingId === room.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                        title="Hapus Kamar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingRoom !== null && (
        <RoomForm
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={(savedRoom: any) => {
            if (editingRoom.id) {
              setRooms((prev: any[]) =>
                prev.map((r) =>
                  r.id === savedRoom.id ? savedRoom : r
                )
              );
            } else {
              setRooms((prev: any[]) => [...prev, savedRoom]);
            }
            setEditingRoom(null);
          }}
        />
      )}
    </div>
  );
}