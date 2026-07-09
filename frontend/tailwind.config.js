/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "ibm-blue":   "#0F62FE",
        "ibm-purple": "#8A3FFC",
        "ibm-teal":   "#08BDBA",
        "ibm-gray":   "#F4F4F4",
        "ibm-dark":   "#161616",
        "ibm-hover":  "#0353E9",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":       "fadeIn 0.5s ease-in-out",
        "slide-up":      "slideUp 0.4s ease-out",
        "pulse-slow":    "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "typing":        "typing 1s steps(3) infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 },              "100%": { opacity: 1 } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: 0 }, "100%": { transform: "translateY(0)", opacity: 1 } },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":   "linear-gradient(135deg, #0F62FE 0%, #8A3FFC 50%, #08BDBA 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
