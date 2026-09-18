/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F9D74',
          light: '#E6F7F2',
        },
        accent: {
          DEFAULT: '#FF6B4A',
          light: '#FFF0EC',
        },
        background: '#FAFAFA',
        surface: '#FFFFFF',
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
        },
        border: '#E5E7EB',
        cash: '#22C55E',
        upi: '#6366F1',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
