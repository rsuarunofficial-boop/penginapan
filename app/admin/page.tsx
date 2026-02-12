'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const supabase = createClientSupabase() // ✅ WAJIB ADA

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email dan password wajib diisi')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white border p-8 rounded w-80 shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Login Admin
        </h1>

        <input
          type="email"
          className="border w-full mb-3 p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full mb-4 p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white w-full p-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
  )
}
