/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1320px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Lexend"', '"Inter"', 'sans-serif'],
      },

      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#fff7ed',
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
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },

      borderRadius: {
        xs: '0.25rem',
        sm: 'calc(var(--radius) - 6px)',
        md: 'calc(var(--radius) - 3px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 6px)',
        '2xl': 'calc(var(--radius) + 12px)',
      },

      boxShadow: {
        xs: '0 1px 2px 0 rgba(17,24,39,0.04)',
        sm: '0 1px 3px 0 rgba(17,24,39,0.06), 0 1px 2px -1px rgba(17,24,39,0.06)',
        card: '0 1px 2px 0 rgba(17,24,39,0.04), 0 1px 8px 0 rgba(17,24,39,0.04)',
        'card-hover': '0 12px 24px -8px rgba(17,24,39,0.12), 0 4px 8px -4px rgba(17,24,39,0.06)',
        popover: '0 8px 30px -6px rgba(17,24,39,0.16)',
        'brand-ring': '0 0 0 4px rgba(249,115,22,0.12)',
      },

      fontSize: {
        display: ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        h1: ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        h2: ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        h3: ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
      },

      animation: {
        marquee: 'marquee 34s linear infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scale-in 0.15s cubic-bezier(0.16,1,0.3,1)',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
  plugins: [],
}
