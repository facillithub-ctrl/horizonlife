/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        horazion: {
          red: "#B6192E",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-bold": ["Inter_700Bold"],
        poppins: ["Poppins_600SemiBold"],
      },
      borderRadius: {
        hz: "12px",
      },
    },
  },
  plugins: [],
};
