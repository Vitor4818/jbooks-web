'use client'
import React, { useState } from 'react';

export default function AdicionarLivro() {
  const [form, setForm] = useState({
    nome: '',
    autor: '',
    categoria: '',
    descricao: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/livros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      alert('Livro cadastrado com sucesso!');
      setForm({ nome: '', autor: '', categoria: '', descricao: '' });
    } else {
      alert('Erro ao cadastrar livro');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Adicionar Livro</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome do livro"
          className="w-full border p-2 rounded"
        />
        <input
          name="autor"
          value={form.autor}
          onChange={handleChange}
          placeholder="Autor"
          className="w-full border p-2 rounded"
        />
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Selecione uma categoria</option>
          <option value="ROMANCE">Romance</option>
          <option value="TERROR">Terror</option>
          <option value="AVENTURA">Aventura</option>
          <option value="DRAMA">Drama</option>
        </select>
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Adicionar
        </button>
      </form>
    </div>
  );
}
