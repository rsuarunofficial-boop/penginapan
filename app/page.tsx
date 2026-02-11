import { supabase } from "@/lib/supabase";
import RoomCard from "@/components/RoomCard";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const { data: rooms } = await supabase.from("rooms").select("*");

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945')",
        }}
      >
        <div className="bg-black/50 p-10 rounded text-center">
          <h1 className="text-4xl font-bold mb-4">
            Selamat Datang di Penginapan Kami
          </h1>
          <p className="text-lg">
            Nyaman, Bersih, dan Harga Terjangkau
          </p>
        </div>
      </section>

      {/* DAFTAR KAMAR */}
      <section id="kamar" className="p-10">
        <h2 className="text-3xl font-bold text-center mb-10">
          Daftar Kamar
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms?.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* KONTAK */}
      <section
        id="kontak"
        className="bg-white text-center py-16 border-t mt-10"
      >
        <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
        <p>WhatsApp: 08xxxxxxxxxx</p>
        <p>Alamat: Jl. Contoh Alamat No.123</p>
      </section>
    </div>
  );
}
