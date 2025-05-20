'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardLivro } from '../components/CardLivros/CardLivro';

// Interface para os livros
interface Livro {
  titulo: string;
  capa: string;
  autor: string;
  desc: string;
  categoria: string;
}

// Interface da estrutura da API
interface GoogleBook {
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
    };
    categories?: string[];
    language?: string;
  };
}

export default function AdicionarLivro() {
  const [nome, setNome] = useState('');
  const [livros, setLivros] = useState<Livro[]>([]);
  const router = useRouter();

  // Verifica se o token existe
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // redireciona para login
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${nome}`);
      const data = await response.json();

      if (response.ok && data.items && data.items.length > 0) {
        const livrosFiltrados = data.items
          .filter((item: GoogleBook) => {
            const info = item.volumeInfo;
            const idioma = info.language?.toLowerCase();

            return (
              (idioma === 'pt' || idioma === 'pt-br') &&
              info.title &&
              Array.isArray(info.authors) &&
              info.authors.length > 0 &&
              info.description &&
              info.imageLinks?.thumbnail
            );
          })
          .map((item: GoogleBook) => {
            const info = item.volumeInfo;
            return {
              titulo: info.title,
              capa: info.imageLinks!.thumbnail,
              autor: info.authors.join(', '),
              desc: info.description,
              categoria: info.categories?.[0] || 'Sem categoria',
            };
          });

        if (livrosFiltrados.length > 0) {
          setLivros(livrosFiltrados);
        } else {
          setLivros([]);
          alert('Nenhum livro em português com todas as informações foi encontrado.');
        }
      } else {
        setLivros([]);
        alert('Nenhum livro encontrado.');
      }
    } catch (error) {
      alert('Erro na requisição: ' + error);
    }
  };

  return (
<div className="flex flex-col items-center min-h-215 bg-gradient-to-br from-[#2c3e50] to-[#34495e] px-4 py-10">
  <h1 className="text-3xl font-bold mt-10 mb-6 text-white">Buscar Livros</h1>

  <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full max-w-md">
    <input
      name="nome"
      value={nome}
      onChange={handleChange}
      placeholder="Nome do livro"
      className="border border-gray-300 p-3 rounded-md text-[#1f2937] bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
    >
      Buscar
    </button>
  </form>

  {livros.length > 0 && (
    <div className="mt-10 w-full max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 text-white">Resultados:</h2>
      <ul className="flex flex-col gap-5 list-none">
        {livros.map((livro, index) => (
          <li key={index}>
            <CardLivro
              name={livro.titulo}
              capa={livro.capa}
              autor={livro.autor}
              category={livro.categoria}
              desc={livro.desc}
              handleAdd={() => {
                console.log('Livro a ser adicionado:', livro);
                // lógica de adicionar livro
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
  );
}
