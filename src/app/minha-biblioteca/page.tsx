'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Livro {
  id: number
  nome: string
  autor: string
  descricao: string
  categoria: string
}

export default function MinhaBiblioteca() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtro, setFiltro] = useState('')
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null)

  const fetchLivros = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/livros?page=${pagina}&size=6&sort=nome,asc&nome=${filtro}`
      )
      const data = await response.json()
      setLivros(data.content)
      setTotalPaginas(data.totalPages)
    } catch (error) {
      console.error('Erro ao buscar livros:', error)
    }
  }, [pagina, filtro])

  const excluirLivro = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/livros/${id}`, {
        method: 'DELETE',
      })
      fetchLivros()
    } catch (error) {
      console.error('Erro ao excluir livro:', error)
    }
  }

  useEffect(() => {
    fetchLivros()
  }, [fetchLivros])

  return (
    <div className="p-6 bg-gradient-to-br min-h-214 from-blue-50 to-blue-100">
      <h1 className="text-2xl font-bold mb-4 text-center">Minha Biblioteca</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar por título, autor ou categoria"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border p-2 rounded w-72"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {livros.map((livro) => (
          <div key={livro.id} className="bg-white rounded-xl shadow-md p-4 relative">
            <h2 className="text-lg font-semibold">{livro.nome}</h2>
            <p className="text-sm text-gray-600">Autor: {livro.autor}</p>
            <p className="text-sm text-gray-600">Categoria: {livro.categoria}</p>
            <p className="text-sm text-gray-700 mt-2 line-clamp-3">{livro.descricao}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setLivroSelecionado(livro)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Ver detalhes
              </button>
              <button
                onClick={() => excluirLivro(livro.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPagina((prev) => Math.max(prev - 1, 0))}
          disabled={pagina === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">Página {pagina + 1} de {totalPaginas}</span>
        <button
          onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas - 1))}
          disabled={pagina >= totalPaginas - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      <AnimatePresence>
        {livroSelecionado && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-2">{livroSelecionado.nome}</h2>
              <p className="text-sm text-gray-700 mb-1"><strong>Autor:</strong> {livroSelecionado.autor}</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Categoria:</strong> {livroSelecionado.categoria}</p>
              <p className="text-sm text-gray-800 mt-4">{livroSelecionado.descricao}</p>
              <button
                onClick={() => setLivroSelecionado(null)}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
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
