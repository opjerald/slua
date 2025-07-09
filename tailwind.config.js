/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#c27aff",
        white: {
          DEFAULT: "#ffffff",
          100: "#fafafa",
          200: "#c27aff",
        },
        gray: {
          100: "#878787",
          200: "#878787",
        },
        dark: {
          100: "#181C2E",
        },
        error: "#F14141",
        success: "#2F9B65",
      },
      fontFamily: {
        opensans: ["OpenSans-Regular", "sans-serif"],
        "opensans-bold": ["OpenSans-Bold", "sans-serif"],
        "opensans-semibold": ["OpenSans-SemiBold", "sans-serif"],
        "opensans-light": ["OpenSans-Light", "sans-serif"],
        "opensans-medium": ["OpenSans-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
