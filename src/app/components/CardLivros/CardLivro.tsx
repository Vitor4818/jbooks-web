import Image from 'next/image';
import React from 'react';

interface propsCardBook {
  name: string;
  capa: string;
  autor: string;
  desc: string;
}

export const CardLivro = ({ name, capa, autor, desc }: propsCardBook) => {
  return (
    <div className="bg-amber-100 p-4 rounded shadow-md max-w-sm">
      <Image
        src={capa}
        alt="Capa do livro"
        width={128}
        height={192}
        className="rounded mb-4"
      />

      <section>
        <h1 className="text-lg font-bold">{name}</h1>
        <h3 className="text-sm text-gray-600">{autor}</h3>
        <p className="text-sm mt-2">{desc}</p>
      </section>
    </div>
  );
};
