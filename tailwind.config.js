/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#59ABBD',
          navy: '#1B263B',
        },
      },
    },
  },
  plugins: [],
}