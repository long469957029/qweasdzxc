module.exports = {
  entry: {
    '1.main': './src/apps/main/index.js',
    '1.login': './src/apps/packages/login/login.js',
    '1.register': './src/apps/packages/register/register.js',
    '1.trend': './src/apps/packages/trend/index.js',
    '1.resetPassword': './src/apps/packages/resetPassword/resetPassword.js',
    '1.updateUserInfo': './src/apps/packages/updateUserInfo/updateUserInfo.js',
    '1.merchants': './src/apps/packages/merchants/index.js',
    '1.404': './src/apps/packages/404/index.js',
    '1.mmc': './src/apps/packages/mmc/index.js',
    '1.charge': './src/apps/packages/charge/index.js',
    '1.changeUrl': './src/apps/packages/changeUrl/index.js',
    '1.leaflets': './src/apps/packages/leaflets/index.js',
    '1.download': './src/apps/packages/download/index.js',
    '1.dragonAndTiger': './src/apps/packages/dragonAndTiger/index.js',
    '4.base': './src/base/build.base.js',
    '2.vendor': './src/vendor/build.core.js',
    '1.oneYear': './src/apps/packages/oneYear/index.js',
    '1.vip': './src/apps/packages/vip/index.js',
    '1.expedition': './src/apps/packages/expedition/index.js',
    '1.newDownload': './src/apps/packages/newDownload/index.js',
    '1.integration': './src/apps/packages/integration/index.js',
    '1.binding': './src/apps/packages/binding/index.js',
    '1.regist': './src/apps/packages/registers/index.js',
    '1.update15': './src/apps/packages/update/update15.js',
    '1.rebateDesc': './src/apps/packages/rebateDescription/rebateDescription.js',
    '1.logger': './src/apps/packages/logger/index.js',
  },
  port: 3002,
  commonChunks: {
    'common.1': []
  },
  entries: {
    index: {
      title: '无限娱乐',
      template: './entry/index.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.main']
    },
    // login: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.login']
    // },
    // register: {
    //   title: '无限娱乐',
    //   template: './entry/register.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.register']
    // },
    // trend: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.trend']
    // },
    // charge: {
    //   title: '充值结果',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.charge']
    // },
    // mmc: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '4.base', '1.mmc']
    // },
    // merchants: {
    //   title: '无限娱乐',
    //   template: './entry/merchants.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.merchants']
    // },
    // resetPassword: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.resetPassword']
    // },
    // updateUserInfo: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.updateUserInfo']
    // },
    // 404: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '4.base', '1.404']
    // },
    // changeUrl: {
    //   title: '线路检测',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.changeUrl']
    // },
    //
    // leaflets: {
    //   title: '宣传页',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.leaflets']
    // },
    // //client: {
    // //  title: '无限娱乐 - 客户端下载',
    // //  template: './entry/package.html',
    // //  chunks: ['common.1', '4.base', '1.client']
    // //},
    // download: {
    //   title: '无限娱乐 - 客户端下载',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '4.base', '1.download']
    // },
    // dragonAndTiger: {
    //   title: '无限娱乐 - 龙虎彩',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '4.base', '1.dragonAndTiger']
    // },
    // oneYear: {
    //   title: '无限娱乐周年庆',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.oneYear']
    // },
    // oneYear: {
    //   title: '无限娱乐周年庆',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.oneYear']
    // },
    // vip: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.vip']
    // },
    // expedition: {
    //   title: '无限娱乐 携手共进 远征星辰',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.expedition']
    // },
    // newDownload: {
    //   title: '无限娱乐 - 客户端下载',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '4.base', '1.newDownload']
    // },
    // integration: {
    //   title: '无限娱乐 - integration',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '4.base', '1.integration']
    // },
    // binding: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '4.base', '1.binding']
    // },
    // regist: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.regist']
    // },
    // update: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.update15']
    // },
    // rebateDesc: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common.1', '2.vendor', '4.base', '1.rebateDesc']
    // },
    // logger: {
    //   title: '无限在线娱乐',
    //   template: './src/apps/packages/logger/index.html',
    //   chunks: ['common.1', '1.logger']
    // },
  },
  output: {
    path: 'main',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'packages': 'apps/packages',
      'com': 'apps/components',
      'uiCom': 'apps/uiComponents',
      'widgets': 'apps/widgets',

      'skeleton': 'apps/main/skeleton',
      'dashboard': 'apps/main/dashboard',
      'userCenter': 'apps/main/userCenter',
      'vipCenter': 'apps/main/vipCenter',
      'agencyCenter': 'apps/main/agencyCenter',
      'fundCenter': 'apps/main/fundCenter',
      'accountCenter': 'apps/main/accountCenter',
      'activeCenter': 'apps/main/activeCenter',
      'realCenter': 'apps/main/realCenter',
      'slotCenter': 'apps/main/slotCenter',
      'fishCenter': 'apps/main/fishCenter',
      'sportCenter': 'apps/main/sportCenter',
      'bettingCenter': 'apps/main/bettingCenter',
      'newsCenter': 'apps/main/newsCenter',
      'dynamicCenter': 'apps/main/dynamicCenter',
      'helpCenter': 'apps/main/helpCenter',
      'gameCenter': 'apps/main/gameCenter',
      'mallCenter': 'apps/main/mallCenter',

      'snap': 'Snap.svg/dist/snap.svg',
      'bootstrap': 'vendor/scripts/bootstrap',
      'modernizr': 'vendor/scripts/modernizr',
      'vue': 'vue/dist/vue.js'
    }
  },
  providePlugin: {
    'Vue': 'vue',
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
    /html/,
    /path.join(__dirname, 'node_modules')/
  ]
};
