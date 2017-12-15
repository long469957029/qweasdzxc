module.exports = {
  // parser: 'sugarss',
  plugins: {
    'postcss-cssnext': {},
    'postcss-unrgba': {
      method: 'clone',
    },
    'postcss-filter-gradient': {},
    cssnano: {},
  },
}
