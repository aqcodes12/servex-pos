/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#0F172A",
        secondary: "#14B8A6",
        accent: "#F97316",
        background: "#F8FAFC",
        text: "#1E293B",
      },
    },
  },
  plugins: [],
};
