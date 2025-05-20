'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Cadastro() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | ''>('')
  const [nome, setNome] = useState('')
  const router = useRouter()

  const handleCadastro = async () => {
    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.')
      setTipoMensagem('erro')
      return
    }

    try {
      const resposta = await fetch(`${baseUrl}/usuario/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password: senha }),
      })

      if (resposta.ok) {
        setMensagem('Cadastro realizado com sucesso!')
        setTipoMensagem('sucesso')
        setEmail('')
        setSenha('')
        setConfirmarSenha('')
        const data = await resposta.json()
        const token = data.token
        localStorage.setItem('token', token)
        window.dispatchEvent(new Event('login-event'))
        router.push('/adicionar-livro')
      } else {
        setMensagem('Erro ao realizar cadastro. Tente novamente.')
        setTipoMensagem('erro')
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor.')
      setTipoMensagem('erro')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-215 bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#3b5998]">
      <div className="bg-sky-950 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-200">Cadastro</h1>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-4 mb-5 rounded-lg border border-blue-400 bg-sky-900 text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <input
          type="email"
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
          className="w-full p-4 mb-5 rounded-lg border border-blue-400 bg-sky-900 text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="w-full p-4 mb-6 rounded-lg border border-blue-400 bg-sky-900 text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <p className="text-blue-300 font-semibold mb-6 text-center">
          Já tem conta?{' '}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-200 transition duration-200 font-bold"
          >
            Faça login
          </Link>
        </p>

        <button
          onClick={handleCadastro}
          className="w-full bg-[#4cb8ac] hover:bg-[#3fa297] text-sky-950 font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Cadastrar
        </button>

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
