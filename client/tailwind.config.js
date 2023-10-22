/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      theme1: {
        "primary": "#a3e635",
        "secondary": "#ead05b",
        "accent": "#ce7433",
        "neutral": "#151e23",
        "base-100": "#373a3f",
        "info": "#40b6ce",
        "success": "#2ee5a2",
        "warning": "#f3cd62",
        "error": "#ee6f6d",
        body: {
          "background": "linear-gradient(#333135 75%,#373a3f)",
          "color": "#eef1f7",
        }
      },
    }],
  },
}

