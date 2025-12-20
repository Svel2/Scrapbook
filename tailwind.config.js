/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#2D3250',
        foreground: '#F8F9FA',
        'page-default': '#F8F9FA',
        'page-birthday': '#A2D2FF',
        'page-postcard': '#FFF8E7',
        'page-night': '#1B263B',
        'accent-pink': '#FFC8DD',
        'accent-red': '#EF233C',
      },
      fontFamily: {
        handwriting: ['Dancing Script', 'cursive'],
        indie: ['Indie Flower', 'cursive'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
