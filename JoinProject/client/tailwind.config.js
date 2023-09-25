/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#76C044"
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
