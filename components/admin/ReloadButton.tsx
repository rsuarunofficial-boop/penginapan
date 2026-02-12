"use client";

import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Menyegarkan data Server Component di Next.js
    router.refresh();
    
    // Animasi putar selama 1 detik
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
    >
      <RefreshCcw 
        size={18} 
        className={`text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} 
      />
      <span className="text-sm font-semibold text-gray-700">
        {isRefreshing ? "Memperbarui..." : "Refresh"}
      </span>
    </button>
  );
}