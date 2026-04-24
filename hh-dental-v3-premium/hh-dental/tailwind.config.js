/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian:  { DEFAULT: '#0F0F0F', 50:'#1a1a1a', 100:'#141414', 200:'#0F0F0F', 300:'#0a0a0a' },
        ivory:     { DEFAULT: '#F5F0E8', light:'#FAF8F3', dark:'#EDE5D0', deeper:'#D9CDB4' },
        gold:      { DEFAULT: '#D4AF37', light:'#E8CC6A', dark:'#B8961E', pale:'#F0E4A0', dim:'#8B7322' },
        rose:      { DEFAULT: '#C97B63', light:'#DCA090', dark:'#A85F49' },
        charcoal:  { DEFAULT: '#1C1C1E', light:'#2A2A2D', mid:'#3A3A3E', border:'#2F2F33' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Jost"', 'system-ui', 'sans-serif'],
        accent:  ['"Cinzel"', 'serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.5em',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F0E4A0 50%, #B8961E 100%)',
        'dark-gradient': 'linear-gradient(160deg, #0F0F0F 0%, #1C1C1E 50%, #0F0F0F 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'shimmer':    'shimmer 2.5s infinite',
        'float':      'float 6s ease-in-out infinite',
        'line-grow':  'lineGrow 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        'gold-pulse': 'goldPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { '0%':{ opacity:'0', transform:'translateY(40px)' }, '100%':{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:    { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        shimmer:   { '0%':{ backgroundPosition:'200% 0' }, '100%':{ backgroundPosition:'-200% 0' } },
        float:     { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-12px)' } },
        lineGrow:  { '0%':{ width:'0%' }, '100%':{ width:'100%' } },
        goldPulse: { '0%,100%':{ boxShadow:'0 0 20px rgba(212,175,55,0.2)' }, '50%':{ boxShadow:'0 0 50px rgba(212,175,55,0.5)' } },
      },
      boxShadow: {
        'gold-sm':  '0 2px 20px rgba(212,175,55,0.15)',
        'gold-md':  '0 4px 40px rgba(212,175,55,0.25)',
        'gold-lg':  '0 8px 80px rgba(212,175,55,0.35)',
        'dark-card':'0 8px 40px rgba(0,0,0,0.6)',
        'inset-gold':'inset 0 1px 0 rgba(212,175,55,0.3)',
      },
    },
  },
  plugins: [],
};
