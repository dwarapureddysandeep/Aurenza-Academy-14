/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        applePurple: '#6A00FF',
        appleGlow: '#8A2EFF',
        appleLavender: '#C8B6FF',
        appleGray: '#F5F5F7',
        appleDark: '#111111',
        royal: '#6A00FF',
        aurenza: '#8A2EFF',
        blush: '#C8B6FF',
        ink: '#111111',
        mist: '#F5F5F7',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 24px 80px rgba(106, 0, 255, 0.08)',
        soft: '0 12px 40px rgba(17, 17, 17, 0.03)',
        glass: '0 20px 50px rgba(106, 0, 255, 0.05)',
      },
      backgroundImage: {
        'apple-gradient': 'linear-gradient(135deg, #6A00FF 0%, #8A2EFF 52%, #C8B6FF 100%)',
        'soft-radial': 'radial-gradient(circle at top left, rgba(200, 182, 255, 0.15), transparent 35%), radial-gradient(circle at 82% 18%, rgba(138, 46, 255, 0.08), transparent 30%)',
        'vision-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 245, 247, 0.6) 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

