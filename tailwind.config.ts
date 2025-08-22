import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#508C7E",        // soft green
        secondary: "#D3EDE6",      // pale mint
        background: "#F9F9F9",     // off-white
        foreground: "#111827",     // near-black
        muted: "#9CA3AF",          // gray text
      },
      fontFamily: {
        heading: ["'Cabinet Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",       // rounded
        lg: "1rem",               // extra-rounded for cards
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
