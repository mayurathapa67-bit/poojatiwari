import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
          hover: "#818cf8",
        },
        teal: {
          DEFAULT: "#2dd4bf",
          dark: "#14b8a6",
        },
        obsidian: {
          DEFAULT: "#050505",
          900: "#070708",
          800: "#0b0b0d",
          700: "#101013",
          600: "#16161a",
        },
        background: "#050505",
        surface: "rgba(255,255,255,0.02)",
        "surface-strong": "rgba(255,255,255,0.04)",
        ink: "#ededed",
        pearl: "#fafafa",
        muted: "#9b9ba3",
        line: "rgba(255,255,255,0.08)",
        "line-strong": "rgba(255,255,255,0.16)",
        rowalt: "rgba(255,255,255,0.02)",
        rowhover: "rgba(255,255,255,0.05)",
        danger: "#f87171",
        dangerbg: "rgba(248,113,113,0.10)",
        success: "#34d399",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.4)",
        card: "0 1px 3px 0 rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)",
        "card-hover": "0 12px 40px -12px rgba(99,102,241,0.25)",
        glow: "0 0 40px -8px rgba(99,102,241,0.45)",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      maxWidth: {
        content: "72rem",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #2dd4bf 0%, #6366f1 55%, #3b82f6 100%)",
        "mesh-1": "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 60%)",
        "mesh-2": "radial-gradient(circle at 80% 30%, rgba(45,212,191,0.28), transparent 55%)",
        "mesh-3": "radial-gradient(circle at 50% 80%, rgba(139,92,246,0.30), transparent 60%)",
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
        "spin-slow": {
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
        marquee: "marquee 18s linear infinite",
        "mesh-drift": "mesh-drift 24s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
