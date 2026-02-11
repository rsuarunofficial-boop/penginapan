import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo / Nama */}
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          Wisma Amri
        </h1>

        {/* Menu */}
        <div className="flex gap-8 text-gray-700 font-medium">
          <Link href="#kamar" className="hover:text-black transition">
            Kamar
          </Link>
          <Link href="#kontak" className="hover:text-black transition">
            Kontak
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
