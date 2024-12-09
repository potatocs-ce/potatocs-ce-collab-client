/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  important: true,
  purge: {
    enabled: true,
    content: ["./src/**/*.html", "./src/**/*.scss"],
  },
  theme: {
    extend: {},
    fontFamily: {
      // common font
      noto: ["sans-serif", "Noto Sans KR"],
      // logo
      logo: ["Alfa Slab One"],
    },
  },
  plugins: [],
}

