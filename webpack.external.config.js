module.exports = {
  entry: {
    '1.betaTasks': {
      entry: ['./src/apps/external/betaTasks/index.js'],
      //hot: true
    },
    '1.activity': {
      entry: ['./src/apps/external/activity/index.js'],
      //hot: true
    },
    '1.advertise': {
      entry: ['./src/apps/external/advertise/index.js'],
      //hot: true
    },
    '1.newTickets': {
      entry: ['./src/apps/external/newTickets/index.js'],
    }
  },
  port: 3001,
  commonChunks: {
    'common.1': []
  },
  entries: {
    betaTasks: {
      title: '连环闯关-公测无限',
      template: './entry/package.html',
      chunks: ['common.1', '1.betaTasks']
    },
    activity: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '1.activity']
    },
    advertise: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '1.advertise']
    },
    newTickets: {
      title: '财富的捷径加州分分彩入驻无限娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '1.newTickets']
    }
  },
  output: {
    path: 'external',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'packages': 'apps/packages',
      'com': 'apps/components',
      'uiCom': 'apps/uiComponents',
      'widgets': 'apps/widgets',
      'base': 'base',

      'skeleton': 'apps/main/skeleton',

      'snap': 'Snap.svg/dist/snap.svg',
      'bootstrap': 'vendor/scripts/bootstrap',
      'modernizr': 'vendor/scripts/modernizr'
    }
  },
  providePlugin: {
    'jQuery': 'jquery',
    '$': 'jquery',
    'window.jQuery': 'jquery',
    'bootstrap': 'bootstrap',
    '_': 'underscore',
    'lo': 'lodash',
    'R': 'rambda',
    'slimScroll': 'jquery-slimscroll'
  },
  noParse: [
    /underscore.string/, /underscore/, /backbone/, /es5/, /^jquery$/, /moment/,
    /echarts/,
    /base\/scripts/,
    /html/
  ]
};
