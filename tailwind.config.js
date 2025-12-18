/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                kingyo: {
                    red: '#FF6B6B',
                    gold: '#FFD700',
                    water: '#B3E5FC',
                }
            }
        },
    },
    plugins: [],
}
