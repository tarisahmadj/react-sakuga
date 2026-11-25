import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sakuga: {
          page: "#ffffff",
          ink: "#1d1a4a",
          mute: "#8580b0",
          line: "#dcdaf0",
          chip: "#f4f3fc",
          acc: "#ff5fa8",
          pri: "#7c5cff",
        },
      },
    },
  },
  plugins: [],
};
export default config;
