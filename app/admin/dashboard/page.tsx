import { createServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import StatusGrid from "@/components/admin/StatusGrid";
import OccupancyChart from "@/components/admin/OccupancyChart";
import RevenueChart from "@/components/admin/RevenueChart";
import ReloadButton from "@/components/admin/ReloadButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .order("nomor_kamar", { ascending: true });

  if (error) {
    console.error("Error fetching rooms:", error);
  }

  const safeRooms = rooms || [];
  const totalKamar = safeRooms.length;
  const kamarTerisi = safeRooms.filter((r) => r.status === "booked").length;
  const kamarTersedia = totalKamar - kamarTerisi; // Metrik tambahan untuk mengisi ruang
  const tingkatHunian = totalKamar > 0 ? ((kamarTerisi / totalKamar) * 100).toFixed(1) : "0";

  return (
    // Menggunakan w-full agar konten melebar maksimal
    <div className="space-y-8 w-full animate-in fade-in duration-500">
      
      {/* Header Section: Dibuat lebih rapi */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time monitoring sistem manajemen Wisma Amri</p>    
        </div>
        <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Sistem Aktif
            </span>
            <ReloadButton />
        </div>
      </div>
      

      {/* KPI Section: Diubah menjadi 4 kolom pada layar besar untuk mengurangi ruang kosong */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Kamar</p>
            <h2 className="text-4xl font-bold mt-2 text-gray-800">{totalKamar}</h2>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Kamar Terisi</p>
            <h2 className="text-4xl font-bold mt-2 text-red-500">{kamarTerisi}</h2>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Kamar Tersedia</p>
            <h2 className="text-4xl font-bold mt-2 text-emerald-600">{kamarTersedia}</h2>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tingkat Hunian</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold mt-2 text-blue-600">{tingkatHunian}</h2>
                <span className="text-xl font-semibold text-blue-400">%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Kamar Section: Diberi padding background agar lebih kontras */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Status Kamar Saat Ini</h2>
            <span className="text-sm text-gray-400 italic">* Klik kartu untuk ubah status</span>
        </div>
        <StatusGrid initialRooms={safeRooms} />
      </div>

      {/* CHART SECTION: Menggunakan 2XL grid untuk layar ultra-lebar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <OccupancyChart rooms={safeRooms} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <RevenueChart rooms={safeRooms} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}