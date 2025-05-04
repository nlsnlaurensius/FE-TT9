// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Definisikan palet warna kustom untuk TickIt (menggantikan merah dengan hijau)
        tickitGreen: {
          50: '#e0f2e9',
          100: '#cce9dd',
          200: '#a3d8c3',
          300: '#7ac7a9',
          400: '#52b68f',
          500: '#29a575', // Warna hijau utama
          600: '#20855e',
          700: '#186647',
          800: '#104730',
          900: '#08291a',
          950: '#04140d',
        },
        // Anda bisa juga menambahkan warna lain jika diperlukan
        // Misalnya, abu-abu untuk teks atau latar belakang
        // tickitGray: { ... }
      },
      fontFamily: {
        // Jika Anda ingin menggunakan font kustom, tambahkan di sini
        // sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}