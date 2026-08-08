/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFCF9',
          100: '#FBF6EE',
          200: '#F5EBDA',
          300: '#EEDEC3',
        },
        charcoal: {
          DEFAULT: '#211F1D',
          light: '#3A3632',
          soft: '#5C564F',
        },
        gold: {
          50: '#FAF5EC',
          100: '#F0E2C6',
          200: '#E2C89A',
          300: '#D3AD71',
          400: '#C29E5F',
          500: '#B08D57',
          600: '#96754A',
          700: '#785C3A',
          800: '#5B452C',
          900: '#3D2F1F',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(33, 31, 29, 0.08)',
        card: '0 2px 12px -2px rgba(33, 31, 29, 0.10)',
        lift: '0 12px 32px -8px rgba(33, 31, 29, 0.18)',
        gold: '0 8px 24px -6px rgba(176, 141, 87, 0.35)',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
        'glow-pulse': 'glowPulse 6s ease-in-out infinite',
        'glow-drift': 'glowDrift 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.15)' },
        },
        glowDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-4%, 3%) scale(1.08)' },
        },
      },
      transitionTimingFunction: {
        elegant: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
