import { createServerSupabase } from "@/lib/supabase/server";
import RoomTable from "@/components/admin/RoomTable";

export const dynamic = "force-dynamic";

export default async function KamarPage() {
  // ✅ WAJIB buat supabase client dulu
  const supabase = await createServerSupabase();

  // Ambil data kamar
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .order("nomor_kamar", { ascending: true });

  if (error) {
    console.error("Error fetching rooms:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manajemen Kamar
        </h1>
        <p className="text-gray-600">
          Tambah, edit, atau hapus kamar Wisma Amri
        </p>
      </div>

      <RoomTable initialRooms={rooms ?? []} />
    </div>
  );
}
