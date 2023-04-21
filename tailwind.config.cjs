/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin")

module.exports = {
  darkMode: ["class", ".figma-dark"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      animation: {
        cursor: "cursor 2.5s infinite alternate cubic-bezier(0.65, 0, 0.35, 1)",
        selection: "selection 2.5s infinite alternate cubic-bezier(0.65, 0, 0.35, 1)",
      },
      colors: {
        figma: {
          blue: `#18a0fb`,
          purple: "#7b61ff",
          "hot-pink": "#ff00ff",
          green: "#1bc47d",
          red: "#f24822",
          yellow: "#ffeb00",
          gray: {
            700: "#383838",
            800: "#2c2c2c",
            900: "#1e1e1e",
          },
        },
        foreground: "",
      },
      keyframes: {
        cursor: {
          "0%, 20%": { translate: "-160px -160px" },
          "80%, 100%": { translate: "0px 0px" },
        },
        selection: {
          "0%, 20%": { width: "40px", height: "40px" },
          "80%, 100%": { width: "200px", height: "200px" },
        },
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("active", ".active&")
      addVariant("selection", "&::selection")
    }),
  ],
}
