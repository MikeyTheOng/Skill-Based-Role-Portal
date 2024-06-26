/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        minHeight: {
          '4/5': '30vh',
        },
        height:{
          'navBar': '400px',
        }
      },
    colors:{
      'blurple': "#5865f2",
      'background': "#E9EAFC",
      'cblurple': {
            100: "#dee0fc",
            200: "#bcc1fa",
            300: "#9ba3f7",
            400: "#7984f5",
            600: "#4651c2",
            700: "#353d91",
            800: "#232861",
            900: "#121430"
      },
      bgreen: {
          100: "#e1f1ec",
          200: "#c4e3da",
          300: "#a6d6c7",
          400: "#89c8b5",
          500: "#6bbaa2",
          600: "#569582",
          700: "#407061",
          800: "#2b4a41",
          900: "#152520"
      },
      
    },
    },
  },
  plugins: [],
}
