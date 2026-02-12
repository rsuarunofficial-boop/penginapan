import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import StatusGrid from "@/components/admin/StatusGrid";
import OccupancyChart from "@/components/admin/OccupancyChart";
import RevenueChart from "@/components/admin/RevenueChart";


export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("nomor_kamar", { ascending: true });

  const totalKamar = rooms?.length || 0;
  const kamarTerisi =
    rooms?.filter((r) => r.status === "booked").length || 0;

  const tingkatHunian =
    totalKamar > 0
      ? ((kamarTerisi / totalKamar) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Selamat datang di sistem manajemen Wisma Amri
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm">
              Total Kamar
            </p>
            <h2 className="text-3xl font-bold">
              {totalKamar}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm">
              Kamar Terisi
            </p>
            <h2 className="text-3xl font-bold text-red-500">
              {kamarTerisi}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm">
              Tingkat Hunian
            </p>
            <h2 className="text-3xl font-bold text-blue-600">
              {tingkatHunian}%
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* STATUS GRID */}
      <div>
  <h2 className="text-xl font-semibold mb-4">
    Status Kamar
  </h2>

  <StatusGrid initialRooms={rooms} />
</div>
{/* CHART SECTION */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <OccupancyChart rooms={rooms} />
  <RevenueChart rooms={rooms} />
</div>

    </div>
  );
}