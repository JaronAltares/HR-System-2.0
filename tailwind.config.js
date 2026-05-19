/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hrNavy: '#1B263B',       /* Deep Navy: Core components and sidebars */
        hrTeal: '#59ABBD',       /* Bright Teal: Hover actions, buttons, rings */
        hrMuted: '#9FB3C8',      /* Muted Slate: Sub-labels and borders */
        hrDarkMuted: '#4A6080',  /* Dark Gray: Descriptive content body text */
        hrSurface: '#F9FAFB',    /* Slate White: Base layout backgrounds */
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}