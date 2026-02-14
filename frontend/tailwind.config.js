/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#23272f',
        secondary: '#2d333b',
        accent: '#4b5563',
        highlight: '#6366f1',
        card: '#1a1d23',
      },
    },
  },
  plugins: [],
}


