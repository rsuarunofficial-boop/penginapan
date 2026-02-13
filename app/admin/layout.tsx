"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar hanya sebagai menu tarik */}
      <Sidebar isOpen={open} setIsOpen={setOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header Mobile - Diletakkan di Layout Utama */}
        <header className="md:hidden flex items-center px-4 h-16 bg-white border-b shadow-sm z-30 shrink-0">
          <button 
            onClick={() => setOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-3 font-bold text-blue-600 text-lg">Wisma Amri</h1>
        </header>

        {/* Konten Dashboard - Sekarang akan muncul di bawah header karena flex-col */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}