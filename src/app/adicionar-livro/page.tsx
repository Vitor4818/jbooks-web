'use client'
import React, { useState } from 'react';
import { CardLivro } from '../components/CardLivros/CardLivro';

interface Livro {
  titulo: string;
  capa: string;
  autor: string;
  desc: string;
  categoria: string
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
        const livrosFiltrados = data.items
          .filter((item: any) => {
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
          .map((item: any) => {
            const info = item.volumeInfo;
            return {
              titulo: info.title,
              capa: info.imageLinks.thumbnail,
              autor: info.authors.join(', '),
              desc: info.description,
              categoria: info.categories?.[0]      
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
    <div className="flex flex-col justify-center mt-10 p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Buscar Livros</h1>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
        <input
          name="nome"
          value={nome}
          onChange={handleChange}
          placeholder="Nome do livro"
          className="border p-2 rounded w-56"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-56 cursor-pointer">
          Buscar
        </button>
      </form>

      {livros.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Resultados:</h2>
          <ul className="flex flex-col gap-5 list-none">
            {livros.map((livro, index) => (
              <li key={index}>
                <CardLivro
                  name={livro.titulo}
                  capa={livro.capa}
                  autor={livro.autor}
                  category={livro.categoria}
                  desc={livro.desc}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
