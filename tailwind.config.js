/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        obsidian: '#0c0e11',
        charcoal: '#16191d',
        charcoal2: '#1e2226',
        platinum: '#d8d9d6',
        steel: '#8b9096',
        oxblood: '#7a1f2b',
        oxblood2: '#a52c3a',
      },
    },
  },
  plugins: [],
}
