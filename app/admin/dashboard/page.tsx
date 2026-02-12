import { createServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import StatusGrid from "@/components/admin/StatusGrid";
import OccupancyChart from "@/components/admin/OccupancyChart";
import RevenueChart from "@/components/admin/RevenueChart";
import ReloadButton from "@/components/admin/ReloadButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Pastikan pemanggilan createServerSupabase sesuai dengan library Anda.
  // Jika menggunakan @supabase/ssr atau auth-helpers versi terbaru, 
  // fungsi ini seringkali tidak memerlukan 'await' di level inisialisasi client.
  const supabase = await createServerSupabase();

  // 2. Mengambil data kamar dari database
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .order("nomor_kamar", { ascending: true });

  // Penanganan jika ada error database agar tidak crash
  if (error) {
    console.error("Error fetching rooms:", error);
  }

  // 3. Kalkulasi data untuk KPI
  const safeRooms = rooms || [];
  const totalKamar = safeRooms.length;
  const kamarTerisi = safeRooms.filter((r) => r.status === "booked").length;
  const tingkatHunian = totalKamar > 0 ? ((kamarTerisi / totalKamar) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di sistem manajemen Wisma Amri</p>    
      </div>
        <ReloadButton /> {/* Pasang di sini */}</div>
      

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm">Total Kamar</p>
            <h2 className="text-3xl font-bold">{totalKamar}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm">Kamar Terisi</p>
            <h2 className="text-3xl font-bold text-red-500">{kamarTerisi}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm">Tingkat Hunian</p>
            <h2 className="text-3xl font-bold text-blue-600">{tingkatHunian}%</h2>
          </CardContent>
        </Card>
      </div>

      {/* Status Kamar Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Status Kamar</h2>
        {/* Menggunakan safeRooms untuk memastikan array tidak null */}
        <StatusGrid initialRooms={safeRooms} />
      </div>

      {/* CHART SECTION dengan MIN-H */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card dengan min-h dan overflow-hidden untuk kestabilan chart */}
        <Card className="min-h-[400px] flex flex-col overflow-hidden">
          <CardContent className="p-6 flex-1 w-full">
            <OccupancyChart rooms={safeRooms} />
          </CardContent>
        </Card>

        <Card className="min-h-[400px] flex flex-col overflow-hidden">
          <CardContent className="p-6 flex-1 w-full">
            <RevenueChart rooms={safeRooms} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}