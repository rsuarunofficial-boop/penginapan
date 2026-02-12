"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase/client";

// ✅ Interface sudah benar, memastikan kompatibilitas dengan layout.tsx
interface SidebarProps {
  closeSidebar?: () => void;
}

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const supabase = createClientSupabase();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State untuk loading logout

  // Fungsi internal untuk menutup sidebar
  const handleClose = () => {
    setIsOpen(false);
    if (closeSidebar) closeSidebar();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // Gunakan router.replace agar user tidak bisa kembali ke halaman admin via tombol 'back'
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Gagal keluar dari akun.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Manajemen Kamar", href: "/admin/kamar" },
  ];

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30 w-full border-b">
        <h1 className="font-bold text-lg text-blue-600">Admin Panel</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
          aria-label="Toggle Menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ===== Overlay (Mobile) ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* ===== Sidebar Container ===== */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          w-64 h-screen bg-white border-r
          flex flex-col justify-between p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ===== Top Section ===== */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">
              Wisma Amri
            </h1>
            <button onClick={handleClose} className="md:hidden text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={`
                    flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ===== Bottom Section ===== */}
        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
          >
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}