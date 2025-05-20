'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export default function Login() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLogged, setIsLogged] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | ''>('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLogged(!!token)
  }, [])

  const handleLogin = async () => {
    try {
      const resposta = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      })

      if (resposta.ok) {
        const data = await resposta.json()
        localStorage.setItem('token', data.token)

        setMensagem('Login realizado com sucesso!')
        setTipoMensagem('sucesso')
        setIsLogged(true)

        window.dispatchEvent(new Event('login-event'))
        router.push('/adicionar-livro')
      } else {
        setMensagem('Credenciais inválidas')
        setTipoMensagem('erro')
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor')
      setTipoMensagem('erro')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLogged(false)
    setMensagem('Logout realizado com sucesso!')
    setTipoMensagem('sucesso')

    window.dispatchEvent(new Event('login-event'))
    window.location.reload()
  }

  return (
    <div className="flex items-center justify-center min-h-215 bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#3b5998]">
      <div className="bg-sky-950 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-200">
          {isLogged ? 'Você está logado' : 'Login'}
        </h1>

        {!isLogged && (
          <>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 mb-5 rounded-lg border border-blue-400 bg-sky-900 text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-4 mb-6 rounded-lg border border-blue-400 bg-sky-900 text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <p className="text-blue-300 font-semibold mb-6 text-center">
              Não tem conta?{' '}
              <Link
                href="/cadastro"
                className="text-blue-400 hover:text-blue-200 transition duration-200 font-bold"
              >
                Cadastre-se
              </Link>
            </p>

            <button
              onClick={handleLogin}
              className="w-full bg-[#4cb8ac] hover:bg-[#3fa297] text-sky-950 font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              Entrar
            </button>
          </>
        )}

        {isLogged && (
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Sair
          </button>
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
