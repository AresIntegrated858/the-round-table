/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Round Table palette — premium private-club, not bro-forum.
        charcoal: {
          DEFAULT: '#0E0F12', // base
          50: '#F5F5F6',
          100: '#E3E3E5',
          200: '#C4C4C8',
          300: '#9A9AA0',
          400: '#5C5D63',
          500: '#3A3B40',
          600: '#26272B',
          700: '#1A1B1E',
          800: '#121317',
          900: '#0E0F12',
          950: '#06070A',
        },
        brass: {
          DEFAULT: '#B08D57', // primary accent
          50: '#FAF4E9',
          100: '#F1E4CB',
          200: '#E2C896',
          300: '#D3AC61',
          400: '#C39A4F',
          500: '#B08D57',
          600: '#8E7044',
          700: '#6B5432',
          800: '#473821',
          900: '#241C11',
        },
        ivory: {
          DEFAULT: '#EFEAE0',
          dim: '#C9C3B6',
        },
        crimson: {
          DEFAULT: '#6B1418',
          light: '#8B1A1F',
        },
      },
      fontFamily: {
        // Display = serif with weight (Cinzel-like). Body = clean precise sans.
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrainsMono-Regular', 'monospace'],
      },
      letterSpacing: {
        wider: '0.05em',
        widest: '0.15em',
      },
    },
  },
  plugins: [],
};
