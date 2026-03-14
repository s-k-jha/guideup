/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      colors: {
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },

      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.07)',
        'card-hover': '0 8px 32px 0 rgba(249,115,22,0.15)',
      },

      animation: {
        marquee: 'marquee 30s linear infinite',
        ctaGlow: 'ctaGlow 2.5s ease-in-out infinite',
      },

      keyframes: {

        marquee: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },

        ctaGlow: {
          '0%,100%': {
            boxShadow: '0 0 0 rgba(249,115,22,0)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(249,115,22,0.7)',
            transform: 'scale(1.05)',
          },
        },

      },

    },
  },
  plugins: [],
}