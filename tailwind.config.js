/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '375px',
        'md': '428px', // Mobile-first: 360-428px
        'lg': '768px', // Tablet: 768-1024px
        'xl': '1024px',
        '2xl': '1280px',
      },
      colors: {
        // Premium dark theme palette
        'dark-primary': '#0a0a0a', // Negro profundo
        'dark-secondary': '#1a1a1a', // Gris oscuro
        'gold-primary': '#FFD700', // Dorado/amarillo para números importantes
        'gold-secondary': '#F5E6C5', // Dorado claro
        'text-primary': '#ffffff', // Blanco
        'text-secondary': '#EAEAEA', // Blanco/gris claro
        'text-muted': '#cccccc', // Grises claros para contraste
        'border-primary': '#2C2C2C',
        'border-secondary': '#404040',
        'bg-card': '#0F0F0F',
        'bg-overlay': '#050505',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'responsive-xs': 'clamp(0.75rem, 2vw, 0.875rem)',
        'responsive-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'responsive-base': 'clamp(1rem, 3vw, 1.125rem)',
        'responsive-lg': 'clamp(1.125rem, 4vw, 1.25rem)',
        'responsive-xl': 'clamp(1.25rem, 5vw, 1.5rem)',
        'responsive-2xl': 'clamp(1.5rem, 6vw, 2rem)',
        'responsive-3xl': 'clamp(2rem, 8vw, 3rem)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-gold-strong': '0 0 30px rgba(212, 175, 55, 0.5)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};