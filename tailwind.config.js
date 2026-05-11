/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        display: ['Heebo', 'system-ui', 'sans-serif']
      },
      colors: {
        parchment: {
          50: '#FBF7F0',
          100: '#F5F0E8',
          200: '#EAE2D4',
          300: '#DDD0BB'
        },
        ink: {
          900: '#1F2937',
          700: '#374151',
          500: '#6B7280'
        },
        royal: {
          700: '#1E3A8A',
          600: '#1E40AF',
          500: '#3B82F6'
        },
        gold: {
          600: '#C9952B',
          500: '#D4A24C',
          400: '#E5B547'
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
      }
    }
  },
  plugins: []
}
