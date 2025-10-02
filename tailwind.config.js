/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a365d',
        'gray-600': '#666666',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'dancing-script': ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
};