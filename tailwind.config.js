/** @type {import('tailwindcss').Config} */
export default{
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        login: "var(--color-gray-100)",
        header: "var(--color-header)",
        surface: "var(--color-surface)",
        cta: "var(--color-cta)",
        ctaSoft: "var(--color-cta-soft)",
        textBase: "var(--color-text-base)",
        textMuted: "var(--color-text-muted)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        accentSoft: "var(--color-accent-soft)",
      },
    },
  },
  plugins: [],
};
