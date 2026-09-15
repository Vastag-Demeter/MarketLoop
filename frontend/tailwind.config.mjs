/** @type {import('tailwindcss').Config} */
const config = {
  // Próbáld meg ezt az útvonalat, hátha a src/app keveredés a gond:
  content: [
    "./**/*.{js,ts,jsx,tsx,mdx}",
    "!./node_modules/**", // De a node_modules-t ne nézze
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
