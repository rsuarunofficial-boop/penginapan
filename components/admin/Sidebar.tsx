"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase/client";
import Link from "next/link";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const supabase = createClientSupabase();
  const pathname = usePathname();
  const router = useRouter();

  const handleClose = () => setIsOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Manajemen Kamar", href: "/admin/kamar" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-[110]
          w-64 h-screen bg-white border-r
          flex flex-col justify-between p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-blue-600">Wisma Amri</h1>
            <button onClick={handleClose} className="md:hidden p-1 text-gray-500">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className={`
                  flex items-center px-4 py-3 rounded-xl font-medium transition-all
                  ${pathname === item.href ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}