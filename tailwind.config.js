/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        'primary-light': '#40A645',
        'primary-4': '#D8FFDA',
        'main-bg': '#F7FFF8',
        accent: '#FDC500',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        error: '#FDC500',
        gray: '#9E9E9E',
        'gray-light': '#E0E0E0',
        success: '#40A645',
      },
      borderColor: {
        error: '#FDC500',
        primary: '#EAEAEA',
        main: '#2E7D32'
      },
      fontFamily: {
        plus: ['PlusJakartaSans_400Regular'],
        'plus-medium': ['PlusJakartaSans_500Medium'],
        'plus-semibold': ['PlusJakartaSans_600SemiBold'],
        'plus-bold': ['PlusJakartaSans_700Bold'],
        satoshi: ['Satoshi-Regular'],
        'satoshi-medium': ['Satoshi-Medium'],
        'satoshi-bold': ['Satoshi-Bold'],
        'satoshi-black': ['Satoshi-Black'],
      },
      borderRadius: {
        xl: 16,
        '2xl': 24,
      },
    },
  },
  plugins: [],
};
