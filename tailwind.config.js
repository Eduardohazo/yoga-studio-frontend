/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#5B7C4E', light: '#7FA06E', dark: '#3D5735' },
        secondary:{ DEFAULT: '#C8A96A', light: '#DEC48E', dark: '#9E7D44' },
        accent:   { DEFAULT: '#E8DDD0' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
