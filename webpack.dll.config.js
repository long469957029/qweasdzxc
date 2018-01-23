let ExtractTextPlugin = require('extract-text-webpack-plugin');
let webpack = require('webpack');
let path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  context: __dirname,
  output: {
    path: path.join(__dirname, 'src/dll'),
    filename: '[name].js',
    library: '[name]_library',
  },
  entry: {
    'vendor': [
      'vue',
      'vuex',
      'vue-router',
      'ramda',
      'underscore',
      'lodash',
      'jquery-slimscroll',
      'jquery',
      'velocity-animate',
      './src/base/build.base.dll.js',
      './src/vendor/build.core.js',
      './src/vendor/scripts/md5',
      './src/vendor/scripts/sha512',
      './src/vendor/scripts/jquery.countdown'
    ]
  },
  plugins: [
    new UglifyJsPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'src/dll', '[name]-manifest.json'),
      name: '[name]_library'
    }),
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
      types: 'mutation-types',
      StaticGrid: ['StaticGrid', 'default'],
      AnimatedInteger: ['AnimatedInteger', 'default'],
      ticketConfig: ['ticketConfig', 'default'],
      bettingTypes: 'bettingTypes',
    }),
    new ExtractTextPlugin('[name].styles.css'),
  ],

  module: {
    rules: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|swf|mp3|wav)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules', 'ramda')],
        exclude: /jquery|jqmeter|turn.html4/,
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
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
        }),
        include: [path.join(__dirname, 'src')],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'postcss-loader']
        })
      }
    ],
  },
  resolve: {
    alias: {
      packages: 'apps/packages',
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
      realCenter: 'apps/main/realCenter',
      slotCenter: 'apps/main/slotCenter',
      fishCenter: 'apps/main/fishCenter',
      sportCenter: 'apps/main/sportCenter',
      bettingCenter: 'apps/main/bettingCenter',
      newsCenter: 'apps/main/newsCenter',
      dynamicCenter: 'apps/main/dynamicCenter',
      helpCenter: 'apps/main/helpCenter',
      gameCenter: 'apps/main/gameCenter',
      mallCenter: 'apps/main/mallCenter',

      snap: 'Snap.svg/dist/snap.svg',
      bootstrap: 'vendor/scripts/bootstrap',
      modernizr: 'vendor/scripts/modernizr',
      // vue: 'vue/dist/vue.js',
      vue: 'vue/dist/vue.esm.js',

      api: 'apps/api',
      'consts': 'apps/store/consts',
      'mutation-types': 'apps/store/mutation-types',
      StaticGrid: 'com/static-grid',
      AnimatedInteger: 'com/animated-integer',
      ticketConfig: 'apps/main/skeleton/misc/ticketConfig',
      bettingTypes: 'apps/main/skeleton/misc/betting-types',

      RouterController: 'apps/main/skeleton/controllers/router',
    },
  },
}
