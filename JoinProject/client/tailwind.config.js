/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#76C044",
        secondary: "#52525b",
        'icon-color': '#4338CA',
        'btn-color': "#4338CA",
        'active': '#4338CA'
      },
    },
  },
};
