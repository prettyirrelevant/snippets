module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.js"],
  },
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        inter: "Inter",
        jetbrains: "JetBrains Mono",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/custom-forms")],
};
