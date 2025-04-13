/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        'silver-glow': '0 0 15px 5px rgba(192, 192, 192, 0.7)',
      },
      colors: {
        'silver-500': '#C0C0C0',
        'custom-dark': '#000000', // First custom color
        'custom-light': '#FFFFFF', // Second custom color
        'customNav': 'rgb(8,2,33)', // New custom RGBA color
      },
    },
  },
  plugins: [],
}

