// tailwind.config.js

module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // se estiver usando a pasta /app
      "./pages/**/*.{js,ts,jsx,tsx}", // para /pages
      "./components/**/*.{js,ts,jsx,tsx}", // para /components
    ],
    theme: {
      extend: {
        colors: {
            'vaitoma': "#f5efe5"
        }
      },
    },
    plugins: [],
  }
  