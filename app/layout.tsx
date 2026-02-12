"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* PENTING: Kita mengirim fungsi closeSidebar ke komponen Sidebar.
        Interface di Sidebar.tsx yang kita buat sebelumnya akan 
        menerima props ini tanpa menyebabkan error build di Vercel.
      */}
      <Sidebar closeSidebar={() => setOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-8">
          <div className="max-w-7-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}