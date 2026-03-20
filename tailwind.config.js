// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        signal: {
          teal: "#2dd4bf", // teal-400
          amber: "#fbbf24", // amber-400
          coral: "#fb7185", // rose-400
        },
      },
      fontFamily: {
        mono: ["SpaceMono"],
      },
    },
  },
  plugins: [],
};
