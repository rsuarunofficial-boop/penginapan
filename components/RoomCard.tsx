import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RoomCard({ room }: any) {
  const isAvailable = room.status === "available";

  return (
    <Card className="overflow-hidden shadow-lg">
      <img
        src={room.image}
        alt="kamar"
        className="h-48 w-full object-cover"
      />

      <CardContent className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">
          Kamar {room.nomor_kamar}
        </h2>

        <p className="text-sm text-gray-600">Tipe: {room.tipe}</p>
        <p className="text-sm text-gray-600">
          Harga: Rp {room.harga}
        </p>

        <Badge variant={isAvailable ? "default" : "destructive"}>
          {isAvailable ? "Tersedia" : "Sudah Dibooking"}
        </Badge>

        {isAvailable ? (
          <a
            href={`https://wa.me/6282167500469?text=Saya ingin booking kamar ${room.nomor_kamar}`}
            target="_blank"
          >
            <Button className="w-full mt-3">
              Booking via WhatsApp
            </Button>
          </a>
        ) : (
          <Button disabled className="w-full mt-3">
            Tidak Tersedia
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
