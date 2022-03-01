module.exports = {
  content: ["./pages/*.{html,js,tsx}", 
  './pages/collection/**/*.js',
  './node_modules/tw-elements/dist/js/**/*.js',
  './node_modules/flowbite/**/*.js',
  './components/*.js'
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'angel': '#E63B2E',
        'death': '#70808A',
        'taffy': '#242485',
        'forest': '#2B7DA3',
        'bananas': '#24C2FC',
        'coldblue': '#FF8226',
        'greenvelvet': '#912429',
        'militant': '#A63026',
        'goldcharm': '#DEE0FF',
        'silvercharm': '#1C383D',
        'pearlranger': '#FFDB29',
        'violetstorm': '#FF54BF',
        'akira': '#C7C4CC',
        'whitenight': '#000000',
        'bluepill': '#4A4A54',
        'obedience': '#636357',
        'cherryblossom': '#CFD9E6',
        'zen': '#ADBAC2',
        'phoenixrising': '#6B8F94',
        'indigo': '#4D525C'
      },
    },
  },
  plugins: [
    require('tw-elements/dist/plugin'),
    require('flowbite/plugin')
  ],
}
