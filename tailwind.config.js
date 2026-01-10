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
                primary: "#e8304f", // Updated from desktop design
                "background-light": "#fcf8f9",
                "background-dark": "#211114",
                "rose-gold": "#e7d0d4",
                "deep-rose": "#974e5a",
            },
            fontFamily: {
                display: ["Playfair Display", "serif"], // Keeping Playfair as originally requested, distinct from Jakarta
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "12px",
                'xl': "24px",
                '2xl': "2rem",
                '3xl': "3rem",
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
