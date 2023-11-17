/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}", "./*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "hero-pattern": "url('/img/Route Planner Hero.png')",
      }),
      fontFamily: {
        formeraRegular: ["Formera Regular", "sans-serif"], // Add your font name here
        formeraLight: ["Formera Light", "sans-serif"], // Add your font name here
      },
      colors: {
        "custom-white": "#FAFBFB",
        "custom-black": "#010D17",
        "sunset-orange": "#FF7464",
      },
      aspectRatio: {
        "16/9": "16 / 9",
        // ... other aspect ratios
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
