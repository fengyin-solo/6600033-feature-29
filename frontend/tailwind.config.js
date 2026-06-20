/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        'brand-accent': '#22d3ee',
        'brand-accent-hover': '#06b6d4',
        'brand-glow': 'rgba(34, 211, 238, 0.35)',
        'surface-1': '#0f172a',
        'surface-2': '#1e293b',
        'surface-3': '#334155',
        'positive': '#10b981',
        'positive-bright': '#34d399',
        'positive-bg': 'rgba(16, 185, 129, 0.12)',
        'positive-border': 'rgba(16, 185, 129, 0.4)',
        'warning': '#f59e0b',
        'warning-bright': '#fbbf24',
        'warning-bg': 'rgba(245, 158, 11, 0.15)',
        'warning-border': 'rgba(245, 158, 11, 0.45)',
        'danger': '#ef4444',
        'danger-bright': '#f87171',
        'danger-bg': 'rgba(239, 68, 68, 0.18)',
        'danger-border': 'rgba(239, 68, 68, 0.5)',
        'danger-glow': 'rgba(239, 68, 68, 0.4)',
        'info-bright': '#60a5fa',
        'key-value': '#e0f2fe',
        'muted-label': '#64748b'
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.25), 0 0 40px rgba(34, 211, 238, 0.1)',
        'glow-danger': '0 0 18px rgba(239, 68, 68, 0.35), 0 0 36px rgba(239, 68, 68, 0.15)',
        'glow-positive': '0 0 18px rgba(16, 185, 129, 0.3)',
        'inner-card': 'inset 0 1px 0 rgba(255,255,255,0.04)'
      },
      keyframes: {
        pulseAlert: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        highlight: {
          '0%': { backgroundColor: 'rgba(34, 211, 238, 0.25)' },
          '100%': { backgroundColor: 'transparent' }
        }
      },
      animation: {
        'pulse-alert': 'pulseAlert 1.8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.2s ease-in-out infinite',
        'highlight': 'highlight 1s ease-out'
      },
      fontSize: {
        'data-xl': ['1.75rem', { lineHeight: '1.1', fontWeight: '800' }],
        'data-lg': ['1.35rem', { lineHeight: '1.15', fontWeight: '700' }]
      }
    }
  },
  plugins: []
}
