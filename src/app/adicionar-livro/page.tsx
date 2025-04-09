'use client'
import React, { useState } from 'react';
import { CardLivro } from '../components/CardLivros/CardLivro';

interface Livro {
  titulo: string;
  capa: string;
  autor: string;
  desc: string;
}
export default function AdicionarLivro() {
  const [nome, setNome] = useState('');
  const [livros, setLivros] = useState<Livro[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${nome}`);
      const data = await response.json();
  
      if (response.ok && data.items && data.items.length > 0) {
        const livrosFormatados = data.items.map((item: any) => ({
          titulo: item.volumeInfo.title,
          capa: item.volumeInfo.imageLinks?.thumbnail || '/fallback.jpg',
          autor: item.volumeInfo.authors?.join(', ') || 'Autor desconhecido',
          desc: item.volumeInfo.description || 'Sem descrição disponível',
        }));
        setLivros(livrosFormatados);
      } else {
        setLivros([]);
        alert('Nenhum livro encontrado');
      }
    } catch (error) {
      alert('Erro na requisição: ' + error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Buscar Livros</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nome"
          value={nome}
          onChange={handleChange}
          placeholder="Nome do livro"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Buscar
        </button>
      </form>

      {livros.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Resultados:</h2>
          <ul className="list-disc list-inside">
          {livros.map((livro, index) => (
  <CardLivro
    key={index}
    name={livro.titulo}
    capa={livro.capa}
    autor={livro.autor}
    desc={livro.desc}
  />
))}
          </ul>
        </div>
      )}
    </div>
  );
}
