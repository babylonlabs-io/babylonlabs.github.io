const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{jsx,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans],
        jakarta: ['"Plus Jakarta Sans"', ...fontFamily.sans],
        mono: ['"Fira Code"', ...fontFamily.mono],
      },
      borderRadius: {
        sm: '4px',
      },
      screens: {
        sm: '0px',
        lg: '997px',
      },
      colors: {
        primary: {
          DEFAULT:
            'rgb(var(--docs-color-primary-200, 206 101 51) / <alpha-value>)', // #ce6533
          100: 'rgb(var(--docs-color-primary-100, 218 125 79) / <alpha-value>)', // Lighter
          200: 'rgb(var(--docs-color-primary-200, 206 101 51) / <alpha-value>)', // Default
        },
        secondary: {
          DEFAULT:
            'rgb(var(--docs-color-secondary-1000, 128 63 30) / <alpha-value>)', // Darkest
          1000: 'rgb(var(--docs-color-secondary-1000, 128 63 30) / <alpha-value>)', // Darkest
          900: 'rgb(var(--docs-color-secondary-900, 153 77 38) / <alpha-value>)', // Darker
          800: 'rgb(var(--docs-color-secondary-800, 179 88 44) / <alpha-value>)', // Dark
          700: 'rgb(var(--docs-color-secondary-700, 218 125 79) / <alpha-value>)', // Light
        },
        text: {
          400: 'rgb(var(--docs-color-text-400, 153 77 38) / <alpha-value>)', // Darker Text Shade
        },
      },
    },
  },
  plugins: [],
};
