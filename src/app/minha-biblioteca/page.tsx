'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

interface Livro {
  id: number
  nome: string
  autor: string
  descricao: string
  categoria: string
  statusId: number
}

export default function MinhaBiblioteca() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const [livros, setLivros] = useState<Livro[]>([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtro, setFiltro] = useState('')
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null)
  const [statusSelecionado, setStatusSelecionado] = useState<number | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token")
      if (!storedToken) {
        router.push('/login')
      } else {
        setToken(storedToken)

        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]))
          setUserId(payload.sub)
        } catch (error) {
          console.error('Erro ao decodificar token:', error)
        }
      }
    }
  }, [router])

  const fetchLivros = useCallback(async () => {
    if (!token || !userId) return

    try {
      const response = await fetch(
        `${baseUrl}/livros/usuario/${userId}?page=${pagina}&size=6&sort=nome,asc&nome=${filtro}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.error(`Erro na resposta: ${response.status}`)
        return
      }

      const text = await response.text()

      if (!text) {
        console.warn('Resposta vazia da API.')
        return
      }

      const data = JSON.parse(text)
      setLivros(data.content || [])
      setTotalPaginas(data.totalPages || 0)

    } catch (error) {
      console.error('Erro ao buscar livros:', error)
    }
  }, [pagina, filtro, baseUrl, token, userId])

  const excluirLivro = async (id: number) => {
    if (!token) return
    try {
      await fetch(`${baseUrl}/livros/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      fetchLivros()
    } catch (error) {
      console.error('Erro ao excluir livro:', error)
    }
  }

  useEffect(() => {
    if (token && userId) {
      fetchLivros()
    }
  }, [fetchLivros, token, userId])

  const livrosFiltrados = statusSelecionado !== null
    ? livros.filter(livro => livro.statusId === statusSelecionado)
    : livros

  const handleAtualizarLivro = async (statusIdParam: number) => {
    if (!livroSelecionado || !token || !userId) return

    try {
      const response = await fetch(`${baseUrl}/livros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: livroSelecionado.id,
          usuarioId: userId,
          nome: livroSelecionado.nome,
          statusId: statusIdParam,
        }),
      })

      if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`)

      setLivroSelecionado(null)
      fetchLivros()
    } catch (error) {
      console.error('Erro ao atualizar status do livro:', error)
    }
  }

  return (
    <div className="p-6 min-h-215 bg-gradient-to-br from-[#2c3e50] to-[#34495e]">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Minha Biblioteca</h1>

      {/* Busca */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar livros..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
      </div>

      {/* Filtros */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {[
          { id: 2, nome: 'Lendo' },
          { id: 1, nome: 'A ler' },
          { id: 3, nome: 'Lidos' },
        ].map((status) => (
          <button
            key={status.id}
            onClick={() => setStatusSelecionado(status.id)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors border ${
              statusSelecionado === status.id
                ? 'bg-[#3b5998] text-white border-[#3b5998]'
                : 'bg-white text-[#3b5998] border-[#b0c4de] hover:bg-[#e9f0fa]'
            }`}
          >
            {status.nome}
          </button>
        ))}
        <button
          onClick={() => setStatusSelecionado(null)}
          className={`px-5 py-2 rounded-lg font-medium transition-colors border ${
            statusSelecionado === null
              ? 'bg-[#3b5998] text-white border-[#3b5998]'
              : 'bg-white text-[#3b5998] border-[#b0c4de] hover:bg-[#e9f0fa]'
          }`}
        >
          Todos
        </button>
      </div>

        

      {/* Lista de livros */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {livrosFiltrados.map((livro) => (
          <div key={livro.id} className="bg-sky-950 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-blue-300">{livro.nome}</h2>
            <p className="text-sm text-blue-100">Autor: {livro.autor}</p>
            <p className="text-sm text-blue-200">Categoria: {livro.categoria}</p>
            <p className="text-sm text-blue-50 mt-2 line-clamp-3">{livro.descricao}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setLivroSelecionado(livro)}
                className="bg-[#3b5998] text-white px-4 py-1 rounded hover:bg-[#2c3e50] text-sm"
              >
                Ver detalhes
              </button>
              <button
                onClick={() => excluirLivro(livro.id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center items-center gap-4 mt-8 text-white">
        <button
          onClick={() => setPagina((prev) => Math.max(prev - 1, 0))}
          disabled={pagina === 0}
          className="px-4 py-2 rounded bg-[#3b5998] hover:bg-[#2c3e50] disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {pagina + 1} de {totalPaginas}</span>
        <button
          onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas - 1))}
          disabled={pagina >= totalPaginas - 1}
          className="px-4 py-2 rounded bg-[#3b5998] hover:bg-[#2c3e50] disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {/* Modal */}
<AnimatePresence>
  {livroSelecionado && (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-[#2c3e50] to-[#34495e] bg-opacity-70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-sky-950 p-6 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-4xl font-extrabold text-center text-blue-200 mb-6">
          {livroSelecionado.nome}
        </h2>
        <p className="text-lg text-blue-100 mb-1">
          <strong className="text-blue-300">Autor:</strong> {livroSelecionado.autor}
        </p>
        <p className="text-lg text-blue-100 mb-1">
          <strong className="text-blue-300">Categoria:</strong> {livroSelecionado.categoria}
        </p>
        <p className="text-blue-100 mt-4 text-justify leading-relaxed">
          {livroSelecionado.descricao}
        </p>

        <div className="flex gap-4 mt-6">
          {[1, 2, 3].map(id => (
            <button
              key={id}
              onClick={() => handleAtualizarLivro(id)}
              className={`flex-1 py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
                id === 1
                  ? 'bg-[#4cb8ac] hover:bg-[#3fa297]'
                  : id === 2
                  ? 'bg-[#b0c4de] text-[#2c3e50] hover:bg-[#a0b6d3]'
                  : 'bg-[#5d6d7e] hover:bg-[#4b5a6b]'
              }`}
            >
              {id === 1 ? 'A ler' : id === 2 ? 'Lendo' : 'Lidos'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setLivroSelecionado(null)}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-md transition-colors duration-200"
        >
          Fechar
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}
