/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
         fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as the default sans font
      },
    },
  },
  plugins: [],
}

