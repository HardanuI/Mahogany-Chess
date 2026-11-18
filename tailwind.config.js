/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F2EB',
          50: '#FBF9F5',
          100: '#F5F2EB',
          200: '#EAE4D8',
          300: '#DCD3C2',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#2B2926',
        },
        olive: {
          DEFAULT: '#6B704C',
          light: '#8E9370',
          dark: '#4E5236',
        },
        umber: {
          DEFAULT: '#8B6B4A',
          light: '#B08D69',
          dark: '#6A4F35',
        },
        board: {
          light: '#EFE5D3',
          dark: '#B38E6A',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.32em',
      },
      boxShadow: {
        glass:
          '0 10px 40px -12px rgba(40, 30, 20, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.55)',
        frame: '0 50px 120px -40px rgba(40, 28, 16, 0.55)',
        ink: '0 14px 30px -12px rgba(26, 26, 26, 0.65)',
      },
    },
  },
  plugins: [],
}
