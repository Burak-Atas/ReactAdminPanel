/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#010851',
        secondary: '#9A7AF1',
        tartiary: '#707070',
        pink: '#EE9AE5',
        special_green: '#06D001',
        special_dark_green: '#03fc84',
        //blue: '#0057FFCC',
        purple: '#4200ff99',
        dashboard: '#93c5fd',
      },
    },
    screens: {
      xs: '480px',
      ss: '620px',
      sm: '768px',
      md: '1060px',
      lg: '1200px',
      xl: '1700px',
    },

    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2.5xl': '1.363rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
  },
  plugins: [],
}
