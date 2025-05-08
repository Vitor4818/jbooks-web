import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import logo from '../../assets/logo.png'

export const Header = () => {
  const menuItems = [
    { label: "Menu", href: "/" },
    { label: "Adicionar Livro", href: "/adicionar-livro" },
    { label: "Minha biblioteca", href: "/minha-biblioteca" },
    { label: "Perfil", href: "/perfil" }
  ];

  return (
    <>
<header className="h-25 flex items-center justify-between px-4 py-2 shadow-md bg-blue-300 mb-0">
    <Image src={logo} alt="logo" className='h-40 w-40'/>
  <nav>
    <ul className="flex flex-row gap-6">
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link href={item.href} className="text-amber-950 hover:underline font-sans text-lg">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
</header>
    </>
  );
};
