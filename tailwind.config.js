/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        darkSidebar: '#1E293B',  // Custom dark blue for sidebar
        darkBg: '#111827',       // Dark background for main content
      },
    },
  },
  plugins: [],
}

