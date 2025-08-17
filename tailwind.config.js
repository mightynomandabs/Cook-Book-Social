/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core gradient colors (Food-fire gradients)
        'cb-saffron': '#FF7A00',
        'cb-coral': '#FF3D54',
        'cb-lemon': '#FFD642',
        
        // Neutrals
        'cb-charcoal': '#101114',
        'cb-slate': '#1B1D22',
        'cb-gray-600': '#6B7280',
        'cb-gray-200': '#E5E7EB',
        'cb-off-white': '#FAFAFB',
        
        // Semantic colors
        'cb-success': '#22C55E',
        'cb-warning': '#F59E0B',
        'cb-danger': '#EF4444',
        'cb-info': '#3B82F6',
        
        // Legacy colors (keeping for backward compatibility)
        'cookbook-orange': '#FF8800',
        'cookbook-yellow': '#FFD943',
        'cookbook-green': '#7CC144',
        'cookbook-black': '#090909',
        'cookbook-white': '#FFFFFF'
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #FF7A00 0%, #FF3D54 50%, #FFD642 100%)',
        'gradient-vignette': 'radial-gradient(ellipse at center, transparent 0%, rgba(16,17,20,0.1) 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(27,29,34,0.8) 0%, rgba(27,29,34,0.6) 100%)',
        'gradient-primary': 'var(--cb-gradient-primary)',
        'gradient-conic': 'var(--cb-gradient-conic)',
        'gradient-radial': 'var(--cb-gradient-radial)',
      },
      fontFamily: {
        'inter': ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
      fontSize: {
        'display': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h3': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'caption': ['13px', { lineHeight: '18px', fontWeight: '500' }],
      },
      spacing: {
        '18': '72px',
        '88': '352px',
      },
      borderRadius: {
        'cb-sm': '8px',
        'cb-lg': '16px',
        'cb-xl': '24px',
      },
      boxShadow: {
        'cb-low': '0 1px 2px rgba(0,0,0,.06)',
        'cb-mid': '0 6px 20px rgba(16,17,20,.18)',
        'cb-high': '0 14px 40px rgba(16,17,20,.28)',
        'cb-glow': '0 0 20px rgba(255,122,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 240ms cubic-bezier(0.2,0.8,0.2,1)',
        'slide-up': 'slideUp 320ms cubic-bezier(0.2,0.8,0.2,1)',
        'scale-in': 'scaleIn 260ms cubic-bezier(0.2,0.8,0.2,1)',
        'bounce-soft': 'bounceSoft 600ms cubic-bezier(0.68,-0.55,0.265,1.55)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255,122,0,0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255,122,0,0.6)',
            transform: 'scale(1.05)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionTimingFunction: {
        'ease-out-quick': 'cubic-bezier(0.2,0.8,0.2,1)',
        'ease-emph': 'cubic-bezier(0.68,-0.55,0.265,1.55)',
        'spring-soft': 'cubic-bezier(0.25,0.46,0.45,0.94)',
      },
      transitionDuration: {
        '80': '80ms',
        '120': '120ms',
        '180': '180ms',
        '220': '220ms',
        '240': '240ms',
        '260': '260ms',
        '320': '320ms',
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}
