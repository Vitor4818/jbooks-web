'use client';
import Image from 'next/image';
import { useState } from 'react';

interface propsCardBook {
  name: string;
  capa: string;
  autor: string;
  category: string;
  desc: string;
  handleAdd: (livro: { titulo: string; autor: string; desc: string; category: string }) => void;
}

export const CardLivro = ({ name, capa, autor, desc, category }: propsCardBook) => {
  const livro = {
    titulo: name,
    autor: autor,
    categoria: category,
    desc: desc,
  };

  const [showToast, setShowToast] = useState(false);
  const [mountToast, setMountToast] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddLivro = async () => {
    try {
      const response = await fetch('http://localhost:8080/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: livro.titulo,
          autor: livro.autor,
          descricao: livro.desc,
          categoria: livro.categoria,
        }),
      });

      if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);

      // Toast: montar + animar entrada
      setMountToast(true);
      setTimeout(() => setShowToast(true), 10);

      // Toast: animar saída + desmontar
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setMountToast(false), 400);
      }, 2500);
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
    }
  };

  const handleVerMais = () => {
    setIsModalVisible(true);
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsModalVisible(false), 300);
  };

  return (
    <>
      {/* Card principal */}
      <div className="flex flex-row bg-blue-100 p-4 rounded shadow-md w-3xl h-auto gap-10">
        <Image
          src={capa}
          alt="Capa do livro"
          width={128}
          height={192}
          className="mb-2 object-cover rounded"
        />

        <section className="flex flex-col gap-16">
          <div>
            <h1 className="text-lg font-semibold truncate">{name}</h1>
            <h3 className="text-sm text-gray-700 truncate">{autor}</h3>
            <h4>Gênero: {category}</h4>
            <p className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis line-clamp-3">
              {desc}
            </p>
          </div>
          <div className="flex gap-10">
            <button
              onClick={handleVerMais}
              className="bg-blue-900 rounded-md h-8 text-blue-50 font-bold w-64 hover:bg-blue-700"
            >
              Ver mais
            </button>
            <button
              onClick={handleAddLivro}
              className="cursor-pointer bg-blue-950 rounded-md h-8 text-blue-50 font-bold w-64 hover:bg-blue-800"
            >
              Adicionar
            </button>
          </div>
        </section>
      </div>

      {/* Modal Ver Mais */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-blue-50 to-blue-100 bg-opacity-50">
          <div
            className={`bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full transform transition-all duration-300 ${
              isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-xl text-gray-700 hover:text-gray-900"
            >
              &times;
            </button>
            <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-4">{livro.titulo}</h1>
            <div className="space-y-4">
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-blue-700">Autor:</span> {livro.autor}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-blue-700">Categoria:</span> {livro.categoria}
              </p>
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Descrição</h2>
                <p className="text-gray-700 text-justify leading-relaxed">{livro.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast de Sucesso */}
      {mountToast && (
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-500 ${
            showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-semibold">Livro adicionado com sucesso!</p>
        </div>
      )}
    </>
  );
};
