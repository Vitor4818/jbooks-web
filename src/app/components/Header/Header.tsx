'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'

export const Header = () => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const atualizarToken = () => {
      const tokenArmazenado = localStorage.getItem('token')
      setToken(tokenArmazenado)
    }

    atualizarToken() // Pega na montagem inicial

    // Ouvinte para atualizar após login
    window.addEventListener('login-event', atualizarToken)

    return () => {
      window.removeEventListener('login-event', atualizarToken)
    }
  }, [])

  const menuItemsDeslogado = [
    { label: "Menu", href: "/" }  
  ]

  const menuItemsLogado = [
    { label: "Adicionar Livro", href: "/adicionar-livro" },
    { label: "Minha biblioteca", href: "/minha-biblioteca" },
    { label: "Perfil", href: "/perfil" },
    { label: "Sair", href: "/", onClick: () => {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('login-event'))
      window.location.reload()
    }}
  ]

  const menuItems = token ? menuItemsLogado : menuItemsDeslogado

  return (
<header className="h-24 flex items-center justify-between px-6 py-4 shadow-md bg-[#5b8db8] text-white">
  <Image src={logo} alt="logo" className="h-20 w-20" />
  <nav>
    <ul className="flex flex-row gap-6">
      {menuItems.map((item, index) => (
        <li key={index}>
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-white hover:text-[#dbeafe] transition duration-200 font-medium text-lg"
            >
              {item.label}
            </button>
          ) : (
            <Link
              href={item.href}
              className="text-white hover:text-[#dbeafe] transition duration-200 font-medium text-lg"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </nav>
</header>
  )
}
