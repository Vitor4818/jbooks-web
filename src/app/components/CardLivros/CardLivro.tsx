import Image from 'next/image';
import React from 'react';

interface propsCardBook {
  name: string;
  capa: string;
  autor: string;
  category: string;
  desc: string;
  handleAdd: (livro: { titulo: string; autor: string; desc: string; category: string }) => void;  // Recebendo a função
}


export const CardLivro = ({ name, capa, autor, desc, category }: propsCardBook) => {
  const livro = {
    titulo: name,
    autor: autor,
    categoria: category,
    desc: desc
  }
  const handleAdd = async(livro: { titulo: string; autor: string; desc: string; categoria: string }) =>{
    try{
      const livroAdicionado = await fetch('http://localhost:8080/livros',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: livro.titulo,
          autor: livro.autor,
          descricao: livro.desc,
          categoria: livro.categoria
        }),
      })
      const resultado = await livroAdicionado.json();
      console.log('Resposta do servidor: ', resultado)
    } catch (error){
      console.error('erro do servidor: ', error)
    }

  }
  return (
    <div className=" flex flex-row bg-blue-100 p-4 rounded shadow-md w-3xl h-auto gap-10">
      <Image
        src={capa}
        alt="Capa do livro"
        width={128}
        height={192}
        className="mb-2 object-cover rounded"
        />
      

      <section className='flex flex-col gap-16'>
<div>
      <h1 className="text-lg font-semibold truncate">{name}</h1>
    <h3 className="text-sm text-gray-700 truncate">{autor}</h3>
    <h4>Gênero: {category} </h4>
    <p className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis line-clamp-3">
      {desc}
    </p>
    </div>
    <div className='flex gap-10'>
    <button className='bg-blue-900 rounded-md h-8 text-blue-50 font-bold w-64 cursor-pointer hover:bg-blue-700'>
      Ver mais
    </button>
    <button 
    onClick={()=> handleAdd(livro)}
    className=' cursor-pointer bg-blue-950 rounded-md h-8 text-blue-50 font-bold w-64 hover:bg-blue-800'>
      Adicionar
    </button>
    </div>
    
    
      </section>
    </div>
  );
};
