/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Patika brand colors
        primary:   '#0F6E56', // deep teal — main brand color
        secondary: '#1D9E75', // lighter teal — buttons, links
        accent:    '#EF9F27', // amber — highlights, boosts
        dark:      '#1A1A1A', // near black — headings
        muted:     '#73726C', // gray — secondary text
        surface:   '#F9F8F5', // off-white — backgrounds
        border:    '#E8E6E0', // light gray — borders, dividers
      },
    },
  },
  plugins: [],
};
