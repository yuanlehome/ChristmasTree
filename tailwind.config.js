/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Brush Script MT"', 'cursive'],
        cinzel: ['"Times New Roman"', 'serif'],
        sans: ['"Helvetica Neue"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      }
    },
  },
  plugins: [],
}
