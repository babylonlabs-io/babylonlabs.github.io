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
        // `font-sans` and `font-mono` resolve to the same CSS variables as the
        // Infima --ifm-font-family-* tokens. `body { @apply font-sans }` in
        // custom.css outranks the Infima token, so if these two disagreed the
        // documentation body would silently keep the old face.
        sans: ['var(--tbv-font-sans)'],
        jakarta: ['"Plus Jakarta Sans"', ...fontFamily.sans],
        mono: ['var(--tbv-font-mono)'],
        // One family across the site, per the design review. `code` is the
        // only true monospace left and is reserved for code samples.
        display: ['var(--tbv-font-serif)'],
        ui: ['var(--tbv-font-sans)'],
        code: ['var(--tbv-font-code)'],
        label: ['var(--tbv-font-sans)'],
      },
      screens: {
        // `sm` was pinned to 0px, which made every `sm:` class match at all
        // widths. That left only md (768) and lg (997) as real breakpoints, so
        // layouts jumped straight from phone to full desktop with nothing in
        // between, and it silently defeated the two places that relied on the
        // standard behaviour: `hidden sm:inline` in ChatWidget never hid
        // anything, and `w-[90vw] sm:w-[440px]` in HeroSection never used the
        // 90vw. Restored to the Tailwind default.
        sm: '640px',
        // Kept. 997px matches the Docusaurus sidebar breakpoint.
        lg: '997px',
      },
      colors: {
        primary: {
          DEFAULT:
            'rgb(var(--docs-color-primary-200, 190 220 201) / <alpha-value>)', // #ce6533
          100: 'rgb(var(--docs-color-primary-100, 190 220 201) / <alpha-value>)', // Lighter
          200: 'rgb(var(--docs-color-primary-200, 190 220 201) / <alpha-value>)', // Default
        },
        secondary: {
          DEFAULT:
            'rgb(var(--docs-color-secondary-1000, 51 197 206) / <alpha-value>)', // Darkest
          100: 'rgb(var(--docs-color-primary-100, 51 197 206) / <alpha-value>)', // Dark
          200: 'rgb(var(--docs-color-primary-200, 51 197 206) / <alpha-value>)', // Dark
          1000: 'rgb(var(--docs-color-secondary-1000, 128 63 30) / <alpha-value>)', // Darkest
          900: 'rgb(var(--docs-color-secondary-900, 153 77 38) / <alpha-value>)', // Darker
          800: 'rgb(var(--docs-color-secondary-800, 179 88 44) / <alpha-value>)', // Dark
          700: 'rgb(var(--docs-color-secondary-700, 218 125 79) / <alpha-value>)', // Light
        },
        text: {
          400: 'rgb(var(--docs-color-text-400, 153 77 38) / <alpha-value>)', // Darker Text Shade
        },

        // TBV reskin tokens. Stored as RGB channels, not hex, so that opacity
        // modifiers such as `border-border/60` keep working. A hex value here
        // would make Tailwind drop the `<alpha-value>` placeholder silently.
        background: 'rgb(var(--tbv-background) / <alpha-value>)',
        foreground: 'rgb(var(--tbv-foreground) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--tbv-muted) / <alpha-value>)',
          foreground: 'rgb(var(--tbv-muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--tbv-border) / <alpha-value>)',
        'border-strong': 'rgb(var(--tbv-border-strong) / <alpha-value>)',
        contrast: 'rgb(var(--tbv-contrast) / <alpha-value>)',
        tertiary: 'rgb(var(--tbv-tertiary-foreground) / <alpha-value>)',
        status: 'rgb(var(--tbv-status) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--tbv-accent) / <alpha-value>)',
          foreground: 'rgb(var(--tbv-accent-foreground) / <alpha-value>)',
        },
        // Secondary accent, used sparingly for structure. Named `steel`
        // rather than `blue` so it does not shadow Tailwind's built-in blue
        // palette, which custom.css still uses (e.g. bg-blue-100).
        steel: 'rgb(var(--tbv-blue) / <alpha-value>)',
        'surface-navy': 'rgb(var(--tbv-surface-blue) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
