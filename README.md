# 📚 Front-end - Gerenciador de Livros

Este é o front-end da aplicação de gerenciamento de livros, desenvolvido com **Next.js**. A aplicação consome uma **API REST** (desenvolvida em Java/Spring Boot) e também utiliza a **Google Books API** para buscar informações de livros. Usuários podem pesquisar, visualizar e organizar seus livros nas categorias:

- 📖 Lendo  
- 📕 Lidos  
- 📘 A ler  

---

## 🚀 Funcionalidades

- 🔎 Pesquisa de livros pela Google Books API
- 👤 Cadastro e login de usuários
- 📚 Adição e organização dos livros nas categorias
- 🔒 Autenticação com proteção de rotas
- 🌐 Comunicação com a API back-end via HTTP

---

## 🛠️ Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Google Books API](https://developers.google.com/books)
- [JWT](https://jwt.io/) para autenticação
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/Vitor4818/jbooks-web.git
   cd jbooks-web
   ```
2. Instalar as dependencias
  ```
   npm install
  ```
3. Configure as variáveis de ambiente:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=sua-chave-google
```
4. Rode o projeto
```
npm run dev
```
5. Acesse em: http://localhost:3000

# Melhorias Futuras
- Responsividade aprimorada
- Comentários e avaliações de livros

###  Autor
Desenvolvido por Vitor Gomes Martins

