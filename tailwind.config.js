/** @type {import('tailwindcss').Config} */
export const content = [
  './src/**/*.{js,jsx,ts,tsx}',
];
export const theme = {
  extend: {
    colors: {
      'yellow-custom': 'rgb(255, 255, 0)',
      'background-custom': 'rgba(48, 48, 48, 0.651)',
      'card-background': 'rgba(41, 41, 41, 0.9)',
    },
  },
  screens: {
    sm: '394px',
    md: '768px',
    lg: '1024px',
  },
};
export const plugins = [];
