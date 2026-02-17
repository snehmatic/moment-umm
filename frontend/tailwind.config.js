/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // Zinc-950 (Rich Black)
        surface: "#18181b",    // Zinc-900
        surfaceHighlight: "#27272a", // Zinc-800
        primary: "#eab308",    // Yellow-500 (Gold)
        primaryHover: "#ca8a04", // Yellow-600
        text: "#fafafa",       // Zinc-50 (White)
        textSecondary: "#a1a1aa", // Zinc-400
        border: "#27272a",     // Zinc-800
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(234, 179, 8, 0.3)',
      }
    },
  },
  plugins: [],
}
