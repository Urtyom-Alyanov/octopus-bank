const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/client/components/**/*.{js,ts,jsx,tsx}",
    "./src/client/page-components/**/*.{js,ts,jsx,tsx}",
    "./src/client/layouts/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    ...defaultTheme,
    extend: {},
    colors: {
      ...colors,
      vk: "#3f8ae0",
      first: {
        100: "#fff2f3",
        200: "#ffe4e6",
        400: "#ff5765",
        500: "#ff2a3c"
      },
      second: {
        100: "#f5f8fc",
        200: "#dde4ec",
        500: "#a4acb6"
      },
    },
    // screens: {
      
    // }
    backgroundSize: {
      ...defaultTheme.backgroundSize,
      '1/2': '50% 50%',
    },
    backgroundImage: {
      ...defaultTheme.backgroundImage,
      'profile': "url('https://media.discordapp.net/attachments/955513065787490366/970792243277467758/1610222140_13-p-fon-dlya-chata-v-telegram-14.png?width=1217&height=676')",
      'checkbox': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e")`,
    }
  },
  plugins: [],
}
