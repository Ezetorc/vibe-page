/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gunmetal: '#132122',
        'caribbean-current': '#2C6B6C',
        verdigris: '#63B5B1',
        'orange-crayola': '#EE7C48'
      },
      borderWidth: {
        vibe: '2px'
      },
      padding: {
        nav: '80px'
      },
      borderRadius: {
        vibe: '5px'
      },
      fontFamily: {
        'poppins-light': 'poppins-light',
        'poppins-regular': 'poppins-regular',
        'poppins-semibold': 'poppins-semibold'
      }
    }
  },
  plugins: []
}
