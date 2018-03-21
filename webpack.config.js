const _ = require('underscore');
const path = require('path');
const webpack = require('webpack');

const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const CompressionPlugin = require("compression-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

const happyThreadPool = HappyPack.ThreadPool({size: 5});

const DEV = process.env.NODE_ENV !== 'production'

const appConfig = {
  entry: {
    main: './src/apps/main/index.js',
    login: './src/apps/packages/login-new/login.js',
    register: './src/apps/packages/register/index.js',
    // vendor: './src/vendor/build.core.js',
    base: './src/base/build.base.js',
    trend: './src/apps/packages/trend/index.js',
    change: './src/apps/packages/change/index.js',
    resetInitPwd: './src/apps/packages/resetInitPwd/index.js',
    // trendOld: './src/apps/packages/trend/old/index.js',
    // resetPassword: './src/apps/packages/resetPassword/resetPassword.js',
    updateUserInfo: './src/apps/packages/updateUserInfo/updateUserInfo.js',
    // merchants: './src/apps/packages/merchants/index.js',
    // 404: './src/apps/packages/404/index.js',
    // mmc: './src/apps/packages/mmc/index.js',
    // charge: './src/apps/packages/charge/index.js',
    // changeUrl: './src/apps/packages/changeUrl/index.js',
    // leaflets: './src/apps/packages/leaflets/index.js',
    // download: './src/apps/packages/download/index.js',
    // dragonAndTiger: './src/apps/packages/dragonAndTiger/index.js',
    // oneYear: './src/apps/packages/oneYear/index.js',
    // vip: './src/apps/packages/vip/index.js',
    // expedition: './src/apps/packages/expedition/index.js',
    // newDownload: './src/apps/packages/newDownload/index.js',
    // integration: './src/apps/packages/integration/index.js',
    // binding: './src/apps/packages/binding/index.js',
    // regist: './src/apps/packages/registers/index.js',
    // update15: './src/apps/packages/update/update15.js',
    // rebateDesc: './src/apps/packages/rebateDescription/rebateDescription.js',
    logger: './src/apps/packages/logger/index.js',
    game: './src/apps/packages/game/index.js',
    game_error: './src/apps/packages/game_error/index.js'
  },
  port: 3002,
  entries: {
    index: {
      title: '无限娱乐',
      template: './entry/index.html',
      chunks: ['default', 'commons', 'base', 'main'],
    },
    login: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['default', 'commons', 'vendor', 'base', 'login'],
    },
    register: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['default', 'commons', 'base', 'register'],
    },
    trend: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['default', 'commons', 'base', 'trend'],
    },
    change: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['default', 'commons', 'base', 'change'],
    },
    resetInitPwd: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['default', 'commons', 'base', 'resetInitPwd'],
    },
    // charge: {
    //   title: '充值结果',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'charge'],
    // },
    resetPassword: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['default', 'commons', 'base', 'resetPassword'],
    },
    updateUserInfo: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['default', 'commons', 'base', 'updateUserInfo'],
    },
    logger: {
      title: '无限在线娱乐',
      template: './src/apps/packages/logger/index.html',
      chunks: ['default', 'commons', 'logger'],
    },
    game: {
      title: '无限娱乐',
      template: './entry/package-game.html',
      chunks: ['default', 'commons', 'base', 'game']
    },
    game_error: {
      title: '无限娱乐',
      template: './entry/package-game.html',
      chunks: ['default', 'commons', 'base', 'game_error']
    },
    // resetPassword: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'resetPassword'],
    // },
    // 404: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'base', '404'],
    // },
    // changeUrl: {
    //   title: '线路检测',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'changeUrl'],
    // },
    //
    // leaflets: {
    //   title: '宣传页',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'leaflets'],
    // },
    // client: {
    //  title: '无限娱乐 - 客户端下载',
    //  template: './entry/package.html',
    //  chunks: ['default', 'commons', 'base', 'client']
    // },
    // download: {
    //   title: '无限娱乐 - 客户端下载',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'base', 'download'],
    // },
    // dragonAndTiger: {
    //   title: '无限娱乐 - 龙虎彩',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'base', 'dragonAndTiger'],
    // },
    // oneYear: {
    //   title: '无限娱乐周年庆',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'oneYear'],
    // },
    // vip: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'vip'],
    // },
    // expedition: {
    //   title: '无限娱乐 携手共进 远征星辰',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'expedition'],
    // },
    // newDownload: {
    //   title: '无限娱乐 - 客户端下载',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'base', 'newDownload'],
    // },
    // integration: {
    //   title: '无限娱乐 - integration',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'base', 'integration'],
    // },
    // binding: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'base', 'binding'],
    // },
    // regist: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'regist'],
    // },
    // update: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'update15'],
    // },
    // rebateDesc: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['default', 'commons', 'vendor', 'base', 'rebateDesc'],
    // },
  },
  output: {
    path: 'main',
    publicPath: '/',
  }
};

//==============entry================
let entry = _(appConfig.entry).reduce(function (entries, entry, entryName) {
  if (DEV) {
    entry = [
      'webpack-dev-server/client?http://localhost:' + appConfig.port,
      'webpack/hot/only-dev-server'
    ].concat(entry);
  }
  entries[entryName] = entry;

  return entries;
}, {});

//==============output================
let output = {
  path: path.join(__dirname, 'dist/' + appConfig.output.path)
};

if (DEV) {
  output.publicPath = appConfig.output.publicPath;
  // output.publicPath = 'http://localhost:' + appConfig.port + appConfig.output.publicPath;
  output.filename = '[name].bundle.js';
  output.chunkFilename = '[name].bundle.js';
} else {
  //临时解决绝对路径在线上无法找到css中下级资源的问题
  output.publicPath = '.' + appConfig.output.publicPath;
  output.filename = '[name].[hash].bundle.js';
  output.chunkFilename = '[name].[hash].bundle.js';
}

//==============plugins================
let plugins = [
  // new webpack.ResolverPlugin(
  //   new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
  // ),
  new webpack.ProvidePlugin({
    Vue: ['vue/dist/vue.esm.js', 'default'],
    mapState: ['vuex', 'mapState'],
    mapGetters: ['vuex', 'mapGetters'],
    jQuery: 'jquery',
    $: 'jquery',
    'window.jQuery': 'jquery',
    bootstrap: 'bootstrap',
    _: 'underscore',
    R: 'ramda',
    slimScroll: 'jquery-slimscroll',
    Velocity: 'velocity-animate',
    RouterController: ['RouterController', 'default'],

    consts: 'consts',
    types: 'types',
    ticketConfig: ['ticketConfig', 'default'],
    bettingTypes: ['bettingTypes', 'default'],
  }),
  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /zh-cn/),

  new HappyPack({
    id: 'js',
    threadPool: happyThreadPool,
    loaders: ['babel-loader'],
  }),
  // new HappyPack({
  //   id: 'vue',
  //   threadPool: happyThreadPool,
  //   loaders: [
  //     {
  //       loader: 'vue-loader',
  //       options: {
  //         loaders: {
  //           js: 'babel-loader',
  //           scss: [
  //             'style-loader',
  //             'css-loader',
  //             'postcss-loader',
  //             'sass-loader',
  //             {
  //               loader: 'sass-resources-loader',
  //               options: {
  //                 resources: './src/base/styles/_variable.scss',
  //               },
  //             },
  //           ],
  //         },
  //       }
  //     }
  //   ]
  // }),
  new HappyPack({
    id: 'scss',
    threadPool: happyThreadPool,
    loaders: [
      'style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          resources: './src/base/styles/_variable.scss',
        },
      },
    ],
  }),
  new webpack.optimize.SplitChunksPlugin({
    chunks: 'all',
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    name: true,
    cacheGroups: {
      default: false,
      // default: {
      //   minChunks: 2,
      //   priority: -20,
      //   reuseExistingChunk: true,
      // },
      commons: {
        name: 'commons',
        chunks: 'initial',
        minChunks: 2,
        test: /[\\/]node_modules[\\/]/,
        priority: -5,
        reuseExistingChunk: true,
      },
    }
  })
];

if (process.env.NODE_ENV === 'analyse') {
  plugins.push(new BundleAnalyzerPlugin())
}

plugins.push(new webpack.DllReferencePlugin({
  context: __dirname,
  manifest: require('./src/dll/vendor-manifest.json'),
  extensions: ['', '.js']
}));

if (DEV) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  // plugins.push(new ExtractTextPlugin('[name].[hash].styles.css'));
  plugins.push(new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].[hash].styles.css",
    chunkFilename: "[id].[hash].styles.css"
  }))
  plugins.push(new CssoWebpackPlugin())

  plugins.push(new AssetsPlugin());
  plugins.push(new UglifyJsPlugin({
    sourceMap: true,
    // compress: {
    //   warnings: false
    // }
  }));
  plugins.push(new CompressionPlugin())
}

_(appConfig.entries).each(function (entryInfo, entryName) {
  plugins.push(new HtmlWebpackPlugin({
    title: entryInfo.title,
    filename: entryName + '.html',
    template: entryInfo.template,
    chunks: entryInfo.chunks,
    chunksSortMode: 'manual',
    inject: 'body',
    favicon: entryInfo.favicon,
    resources: entryInfo.resources
  }));
});

plugins.push(new AddAssetHtmlPlugin([
  {
    filepath: path.resolve('./src/dll/*.styles.css'),
    typeOfAsset: 'css',
    hash: true,
    includeSourcemap: false
  },
  {
    filepath: path.resolve('./src/dll/*.js'),
    hash: true,
    includeSourcemap: false
  }
]));

//==============modules================
const modules = {
  noParse: appConfig.noParse,
  rules: [
    {
      test: /\.(jpg|gif)$/,
      use: ['url-loader?limit=1024']
    },
    {
      test: /\.png$/,
      use: ['url-loader?limit=1024!mimetype=image/png!./file.png']
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=10000&minetype=application/font-woff'
    },
    {
      test: /\.(ttf|eot|svg|swf|mp3|wav)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'file-loader'
    },
    {
      test: /(.*)\.html$/,
      use: ['html-loader'],
      include: [
        path.join(__dirname, 'src/apps')
      ]
    },
    // {
    //   test: /snap/,
    //   use: 'imports-loader?this=>window,fix=>module.exports=0'
    // },
    {
      test: /\.vue$/,
      type: 'javascript/auto',
      use: [
        {
          loader: 'vue-loader',
          options: {
            loaders: {
              js: 'happypack/loader?id=js',
              // js: 'babel-loader',
              // scss: 'happypack/loader?id=scss',
              scss: DEV ? [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader',
                {
                  loader: 'sass-resources-loader',
                  options: {
                    resources: './src/base/styles/_variable.scss',
                  },
                },
              ] : [
                'style-loader',
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'sass-loader',
                {
                  loader: 'sass-resources-loader',
                  options: {
                    resources: './src/base/styles/_variable.scss',
                  },
                },
              ]
            },
          }
        }
      ],
      include: [path.join(__dirname, 'src')]
    },
    {
      test: /\.js$/,
      type: 'javascript/auto',
      // use: ['babel-loader'],
      use: 'happypack/loader?id=js',
      include: DEV ? [path.join(__dirname, 'src')] : [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules', 'ramda')],
      exclude: /jquery|jqmeter|turn.html4/,
    },
  ]
};

if (DEV) {
  modules.rules.push({
    test: /\.scss$/,
    use: 'happypack/loader?id=scss',
    // use: [
    //   'style-loader',
    //   'css-loader',
    //   'postcss-loader',
    //   'sass-loader',
    //   {
    //     loader: 'sass-resources-loader',
    //     options: {
    //       resources: './src/base/styles/_variable.scss',
    //     },
    //   },
    // ],
    include: [path.join(__dirname, 'src')],
  });

  modules.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
  });

} else {

  modules.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'sass-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          resources: './src/base/styles/_variable.scss',
        },
      },
    ],

    // use: ExtractTextPlugin.extract({
    //   fallback: "style-loader",
    //   use: [
    //     'css-loader',
    //     'postcss-loader',
    //     'sass-loader',
    //     {
    //       loader: 'sass-resources-loader',
    //       options: {
    //         resources: './src/base/styles/_variable.scss',
    //       },
    //     },
    //   ]
    // }),
    include: [path.join(__dirname, 'src')],
  });

  modules.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader'
    ]
  });
}

module.exports = {
  mode: DEV ? 'development' : 'production',
  devtool: DEV ? 'eval-source-map' : false,
  entry,
  output,
  externals: {
    '$': 'jQuery'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
    extensions: ['.js', '.vue', '.scss', '.html'],
    alias: {
      packages: 'apps/packages',
      build: 'apps/build.js',
      com: 'apps/components',
      uiCom: 'apps/uiComponents',
      widgets: 'apps/widgets',

      skeleton: 'apps/main/skeleton',
      dashboard: 'apps/main/dashboard',
      userCenter: 'apps/main/userCenter',
      vipCenter: 'apps/main/vipCenter',
      agencyCenter: 'apps/main/agencyCenter',
      fundCenter: 'apps/main/fundCenter',
      accountCenter: 'apps/main/accountCenter',
      activeCenter: 'apps/main/activeCenter',
      helpCenter: 'apps/main/helpCenter',
      gameCenter: 'apps/main/gameCenter',
      activity: 'apps/main/activity',

      bootstrap: 'vendor/scripts/bootstrap',
      modernizr: 'vendor/scripts/modernizr',
      vue: 'vue/dist/vue.esm.js',
      api: 'apps/api',
      filters: 'apps/filters',
      consts: 'apps/store/consts',
      types: 'apps/store/mutation-types',
      ticketConfig: 'apps/main/skeleton/misc/ticketConfig',
      bettingTypes: 'apps/main/skeleton/misc/betting-types',

      RouterController: 'apps/main/skeleton/controllers/router',
    }
  },
  plugins,
  module: modules,
  devServer: {
    port: appConfig.port
  }
};


