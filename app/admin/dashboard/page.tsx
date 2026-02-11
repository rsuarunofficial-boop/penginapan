'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [rooms, setRooms] = useState<any[]>([])

  // Ambil data kamar
  const fetchRooms = async () => {
    const { data } = await supabase.from('rooms').select('*')
    setRooms(data || [])
  }

  // Ubah status kamar
  const toggleStatus = async (id: string, current: string) => {
    await supabase
      .from('rooms')
      .update({
        status: current === 'available' ? 'booked' : 'available',
      })
      .eq('id', id)

    fetchRooms()
  }

  // Cek apakah admin sudah login
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/admin')
      } else {
        fetchRooms()
      }
    }

    checkUser()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {rooms.map((room) => (
        <div
          key={room.id}
          className="flex justify-between items-center border p-4 mb-3 rounded"
        >
          <div>
            <p className="font-semibold">
              Kamar {room.nomor_kamar} — {room.tipe}
            </p>
            <p>Status: {room.status}</p>
          </div>

          <button
            onClick={() => toggleStatus(room.id, room.status)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ubah Status
          </button>
        </div>
      ))}
    </div>
  )
}
