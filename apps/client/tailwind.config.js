/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system colors from design.json
        'navy': '#04102D',
        'teal': '#6F9F9F',
        'teal-light': '#C5D6D6',
        'mint': '#E5F3EE',
        'blue-bar': '#1C2C65',
        'green-bar': '#5BAB9C',
        'warning-orange': '#FFB25C',
        'success-green': '#45C08D',
        'error-red': '#EA5A6B',
        'neutral-000': '#FFFFFF',
        'neutral-050': '#F4F5F7',
        'neutral-100': '#ECEEF1',
        'neutral-200': '#DADDE2',
        'neutral-300': '#B8BCC6',
        'neutral-400': '#969BA7',
        'neutral-500': '#6E7380',
        
        // Legacy colors for backward compatibility
        'ink': '#04102D',
        'lavender': '#6F9F9F',
        'mist': '#F4F5F7',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 2px 6px rgba(4,16,45,0.06)',
        'popover': '0 8px 24px rgba(4,16,45,0.14)',
      },
      spacing: {
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-5': '20px',
        'space-6': '24px',
        'space-7': '32px',
        'space-8': '40px',
        'space-9': '48px',
      },
      fontSize: {
        'xs': '0.75rem', // 12px
        'sm': '0.875rem', // 14px
        'base': '1rem', // 16px
        'lg': '1.125rem', // 18px
        'xl': '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
      },
      lineHeight: {
        'tight': '1.2',
        'snug': '1.4', // As per design
      },
      letterSpacing: {
        'tight': '-0.15px',
        'normal': '0',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    }
  },
  plugins: [],
} 