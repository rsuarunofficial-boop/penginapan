import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-white shadow">
      <h1 className="text-2xl font-bold">Penginapan Kita</h1>

      <div className="flex gap-6">
        <Link href="#kamar">Kamar</Link>
        <Link href="#kontak">Kontak</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </nav>
  );
}
