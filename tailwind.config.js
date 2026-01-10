/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Legacy colors (kept for compatibility)
                primary: "#D4907B",
                cream: "#FFFBF5",
                "background-light": "#FFFBF5",
                "background-dark": "#211114",
                "rose-gold-light": "#E5B2A3",
                "rose-gold-dark": "#D4907B",
                "deep-rose": "#9F3E50",

                // The warm, elegant background color
                'celebration-cream': {
                    DEFAULT: '#FDF8F2',
                    light: '#FFFBF5',
                },
                // The metallic Rose Gold accents
                'rose-gold': {
                    50: '#F9F1EF',
                    100: '#F4E4E0',
                    200: '#EBCBC1',
                    300: '#E2B1A3',
                    400: '#D99884',
                    500: '#D4907B', // Primary Brand Color
                    600: '#B8725E',
                    700: '#955444',
                },
                // For deep, premium typography
                'celebration-charcoal': '#2D2D2D',
                'midnight-blue': '#1A1F2C',
            },
            backgroundImage: {
                // Gradient for buttons and toggles
                'rose-gradient': 'linear-gradient(135deg, #E5B2A3 0%, #D4907B 100%)',
                // Background for the immersive player
                'immersive-gradient': 'linear-gradient(180deg, #FDF8F2 0%, #F4E4E0 100%)',
            },
            fontFamily: {
                display: ["Playfair Display", "serif"],
                serif: ["Playfair Display", "serif"],
                sans: ["Inter", "sans-serif"],
            },
            boxShadow: {
                // The "Antigravity" floating effect for cards
                'floating': '0 20px 50px rgba(212, 144, 123, 0.15)',
                'premium': '0 10px 30px rgba(0, 0, 0, 0.05)',
            },
            borderRadius: {
                DEFAULT: "12px",
                'xl': "24px",
                '2xl': "2rem",
                '3xl': "3rem",
                'celebration': '40px', // For soft, large-radius cards
            },
            animation: {
                'spin-slow': 'spin 6s linear infinite',
                'soft-pulse': 'soft-pulse 3s ease-in-out infinite',
            },
            keyframes: {
                spin: {
                    'from': { transform: 'rotate(0deg)' },
                    'to': { transform: 'rotate(360deg)' },
                },
                'soft-pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.02)' },
                }
            }
        },
    },
    plugins: [],
}
