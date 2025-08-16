/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cookbook-orange': '#FF8800',
        'cookbook-yellow': '#FFD943',
        'cookbook-green': '#7CC144',
        'cookbook-black': '#090909',
        'cookbook-white': '#FFFFFF'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}
