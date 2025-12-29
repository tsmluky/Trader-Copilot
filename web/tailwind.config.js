/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                background: '#020617', // Obsidian
                surface: '#0f172a',
                brand: {
                    400: '#38bdf8', // Sky Blue
                    500: '#0ea5e9',
                    600: '#0284c7',
                    glow: 'rgba(56, 189, 248, 0.5)',
                },
                accent: {
                    500: '#6366f1', // Indigo
                    glow: 'rgba(99, 102, 241, 0.5)',
                },
                gold: {
                    400: '#fbbf24', // Amber
                    500: '#f59e0b',
                    glow: 'rgba(251, 191, 36, 0.5)',
                }
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
                'radial-fade': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
                'shimmer': 'linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 60%)',
                'premium-gradient': 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scroll': 'scroll 30s linear infinite',
                'shine': 'shine 8s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                shine: {
                    '0%, 100%': { backgroundPosition: '-200% center' },
                    '50%': { backgroundPosition: '200% center' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
