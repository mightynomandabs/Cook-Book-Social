/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cookbook': {
          orange: '#FF8800',
          yellow: '#FFD943',
          green: '#7CC144',
          black: '#090909',
          white: '#FFFFFF'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}
