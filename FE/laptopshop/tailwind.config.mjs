/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#3b82f6",
        },
        error: {
          500: "#ef4444",
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], // Ép giao diện sáng để dễ kiểm tra
  },
};
