/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aurenza Academy Brand Colors
        primary: "#7A008C",       // Aurenza Purple
        primaryHover: "#5C006A",  // Darker Purple
        accent: "#E85AD9",        // Aurenza Pink
        enterpriseBg: "#FFFFFF",  // White background
        sectionBg: "#FAFAFC",     // Section Background
        textPrimary: "#1A1A1A",    // Deep Text
        textSecondary: "#5A5A6A",  // Slate Text
        borderLight: "#ECECF4",    // Border Tone
        
        successGreen: "#10B981",
        warningAmber: "#F59E0B",
        dangerRed: "#EF4444",

        // Backward compatibility mappings
        applePurple: "#7A008C",
        appleGlow: "#0C182F",
        applePink: "#E85AD9",
        appleLavender: "#ECECF4",
        appleGray: "#FAFAFC",
        appleDark: "#1A1A1A",
        royal: "#7A008C",
        aurenza: "#7A008C",
        blush: "#0C182F",
        ink: "#1A1A1A",
        mist: "#FAFAFC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        outfit: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        btn: "12px",
        input: "12px",
        card: "16px",
        modal: "20px",
        badge: "999px",
      },
      fontSize: {
        'h1': ['56px', { lineHeight: '1.2', fontWeight: '800' }],
        'h2': ['42px', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['24px', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.5' }],
        'body': ['16px', { lineHeight: '1.5' }],
        'small': ['14px', { lineHeight: '1.5' }],
      },
      boxShadow: {
        soft: "0px 8px 24px rgba(0,0,0,0.08)",
        premium: "0px 12px 32px rgba(122, 0, 140, 0.08)",
        glass: "0 10px 30px rgba(122, 0, 140, 0.02)",
        glowPurple: "0 0 20px rgba(122, 0, 140, 0.12)",
        neonPurple: "0 0 25px rgba(122, 0, 140, 0.1)",
        neonPink: "0 0 25px rgba(232, 90, 217, 0.1)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #7A008C 0%, #E85AD9 100%)",
        "apple-gradient": "linear-gradient(90deg, #7A008C 0%, #E85AD9 100%)",
        "apple-radial": "radial-gradient(circle at top left, rgba(232, 90, 217, 0.04), transparent 40%), radial-gradient(circle at 82% 18%, rgba(122, 0, 140, 0.03), transparent 35%)",
        "soft-radial": "radial-gradient(circle at top, rgba(122, 0, 140, 0.03), transparent 50%)",
        "vision-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 248, 251, 0.9) 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
