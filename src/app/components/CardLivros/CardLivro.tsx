'use client';
import Image from 'next/image';
import { useState } from 'react';

interface propsCardBook {
  name: string;
  capa: string;
  autor: string;
  category: string;
  desc: string;
}

export const CardLivro = ({ name, capa, autor, desc, category }: propsCardBook) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const livro = {
    titulo: name,
    autor: autor,
    categoria: category,
    desc: desc,
  };

  function getToken() {
    return localStorage.getItem("token");
  }

  const token = getToken();

  function getUserIdFromToken() {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  const userId = getUserIdFromToken();

  const [showToast, setShowToast] = useState(false);
  const [mountToast, setMountToast] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);


  

  const handleAddLivro = async () => {
    if (statusId === null) return;

    try {
      const response = await fetch(`${baseUrl}/livros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: livro.titulo,
          usuarioId: `${userId}`,
          statusId: `${statusId}`,
          autor: livro.autor,
          descricao: livro.desc,
          categoria: livro.categoria,
        }),
      });

      if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);

      setMountToast(true);
      setTimeout(() => setShowToast(true), 10);

      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setMountToast(false), 400);
      }, 2500);

      setShowStatusModal(false);
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

const closeStatusModal = () => {
  setIsStatusModalOpen(false);
  setTimeout(() => setShowStatusModal(false), 300);
};

const openStatusModal = () => {
  setShowStatusModal(true);
  setTimeout(() => setIsStatusModalOpen(true), 10);
};

  return (
    <>
      <div className="flex flex-row bg-sky-950 p-6 rounded-xl shadow-lg w-full max-w-3xl h-auto gap-8">
        <Image
          src={capa}
          alt={`Capa do livro ${name}`}
          width={128}
          height={192}
          className="rounded-lg object-cover shadow-md"
        />

        <section className="flex flex-col justify-between gap-8 flex-1">
          <div>
            <h1 className="text-2xl font-semibold text-blue-300 truncate">{name}</h1>
            <h3 className="text-md text-blue-100 truncate mt-1">{autor}</h3>
            <h4 className='text-blue-200 mt-1'>Gênero: {category}</h4>
            <p className="text-sm text-blue-50 mt-3 overflow-hidden text-ellipsis line-clamp-3">
              {desc}
            </p>
          </div>

          <div className="flex gap-6">
            <button
              onClick={handleVerMais}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium h-10 flex-1 rounded-md transition-colors duration-200"
            >
              Ver mais
            </button>
            <button
              onClick={openStatusModal}
              className="bg-blue-400 hover:bg-blue-500 text-white font-medium h-10 flex-1 rounded-md transition-colors duration-200"
            >
              Adicionar
            </button>
          </div>
        </section>
      </div>

{isModalVisible && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-[#2c3e50] to-[#34495e] bg-opacity-70">
    <div
      className={`bg-sky-950 rounded-3xl shadow-2xl p-10 max-w-2xl w-full transform transition-all duration-300 ${
        isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <button
        onClick={closeModal}
        className="absolute top-5 right-5 text-3xl text-blue-300 hover:text-blue-100 font-bold"
        aria-label="Fechar modal"
      >
        &times;
      </button>
      <h1 className="text-4xl font-extrabold text-center text-blue-200 mb-6">{livro.titulo}</h1>
      <div className="space-y-5">
        <p className="text-lg text-blue-100">
          <span className="font-semibold text-blue-300">Autor:</span> {livro.autor}
        </p>
        <p className="text-lg text-blue-100">
          <span className="font-semibold text-blue-300">Categoria:</span> {livro.categoria}
        </p>
        <div>
          <h2 className="text-2xl font-semibold text-blue-300 mb-3">Descrição</h2>
          <p className="text-blue-100 text-justify leading-relaxed">{livro.desc}</p>
        </div>
      </div>
    </div>
  </div>
)}


{showStatusModal && (
  <div className="fixed inset-0 bg-gradient-to-br from-[#2c3e50] to-[#34495e] bg-opacity-70 z-50 flex items-center justify-center">
    <div
      className={`bg-sky-950 p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 ${
        isStatusModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-200">
        Escolha o status do livro
      </h2>
      <div className="space-y-4">
        <button
          onClick={() => {
            setStatusId(1);
            handleAddLivro();
          }}
          className="w-full bg-[#4cb8ac] text-white py-3 rounded-lg hover:bg-[#3fa297] transition-colors"
        >
          Vai ler
        </button>
        <button
          onClick={() => {
            setStatusId(2);
            handleAddLivro();
          }}
          className="w-full bg-[#b0c4de] text-[#2c3e50] py-3 rounded-lg hover:bg-[#a0b6d3] transition-colors"
        >
          Lendo
        </button>
        <button
          onClick={() => {
            setStatusId(3);
            handleAddLivro();
          }}
          className="w-full bg-[#5d6d7e] text-white py-3 rounded-lg hover:bg-[#4b5a6b] transition-colors"
        >
          Já leu
        </button>
        <button
          onClick={closeStatusModal}
          className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-200 mt-4 transition-colors"
        >
          Cancelar
        </button>
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
