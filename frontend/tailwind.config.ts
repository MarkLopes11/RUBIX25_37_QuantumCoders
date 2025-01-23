import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1e1e2f', // Dark cool background
        foreground: '#f0f1f9', // Light foreground
        card: {
          DEFAULT: '#2d2f45', // Cool purple card background
          foreground: '#ffffff', // White text on the card
        },
        popover: {
          DEFAULT: '#2a2b38', // Cool blue for popover
          foreground: '#ffffff', // White text in popover
        },
        primary: {
          DEFAULT: '#3f51b5', // Cool blue primary color
          foreground: '#ffffff', // White text on primary
        },
        secondary: {
          DEFAULT: '#9c27b0', // Cool purple secondary color
          foreground: '#ffffff', // White text on secondary
        },
        muted: {
          DEFAULT: '#607d8b', // Muted blue
          foreground: '#ffffff', // White text
        },
        accent: {
          DEFAULT: '#4caf50', // Accent color in green
          foreground: '#ffffff', // White text on accent
        },
        destructive: {
          DEFAULT: '#d32f2f', // Red for destructive actions
          foreground: '#ffffff', // White text on destructive
        },
        border: '#37474f', // Dark cool border color
        input: '#ffffff', // White input fields
        ring: '#3f51b5', // Blue ring color for focus effect
        chart: {
          '1': '#3f51b5', // Cool blue chart color
          '2': '#9c27b0', // Cool purple chart color
          '3': '#4caf50', // Green chart color
          '4': '#d32f2f', // Red chart color
          '5': '#f57c00', // Orange chart color
        },

        // Custom colors for your project (cool blue and purple tones)
        "n-1": "#e8f0fe",  // Light blue background
        "n-2": "#b3c4f7",  // Light purple background
        "n-3": "#8a99d1",  // Muted blue background
        "n-4": "#546fa1",  // Text color
        "n-5": "#3f51b5",  // Cool blue text color
        "n-6": "#1e2a47",  // Dark blue text color
        "n-7": "#121b30",  // Almost black cool background
        "n-8": "#0d1022",  // Very dark blue background
        "primary-light": "#ffcb00",  // Primary light color
        "primary-dark": "#d59b00",   // Primary dark color
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
