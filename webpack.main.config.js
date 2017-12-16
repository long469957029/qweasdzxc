module.exports = {
  entry: {
    'main': './src/apps/main/index.js',
    'login': './src/apps/packages/login/login.js',
    'register': './src/apps/packages/register/register.js',
    'trend': './src/apps/packages/trend/index.js',
    'resetPassword': './src/apps/packages/resetPassword/resetPassword.js',
    'updateUserInfo': './src/apps/packages/updateUserInfo/updateUserInfo.js',
    'merchants': './src/apps/packages/merchants/index.js',
    '404': './src/apps/packages/404/index.js',
    'mmc': './src/apps/packages/mmc/index.js',
    'charge': './src/apps/packages/charge/index.js',
    'changeUrl': './src/apps/packages/changeUrl/index.js',
    'leaflets': './src/apps/packages/leaflets/index.js',
    'download': './src/apps/packages/download/index.js',
    'dragonAndTiger': './src/apps/packages/dragonAndTiger/index.js',
    'base': './src/base/build.base.js',
    'vendor': './src/vendor/build.core.js',
    'oneYear': './src/apps/packages/oneYear/index.js',
    'vip': './src/apps/packages/vip/index.js',
    'expedition': './src/apps/packages/expedition/index.js',
    'newDownload': './src/apps/packages/newDownload/index.js',
    'integration': './src/apps/packages/integration/index.js',
    'binding': './src/apps/packages/binding/index.js',
    'regist': './src/apps/packages/registers/index.js',
    'update15': './src/apps/packages/update/update15.js',
    'rebateDesc': './src/apps/packages/rebateDescription/rebateDescription.js',
    'logger': './src/apps/packages/logger/index.js',
  },
  port: 3002,
  commonChunks: {
    'common': []
  },
  entries: {
    index: {
      title: '无限娱乐',
      template: './entry/index.html',
      chunks: ['common', 'vendor', 'base', 'main']
    },
    // login: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'login']
    // },
    // register: {
    //   title: '无限娱乐',
    //   template: './entry/register.html',
    //   chunks: ['common', 'vendor', 'base', 'register']
    // },
    // trend: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'trend']
    // },
    // charge: {
    //   title: '充值结果',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'charge']
    // },
    // mmc: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'base', 'mmc']
    // },
    // merchants: {
    //   title: '无限娱乐',
    //   template: './entry/merchants.html',
    //   chunks: ['common', 'vendor', 'base', 'merchants']
    // },
    // resetPassword: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'resetPassword']
    // },
    // updateUserInfo: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'updateUserInfo']
    // },
    // 404: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'base', '404']
    // },
    // changeUrl: {
    //   title: '线路检测',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'changeUrl']
    // },
    //
    // leaflets: {
    //   title: '宣传页',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'leaflets']
    // },
    // //client: {
    // //  title: '无限娱乐 - 客户端下载',
    // //  template: './entry/package.html',
    // //  chunks: ['common', 'base', 'client']
    // //},
    // download: {
    //   title: '无限娱乐 - 客户端下载',
    //   template: './entry/package.html',
    //   chunks: ['common', 'base', 'download']
    // },
    // dragonAndTiger: {
    //   title: '无限娱乐 - 龙虎彩',
    //   template: './entry/package.html',
    //   chunks: ['common', 'base', 'dragonAndTiger']
    // },
    // oneYear: {
    //   title: '无限娱乐周年庆',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'oneYear']
    // },
    // oneYear: {
    //   title: '无限娱乐周年庆',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'oneYear']
    // },
    // vip: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'vip']
    // },
    // expedition: {
    //   title: '无限娱乐 携手共进 远征星辰',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'expedition']
    // },
    // newDownload: {
    //   title: '无限娱乐 - 客户端下载',
    //   template: './entry/package.html',
    //   chunks: ['common', 'base', 'newDownload']
    // },
    // integration: {
    //   title: '无限娱乐 - integration',
    //   template: './entry/package.html',
    //   chunks: ['common', 'base', 'integration']
    // },
    // binding: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'base', 'binding']
    // },
    // regist: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'regist']
    // },
    // update: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'update15']
    // },
    // rebateDesc: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['common', 'vendor', 'base', 'rebateDesc']
    // },
    // logger: {
    //   title: '无限在线娱乐',
    //   template: './src/apps/packages/logger/index.html',
    //   chunks: ['common', 'logger']
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
    'R': 'rambda',
    'slimScroll': 'jquery-slimscroll'
  },
  // noParse: /lodash|underscore.string|underscore|backbone|es5|^jquery$|moment|echarts|base\/scripts|html/

};
