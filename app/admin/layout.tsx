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
      {/* Sidebar tetap sebagai menu tarik yang dikontrol state 'open' */}
      <Sidebar isOpen={open} setIsOpen={setOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Mobile: Tetap sticky di atas pada tampilan HP */}
        <header className="md:hidden flex items-center px-4 h-16 bg-white border-b shadow-sm z-30 shrink-0">
          <button 
            onClick={() => setOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-3 font-bold text-blue-600 text-lg tracking-tight">
            Wisma Amri
          </h1>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-gray-50/50">
          {/* PERBAIKAN UTAMA: 
            Mengubah 'max-w-7xl' menjadi 'max-w-full' agar dashboard 
            mengisi seluruh ruang layar yang tersedia.
          */}
          <div className="max-w-full mx-auto pb-24 md:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}