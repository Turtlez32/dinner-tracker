import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f14",
        mist: "#f2efe9",
        clover: "#4c7a5b",
        clay: "#c36b3a",
        dusk: "#20323c"
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'IBM Plex Sans'", "sans-serif"]
      },
      boxShadow: {
        card: "0 16px 40px -24px rgba(12, 20, 33, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;
