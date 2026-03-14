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
        primary: "#C1440E",
        secondary: "#F5E6D0",
        accent: "#1B3A6B",
        "text-dark": "#2C1810",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-playfair)", "Georgia", "serif"],
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.95", transform: "scale(1.02)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(193, 68, 14, 0.5)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 12px 4px rgba(193, 68, 14, 0.4)" },
        },
        "dash-flow": {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "24" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ring-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scan-line": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(120px)" },
        },
        "card-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "33.33%" },
        },
      },
      animation: {
        pulse: "pulse 2.5s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
        "dash-flow": "dash-flow 0.6s linear infinite",
        shimmer: "shimmer 2s ease-in-out 1",
        "ring-rotate": "ring-rotate 8s linear infinite",
        "scan-line": "scan-line 3s ease-in-out infinite",
        "card-float": "card-float 3s ease-in-out infinite",
        "progress-fill": "progress-fill 1.5s ease-out forwards",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(44, 24, 16, 0.08)",
        "soft-lg": "0 10px 40px rgba(44, 24, 16, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
