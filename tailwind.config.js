/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        gradient: "url('/static/background.png')",
        purple: {
          '951': 'rgba(79, 70, 229, 1)',
        },
      },
      colors: {
        purple: {
          '951': 'rgba(79, 70, 229, 1)',
        },
        gray: {
          '950': 'hsla(0, 0%, 100%, 0.7);',
          '951': 'hsla(0, 0%, 100%, 0.4);',
          '952': '#373b64',
        },
      },
    },
  },
  plugins: [],
}