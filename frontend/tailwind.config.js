import uiConfig from '../packages/ui/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...uiConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...uiConfig.theme,
    extend: {
      ...uiConfig.theme.extend,
      boxShadow: {
        'card-shadow': '0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.1)',
        'fab-shadow': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'header-shadow': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'nav-shadow': '0 -2px 8px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
