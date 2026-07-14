import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Editorial palette */
        cream: "#FAF7F2",
        background: "#FAF7F2",
        charcoal: "#1A1A1A",
        ink: "#1A1A1A",
        pearl: "#1A1A1A",
        primary: {
          DEFAULT: "#0D7377",
          dark: "#0A5A5E",
          hover: "#149CA1",
        },
        teal: {
          DEFAULT: "#0D7377",
          dark: "#0A5A5E",
        },
        burgundy: {
          DEFAULT: "#800020",
          dark: "#5E0018",
        },
        accent: "#800020",
        muted: "#6F6A62",
        line: "rgba(26,26,26,0.10)",
        "line-strong": "rgba(26,26,26,0.18)",
        surface: "#FFFFFF",
        "surface-strong": "#F2EDE4",
        card: "rgba(255,255,255,0.72)",
        /* Retained dark tokens for the admin console */
        obsidian: {
          DEFAULT: "#050505",
          900: "#070708",
          800: "#0b0b0d",
          700: "#101013",
          600: "#16161a",
        },
        "surface-dark": "rgba(255,255,255,0.02)",
        "surface-dark-strong": "rgba(255,255,255,0.04)",
        rowalt: "rgba(255,255,255,0.02)",
        rowhover: "rgba(255,255,255,0.05)",
        danger: "#B23B3B",
        dangerbg: "rgba(178,59,59,0.10)",
        success: "#2E7D6B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(26,26,26,0.08)",
        card: "0 1px 3px 0 rgba(26,26,26,0.08), 0 18px 40px -28px rgba(26,26,26,0.35)",
        "card-hover": "0 24px 60px -28px rgba(13,115,119,0.35)",
        glow: "0 0 40px -8px rgba(13,115,119,0.45)",
        "soft-lg": "0 30px 80px -40px rgba(26,26,26,0.45)",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      maxWidth: {
        content: "76rem",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #0D7377 0%, #800020 100%)",
        "teal-gradient": "linear-gradient(135deg, #0D7377 0%, #149CA1 100%)",
        "mesh-1": "radial-gradient(circle at 20% 20%, rgba(13,115,119,0.18), transparent 60%)",
        "mesh-2": "radial-gradient(circle at 80% 30%, rgba(128,0,32,0.12), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "mesh-drift": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(4%,-3%) scale(1.08)" },
          "66%": { transform: "translate(-3%,4%) scale(0.95)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
        marquee: "marquee 28s linear infinite",
        "mesh-drift": "mesh-drift 24s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        spin: "spin 40s linear infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
