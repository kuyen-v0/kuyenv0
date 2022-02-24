module.exports = {
  content: ["./pages/*.{html,js,tsx}", 
  './node_modules/tw-elements/dist/js/**/*.js',
  './node_modules/flowbite/**/*.js',
  './components/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tw-elements/dist/plugin'),
    require('flowbite/plugin')
  ],
}
