/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // for Next.js 13+ App directory
    "./pages/**/*.{js,ts,jsx,tsx}", // for traditional Pages directory
    "./components/**/*.{js,ts,jsx,tsx}",
     "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can add custom colors, fonts, spacing, etc. here
      colors: {
        primary: "#1E40AF",
        secondary: "#F59E0B",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // if you're using shadcn

};
