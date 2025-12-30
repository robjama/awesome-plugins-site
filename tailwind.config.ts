import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        claude: {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fad7a5',
          300: '#f7bc6d',
          400: '#f39633',
          500: '#f07b14',
          600: '#e15f09',
          700: '#ba490a',
          800: '#943a10',
          900: '#783210',
        },
      },
    },
  },
  plugins: [],
};

export default config;
