import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function RoomCard({ room }: any) {
  const isAvailable = room.status === "available";
  const hargaFormat = new Intl.NumberFormat("id-ID").format(room.harga);

  const pesanWA = encodeURIComponent(
    `Halo Wisma Amri 👋

Saya ingin melakukan booking kamar dengan detail berikut:

Nomor Kamar : ${room.nomor_kamar}
Tipe        : ${room.tipe}
Kapasitas   : ${room.kapasitas} orang
Harga       : Rp ${hargaFormat}

Mohon informasi ketersediaan dan cara pembayarannya. Terima kasih.`
  );

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col">
      {/* Gambar */}
      <img
        src={room.image}
        alt={`Kamar ${room.nomor_kamar}`}
        className="h-52 w-full object-cover"
      />

      <CardContent className="p-6 flex flex-col flex-grow gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800">
            Kamar {room.nomor_kamar}
          </h2>

          <Badge variant={isAvailable ? "default" : "destructive"}>
            {isAvailable ? "Tersedia" : "Sudah Dibooking"}
          </Badge>
        </div>

        <p className="text-sm text-gray-600">Tipe: {room.tipe}</p>

        {/* Kapasitas */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Users size={18} />
          <span>{room.kapasitas} orang</span>
        </div>

        {/* Harga */}
        <p className="text-lg font-semibold text-black">
          Rp {hargaFormat}{" "}
          <span className="text-sm font-normal text-gray-500">/ malam</span>
        </p>

        {/* Fasilitas (di atas tombol) */}
        <div className="flex flex-wrap gap-2 pt-2">
          {room.fasilitas?.split(",").map((item: string, index: number) => (
            <span
              key={index}
              className="text-xs bg-gray-100 px-3 py-1 rounded-full"
            >
              {item.trim()}
            </span>
          ))}
        </div>

        {/* Spacer agar tombol selalu di bawah */}
        <div className="flex-grow" />

        {/* Tombol Booking paling bawah */}
        {isAvailable ? (
          <a
            href={`https://wa.me/6282167500469?text=${pesanWA}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Booking via WhatsApp
            </Button>
          </a>
        ) : (
          <Button disabled className="w-full">
            Tidak Tersedia
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
