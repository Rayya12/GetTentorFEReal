/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ← Add this line here
  content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        blue: '#3674B5',
        'blue-dark': '#3674b5',
        'light-blue': '#A1E3F9',
        'cyan':"#D1f8EF"
      },
    },
  },
  plugins: [],
}
