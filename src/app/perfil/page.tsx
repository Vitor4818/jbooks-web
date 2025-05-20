'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Perfil() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | ''>('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setMensagem('Você precisa estar logado para acessar o perfil.')
      setTipoMensagem('erro')
      router.push('/login')
      return
    }

    const buscarUsuario = async () => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userId = payload.sub

        const resposta = await fetch(`${baseUrl}/usuario/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (resposta.ok) {
          const dados = await resposta.json()
          setUsuario(dados)
        } else {
          setMensagem('Erro ao carregar perfil.')
          setTipoMensagem('erro')
        }
      } catch (error) {
        setMensagem('Erro na conexão com o servidor.')
        setTipoMensagem('erro')
      } finally {
        setCarregando(false)
      }
    }

    buscarUsuario()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setMensagem('Logout realizado com sucesso.')
    setTipoMensagem('sucesso')
    window.dispatchEvent(new Event('login-event'))
    router.push('/login')
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#3b5998]">
        <p className="text-blue-200 text-xl font-semibold">Verificando autenticação...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-215 bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#3b5998]">
      <div className="bg-sky-950 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-200">
          Perfil do Usuário
        </h1>

        {usuario ? (
          <>
            <p className="mb-4 text-blue-100">
              <span className="font-semibold text-blue-300">Nome:</span> {usuario.nome}
            </p>
            <p className="mb-6 text-blue-100">
              <span className="font-semibold text-blue-300">Email:</span> {usuario.email}
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              Sair
            </button>
          </>
        ) : (
          <p className="text-center text-blue-100">Carregando perfil...</p>
        )}

        {mensagem && (
          <p
            className={`mt-6 text-center text-sm font-medium ${
              tipoMensagem === 'erro'
                ? 'text-red-500'
                : tipoMensagem === 'sucesso'
                ? 'text-green-400'
                : ''
            }`}
          >
            {mensagem}
          </p>
        )}
      </div>
    </div>
  )
}
