/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EFF4FB',
          100: '#D6E4F5',
          200: '#ADC8EB',
          300: '#84ADDF',
          400: '#5B91D3',
          500: '#3274C4',
          600: '#1B5CAA',
          700: '#1B4F8A',
          800: '#163E6E',
          900: '#102E52',
          950: '#0D1F3C',
        },
        pfp: {
          main: '#1B4F8A',
          ink: '#1A1A1A',
          paper: '#F2F0EC',
          'secondary-light': '#F5A623',
          'secondary-dark': '#D4881A',
          dark: '#0D1F3C',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 25s linear infinite',
        'spin-reverse': 'spinReverse 35s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        spinReverse: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}
