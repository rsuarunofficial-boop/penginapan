"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble } from "lucide-react";

export default function Sidebar({
  closeSidebar,
}: {
  closeSidebar?: () => void;
}) {
  const pathname = usePathname();

  const menuItem = (href: string, icon: any, label: string) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        onClick={closeSidebar}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition
          ${isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-100 text-gray-700"}
        `}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <aside className="h-full p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">
          Wisma Amri
        </h1>

        <nav className="flex flex-col gap-3">
          {menuItem(
            "/admin/dashboard",
            <LayoutDashboard size={18} />,
            "Dashboard"
          )}

          {menuItem(
            "/admin/kamar",
            <BedDouble size={18} />,
            "Kamar"
          )}
        </nav>
      </div>

      <div className="text-sm text-gray-500">
        © 2026 Wisma Amri
      </div>
    </aside>
  );
}
