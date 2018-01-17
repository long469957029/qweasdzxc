module.exports = {
  // parser: 'sugarss',
  plugins: {
    'postcss-cssnext': process.env.NODE_ENV === 'production' ? {
      browsers: [
        'last 3 versions',
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 6',
        'opera >= 12.1',
        'ios >= 6',
        'android >= 4.4',
        'bb >= 10',
        'and_uc 9.9',
      ],
    } : {
      browsers: [
        'last 3 versions',
      ]
    },
    'postcss-unrgba': process.env.NODE_ENV === 'production' ? {
      method: 'clone',
    } : false,
    'postcss-filter-gradient': process.env.NODE_ENV === 'production' ? {} : false,
  },
}
