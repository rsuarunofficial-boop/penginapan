"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase/client";

// PERBAIKAN 1: Tambahkan interface agar Sidebar mengenali props dari layout.tsx
interface SidebarProps {
  closeSidebar?: () => void;
}

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const supabase = createClientSupabase();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  // Fungsi internal untuk menutup sidebar baik dari state lokal maupun props parent
  const handleClose = () => {
    setIsOpen(false);
    if (closeSidebar) closeSidebar();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Manajemen Kamar", href: "/admin/kamar" },
  ];

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
        <h1 className="font-bold text-lg">Admin Panel</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ===== Overlay (Mobile) ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in duration-200"
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-blue-600">
              Wisma Amri
            </h1>
            {/* Tombol tutup tambahan untuk mobile di dalam sidebar */}
            <button onClick={handleClose} className="md:hidden text-gray-500">
              ✕
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={`
                    flex items-center px-4 py-3 rounded-xl font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
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
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}