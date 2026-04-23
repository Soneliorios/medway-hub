import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--mw-font)", "Montserrat", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        /* Medway brand */
        mw: {
          base:      "#08091A",
          surface:   "#0D1024",
          elevated:  "#131629",
          hover:     "#1A1F35",
          navy:      "#00205B",
          "navy-80": "#334C7C",
          "navy-60": "#66799D",
          "navy-40": "#99A6BD",
          teal:      "#01CFB5",
          "teal-80": "#34D9C4",
          "teal-60": "#67E2D3",
          /* specialty */
          clinic:     "#407EC9",
          surgery:    "#00EFC8",
          go:         "#AC145A",
          pediatrics: "#FFB81C",
          preventive: "#3B3FB6",
          /* text */
          "text-primary":   "#FFFFFF",
          "text-secondary": "#99A6BD",
          "text-muted":     "#66799D",
        },
      },
      borderRadius: {
        mw:    "8px",
        "mw-md": "12px",
        "mw-lg": "16px",
      },
      boxShadow: {
        "mw-card":  "0 4px 24px rgba(0, 32, 91, 0.4)",
        "mw-hover": "0 8px 40px rgba(1, 207, 181, 0.15)",
        "mw-glow":  "0 0 24px rgba(1, 207, 181, 0.2)",
        "mw-glow-lg": "0 0 48px rgba(1, 207, 181, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "linear-gradient(to top, #08091A 0%, rgba(8,9,26,0.7) 50%, transparent 100%)",
        "gradient-card":
          "linear-gradient(to top, #08091A 0%, rgba(8,9,26,0) 100%)",
      },
      animation: {
        "orb-1": "orb-float-1 12s ease-in-out infinite",
        "orb-2": "orb-float-2 16s ease-in-out infinite",
        "orb-3": "orb-float-3 10s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.3s ease-out forwards",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
      keyframes: {
        "orb-float-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%":       { transform: "translate(30px, -20px) scale(1.05)" },
        },
        "orb-float-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%":       { transform: "translate(-25px, 30px) scale(0.95)" },
        },
        "orb-float-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%":       { transform: "translate(15px, 25px) scale(1.08)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%":       { transform: "scale(1.3)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
