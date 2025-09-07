/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25D366',
          darkgreen: '#128C7E',
          light: '#DCF8C6',
          bg: '#E5DDD5',
          chat: '#ECE5DD'
        }
      }
    },
  },
  plugins: [],
}