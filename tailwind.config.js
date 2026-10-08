/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          darkest: '#050811',
          bg: '#080d1a',
          card: '#0d1527',
          cardAlt: '#111b32',
          cardBorder: '#1c2b48',
          hoverBorder: '#294372',
          cyan: '#00f0ff',
          cyanGlow: 'rgba(0, 240, 255, 0.15)',
          blue: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
          violet: '#8b5cf6',
          muted: '#64748b',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cyber-cyan': 'none',
        'cyber-red': 'none',
        'cyber-amber': 'none',
        'cyber-card': '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
