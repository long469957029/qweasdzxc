const path = require('path');
const _ = require('underscore');
const webpack = require('webpack');

const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const CompressionPlugin = require("compression-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

//sentry sourcemap upload
const SentryCliPlugin = require('@sentry/webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({size: 5});

const serverIP = 'http://forev3.5x5x.com'

const DEV = process.env.NODE_ENV !== 'production';

const PROJECT_VERSION = require('./package.json').version

const appConfig = {
  entry: {
    main: './src/apps/main/index.js',
    login: './src/apps/packages/login-new/login.js',
    register: './src/apps/packages/register/index.js',
    base: './src/base/build.base.js',
    trend: './src/apps/packages/trend/index.js',
    change: './src/apps/packages/change/index.js',
    resetInitPwd: './src/apps/packages/resetInitPwd/index.js',
    updateUserInfo: './src/apps/packages/updateUserInfo/updateUserInfo.js',
    // 404: './src/apps/packages/404/index.js',
    logger: './src/apps/packages/logger/index.js',
    game: './src/apps/packages/game/index.js',
    game_error: './src/apps/packages/game_error/index.js',
    charge:'./src/apps/packages/charge/index.js',
    registerQuery: './src/apps/packages/registerQuery',
    wechatBet: './src/apps/packages/wechatBet'
  },
  port: 3002,
  entries: {
    index: {
      title: '无限娱乐',
      template: './entry/index.html',
      chunks: ['commons', 'base', 'main'],
    },
    login: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['commons', 'vendor', 'base', 'login'],
    },
    register: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['commons', 'base', 'register'],
    },
    trend: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['commons', 'base', 'trend'],
    },
    change: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['commons', 'base', 'change'],
    },
    resetInitPwd: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['commons', 'base', 'resetInitPwd'],
    },
    resetPassword: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['commons', 'base', 'resetPassword'],
    },
    updateUserInfo: {
      title: '无限娱乐',
      template: './entry/package.html',
      chunks: ['commons', 'base', 'updateUserInfo'],
    },
    logger: {
      title: '无限在线娱乐',
      template: './src/apps/packages/logger/index.html',
      chunks: ['commons', 'base', 'logger'],
    },
    game: {
      title: '无限娱乐',
      template: './entry/package-game.html',
      chunks: ['commons', 'base', 'game']
    },
    game_error: {
      title: '无限娱乐',
      template: './entry/package-game.html',
      chunks: ['commons', 'base', 'game_error']
    },
    charge: {
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['commons', 'base', 'charge']
    },
    registerQuery:{
      title: '无限娱乐',
      template: './entry/package-vue.html',
      chunks: ['commons','base','vendor', 'registerQuery']
    },
    wechatBet: {
      title: '微信龙虎',
      template: './entry/package-vue.html',
      chunks: ['commons','base','vendor','wechatBet']
    }
    // 404: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['commons', 'base', '404'],
    // },
    // changeUrl: {
    //   title: '线路检测',
    //   template: './entry/package.html',
    //   chunks: ['commons', 'vendor', 'base', 'changeUrl'],
    // },
    // client: {
    //  title: '无限娱乐 - 客户端下载',
    //  template: './entry/package.html',
    //  chunks: ['commons', 'base', 'client']
    // },
    // download: {
    //   title: '无限娱乐 - 客户端下载',
    //   template: './entry/package.html',
    //   chunks: ['commons', 'base', 'download'],
    // },
    // binding: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['commons', 'base', 'binding'],
    // },
    // regist: {
    //   title: '无限娱乐',
    //   template: './entry/package.html',
    //   chunks: ['commons', 'vendor', 'base', 'regist'],
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
  path: path.resolve(__dirname, 'www/' + appConfig.output.path),
  publicPath: appConfig.output.publicPath
};

if (DEV) {
  // output.publicPath = 'http://localhost:' + appConfig.port + appConfig.output.publicPath;
  output.filename = '[name].bundle.js';
  output.chunkFilename = '[name].bundle.js';
} else {
  output.filename = '[name].[hash].bundle.js';
  output.chunkFilename = '[name].[hash].bundle.js';
  // output.sourceMapFilename = '[name].[hash].js.map';
}

//==============plugins================
let plugins = [
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
    Raven: 'raven-js',
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
  }),
  new webpack.DefinePlugin({
    'process.env': {
      ENVIRONMENT: JSON.stringify(process.env.ENVIRONMENT),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
];

if (process.env.MODE === 'analyse') {
  plugins.push(new BundleAnalyzerPlugin())
}

if (process.env.BABEL_ENV !== 'test') {
  plugins.push(new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`./src/dll/${process.env.NODE_ENV}/vendor-manifest.json`),
    extensions: ['', '.js']
  }));
}

if (DEV) {
  if (process.env.BABEL_ENV !== 'test') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
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
    // uglifyOptions: {
    //   compress: {
    //     inline: false,
    //     // warnings: false
    //   }
    // },
  }));
  plugins.push(new CompressionPlugin())

  plugins.push(new SentryCliPlugin({
    release: PROJECT_VERSION,
    include: './www/main',
    ignoreFile: '.sentrycliignore',
    ignore: ['node_modules', 'webpack.config.js'],
  }))
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
    filepath: path.resolve(`./src/dll/${process.env.NODE_ENV}/*.styles.css`),
    typeOfAsset: 'css',
    hash: true,
    includeSourcemap: false
  },
  {
    filepath: path.resolve(`./src/dll/${process.env.NODE_ENV}/*.js`),
    hash: true,
    includeSourcemap: true
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
        path.resolve(__dirname, 'src/apps')
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
      include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')]
    },
    {
      test: /\.js$/,
      type: 'javascript/auto',
      // use: ['babel-loader'],
      use: 'happypack/loader?id=js',
      include: DEV ? [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')] :
        [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test'), path.resolve(__dirname, 'node_modules', 'ramda')],
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
    include: [path.resolve(__dirname, 'src')],
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
    include: [path.resolve(__dirname, 'src')],
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
  devtool: DEV ? 'eval-source-map' : 'source-map',
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
      '@': path.resolve(__dirname, 'src'),
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
  stats: 'errors-only',
  devServer: {
    port: appConfig.port,
    publicPath: appConfig.output.publicPath,
    hot: true,
    // clientLogLevel: 'error',
    historyApiFallback: true,
    inline: true,
    progress: false,
    proxy: {
      '**/*.json': {
        target: serverIP,
        changeOrigin: true,
      },
      '/acct/imgcode/code': {
        target: serverIP,
        changeOrigin: true,
      },
      '/info/imgs/': {
        target: serverIP,
        changeOrigin: true,
      },
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    headers: {'X-Custom-Header': 'yes'},
    stats: {
      assets: false,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      depth: false,
      entrypoints: true,
      hash: true,
      maxModules: 15,
      modules: false,
      performance: true,
      reasons: false,
      source: false,
      timings: true,
      version: false,
      warnings: true,
    },
    // 取消框架域名检测
    disableHostCheck: true
  }
};


