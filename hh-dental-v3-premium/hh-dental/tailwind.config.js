/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#2E86AB', light:'#45A3C7', dark:'#1A6585', pale:'#E6F2F7' },
        secondary: { DEFAULT: '#5BC0BE', light:'#75D6D4', dark:'#3D9997' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
        accent:  ['"Cinzel"', 'serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.5em',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #2E86AB 0%, #5BC0BE 100%)',
        'light-gradient': 'linear-gradient(160deg, #FFFFFF 0%, #F1F5F9 50%, #FFFFFF 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'shimmer':    'shimmer 2.5s infinite',
        'float':      'float 6s ease-in-out infinite',
        'line-grow':  'lineGrow 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        'primary-pulse': 'primaryPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { '0%':{ opacity:'0', transform:'translateY(40px)' }, '100%':{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:    { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        shimmer:   { '0%':{ backgroundPosition:'200% 0' }, '100%':{ backgroundPosition:'-200% 0' } },
        float:     { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-12px)' } },
        lineGrow:  { '0%':{ width:'0%' }, '100%':{ width:'100%' } },
        primaryPulse: { '0%,100%':{ boxShadow:'0 0 20px rgba(46,134,171,0.2)' }, '50%':{ boxShadow:'0 0 50px rgba(46,134,171,0.5)' } },
      },
      boxShadow: {
        'primary-sm':  '0 2px 20px rgba(46,134,171,0.15)',
        'primary-md':  '0 4px 40px rgba(46,134,171,0.25)',
        'primary-lg':  '0 8px 80px rgba(46,134,171,0.35)',
        'light-card':  '0 8px 40px rgba(0,0,0,0.08)',
        'inset-primary':'inset 0 1px 0 rgba(46,134,171,0.3)',
      },
    },
  },
  plugins: [],
};
