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
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300
          md:translate-x-0 md:static md:shadow-none
        `}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow p-4 flex items-center">
          <button onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <h1 className="ml-4 font-bold">
            Wisma Amri
          </h1>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
