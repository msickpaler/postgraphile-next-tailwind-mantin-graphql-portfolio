/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  darkMode: "class",
  theme: {
    // mantineのデフォルト値に合わせる
    screens: {
      xs: "30em",
      sm: "48em",
      md: "64em",
      lg: "74em",
      xl: "90em",
    },
    extend: {
      colors: {
        light: {
          secondary: "#f8f8f8",
          background: "#ffffff",
          border: "#EBEBEB",
          hover: {
            secondary: "#e8e8e8",
            background: "#eee",
          },
        },
        dark: {
          secondary: "#2f2f2f",
          background: "#262626",
          border: "#333",
          hover: {
            secondary: "#3f3f3f",
            background: "#2e2e2e",
          },
        },
        primary: "#3393f2",
        error: "#EB5756",
      },
    },
  },
  plugins: [],
};
