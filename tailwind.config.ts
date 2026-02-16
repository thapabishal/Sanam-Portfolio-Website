import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Only src folder for Next.js
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        beautician: {
          primary: '#C9A87C',
          secondary: '#E8D5C4',
          accent: '#A67C52',
          text: '#2C2416',
          background: '#FAF7F4',
        },
        barista: {
          primary: '#3E2723',
          secondary: '#6D4C41',
          accent: '#D7A86E',
          text: '#F5F5F5',
          background: '#1A1512',
        },
        neutral: {
          white: '#FFFFFF',
          100: '#F5F5F5',
          200: '#E0E0E0',
          700: '#4A4A4A',
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        accent: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;