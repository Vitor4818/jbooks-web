'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.push('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-gray-900">
  <div className="text-center text-gray-100 px-4">
    <h1 className="text-5xl font-bold mb-4">JBooks</h1>
    <p className="text-xl mb-8">
      Sua biblioteca digital. Organize e encontre seus livros com facilidade.
    </p>
    <button
      onClick={handleLoginRedirect}
      className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-300"
    >
      Entrar
    </button>
  </div>
</div>
  )
}
