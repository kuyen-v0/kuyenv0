const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/colorlist.txt",
    "./pages/*.{html,js,tsx}",
    "./pages/collection/**/*.js",
    "./node_modules/tw-elements/dist/js/**/*.js",
    "./node_modules/flowbite/**/*.js",
    "./components/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin"), require("flowbite/plugin")],
};
