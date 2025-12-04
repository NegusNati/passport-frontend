import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        ethiopic: ['"Noto Sans Ethiopic"', 'sans-serif'],
        cursive: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
