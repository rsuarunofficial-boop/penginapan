"use client";

import { useState, useEffect } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface RoomFormProps {
  room?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function RoomForm({
  room,
  onClose,
  onSave,
}: RoomFormProps) {
  // Inisialisasi client supabase
  const supabase = createClientSupabase();

  const [formData, setFormData] = useState({
    nomor_kamar: room?.nomor_kamar || "",
    tipe: room?.tipe || "",
    harga: room?.harga || 0,
    fasilitas: room?.fasilitas || "",
    kapasitas: room?.kapasitas || 1,
    status: room?.status || "available",
    image: room?.image || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     🔥 Utility & Image Processing
  =============================== */

  const getFileNameFromUrl = (url: string) => {
    if (!url) return null;
    return url.split("/").pop() || null;
  };

  const deleteOldImage = async (imageUrl: string) => {
    const fileName = getFileNameFromUrl(imageUrl);
    if (!fileName) return;
    // Menghapus file lama dari storage bucket 'rooms'
    await supabase.storage.from("rooms").remove([fileName]);
  };

  const resizeImage = (file: File, maxWidth = 800) => {
    return new Promise<File>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: any) => { img.src = e.target.result; };
      img.onload = () => {
        if (img.width <= maxWidth) {
          resolve(file);
          return;
        }
        const canvas = document.createElement("canvas");
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          const resizedFile = new File([blob], `${uuidv4()}.jpg`, { type: "image/jpeg" });
          resolve(resizedFile);
        }, "image/jpeg", 0.8);
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (file: File) => {
    const optimizedFile = await resizeImage(file);
    const fileName = `${uuidv4()}.jpg`;

    // Upload file ke storage bucket 'rooms'
    const { error } = await supabase.storage
      .from("rooms")
      .upload(fileName, optimizedFile);

    if (error) {
      console.error("Storage Error:", error);
      throw new Error("Gagal upload gambar: " + error.message);
    }

    const { data } = supabase.storage.from("rooms").getPublicUrl(fileName);
    return data.publicUrl;
  };

  /* ===============================
     🚀 Submit Logic
  =============================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Jika ada file gambar baru yang dipilih
      if (imageFile) {
        if (room?.image) {
          await deleteOldImage(room.image);
        }
        imageUrl = await uploadImage(imageFile);
      }

      const finalData = {
        ...formData,
        image: imageUrl,
      };

      if (room?.id) {
        // PERBAIKAN UPDATE: Hapus .single() untuk menghindari error PGRST116
        const { data, error } = await supabase
          .from("rooms")
          .update(finalData)
          .eq("id", room.id)
          .select();

        if (error) throw error;

        // Cek apakah data berhasil diupdate
        if (data && data.length > 0) {
          onSave(data[0]);
        } else {
          throw new Error("Data tidak ditemukan di database untuk diupdate.");
        }
      } else {
        // INSERT
        const { data, error } = await supabase
          .from("rooms")
          .insert([finalData])
          .select();

        if (error) throw error;
        if (data && data.length > 0) onSave(data[0]);
      }
      
      onClose();
    } catch (err: any) {
      // Log error yang lebih detail agar mudah di-debug
      console.error("Error Lengkap:", JSON.stringify(err, null, 2));
      alert("Terjadi kesalahan: " + (err.message || "Gagal menyimpan data"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            {room?.id ? "Edit Kamar" : "Tambah Kamar"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Nomor Kamar</label>
          <input
            type="text"
            placeholder="Contoh: 101"
            value={formData.nomor_kamar}
            onChange={(e) => setFormData({ ...formData, nomor_kamar: e.target.value })}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <label className="block text-sm font-medium text-gray-700">Tipe Kamar</label>
          <input
            type="text"
            placeholder="Contoh: Deluxe"
            value={formData.tipe}
            onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <label className="block text-sm font-medium text-gray-700">Harga per Malam (Rp)</label>
          <input
            type="number"
            value={formData.harga}
            onChange={(e) => setFormData({ ...formData, harga: Number(e.target.value) })}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <label className="block text-sm font-medium text-gray-700">Kapasitas (Orang)</label>
          <input
            type="number"
            value={formData.kapasitas}
            onChange={(e) => setFormData({ ...formData, kapasitas: Number(e.target.value) })}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <label className="block text-sm font-medium text-gray-700">Fasilitas</label>
          <textarea
            placeholder="AC, TV, WiFi..."
            value={formData.fasilitas}
            onChange={(e) => setFormData({ ...formData, fasilitas: e.target.value })}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20"
          />

          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="available">Tersedia</option>
            <option value="booked">Terisi</option>
          </select>

          <label className="block text-sm font-medium text-gray-700">Foto Kamar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded-lg file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {/* Image Preview */}
          {(imageFile || formData.image) && (
            <div className="relative w-full h-40 mt-2">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition shadow-md"
          >
            {loading ? "Proses..." : "Simpan Data"}
          </button>
        </div>
      </form>
    </div>
  );
}