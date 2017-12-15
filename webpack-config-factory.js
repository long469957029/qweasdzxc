var _ = require('underscore');
var path = require('path');
var webpack = require('webpack');

// var pxtorem = require('postcss-pxtorem');

var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = function(options) {
  var appConfig = options.appConfig;

  //==============entry================
  var entry = appConfig.entry;
  // var entry = _(appConfig.entry).reduce(function(entries, entryInfo, entryName) {
  //   var entry = entryInfo.entry;
  //   // if (entryInfo.hot && options.debug) {
  //   //   entry = [
  //   //     'webpack-dev-server/client?http://localhost:' + appConfig.port,
  //   //     'webpack/hot/only-dev-server'
  //   //   ].concat(entry);
  //   // }
  //
  //   entries[entryName] = entry;
  //
  //   return entries;
  // }, {});

  //==============output================
  var output = {
    path: path.join(__dirname, 'dist/' + appConfig.output.path)
  };

  if (options.debug) {

    output.publicPath = 'http://localhost:' + appConfig.port + appConfig.output.publicPath;
    output.filename = '[name].bundle.js';
    output.chunkFilename = '[name].bundle.js';
  } else {
    //临时解决绝对路径在线上无法找到css中下级资源的问题
    output.publicPath = '.' + appConfig.output.publicPath;
    output.filename = '[name].[hash].bundle.js';
    output.chunkFilename = '[name].[hash].bundle.js';
  }

  //==============resolve================
  const resolve = {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
    extensions: ['.js', '.vue', '.scss', 'html'],
    alias: appConfig.resolve.alias
  };

  //==============plugins================
  var plugins = [
    // new webpack.ResolverPlugin(
    //   new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    // ),
    new webpack.DefinePlugin({
      DEBUG: Boolean(options.debug),
    }),
    new webpack.ProvidePlugin(appConfig.providePlugin),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /zh-cn/),
  ];

  if (options.debug) {
    //plugins.push(new CommonsChunkPlugin('vendor.js', appConfig.commonChunks));
    _(appConfig.commonChunks).each(function(commonChunk, name) {
      plugins.push(new CommonsChunkPlugin({
        name: name,
        filename: name + '.js',
        //filename: name + '.js',
        chunks: _(commonChunk).isEmpty() ? Infinity: commonChunk
      }));
    });
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    _(appConfig.commonChunks).each(function(commonChunk, name) {
      plugins.push(new CommonsChunkPlugin({
        name: name,
        filename: name + '.[hash].js',
        chunks: _(commonChunk).isEmpty() ? Infinity: commonChunk
      }));
    });
    //plugins.push(new CommonsChunkPlugin('vendor.[hash].js', appConfig.commonChunks));
    plugins.push(new ExtractTextPlugin('[name].[hash].styles.css'));
    plugins.push(new AssetsPlugin());
  }

  // 生成静态入口html，插件存在bug，无法根据chunks的顺序插入，而是按照了entry的id的顺序，不可控
  // 暂时用数字标明顺序
  _(appConfig.entries).each(function(entryInfo, entryName) {
    plugins.push(new HtmlWebpackPlugin({
      title: entryInfo.title,
      filename: entryName + '.html',
      template: entryInfo.template,
      chunks: entryInfo.chunks,
      inject: 'body',
      favicon: entryInfo.favicon,
      resources : entryInfo.resources
    }));
  });

  //==============module================
  const module = {
    noParse: appConfig.noParse,
    rules: [
      {
        test: /\.jpg$/,
        use: ['url-loader?limit=1024']
      },
      {
        test: /\.gif$/,
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
      {
        test: /snap/,
        use: 'imports-loader?this=>window,fix=>module.exports=0'
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              js: 'babel-loader'
            },
            presets: ['@babel/preset-env']
          }
        },
        include: [path.join(__dirname, 'src')]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env']
          }
        },
        include: [path.join(__dirname, 'src')]
      },
    ]
  };

  if (options.debug) {
    module.rules.push({
      test:   /\.scss$/,
      use: ['style-loader', 'css-loader?sourceMap', 'postcss?pack=rem', 'sass'],
      include: [path.join(__dirname, 'src/apps/packages/merchants')]
    });

    module.rules.push({
      test:   /\.scss$/,
      use: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader'],
      include: [path.join(__dirname, 'src')],
      exclude: [path.join(__dirname, 'src/apps/packages/merchants')]
    });

    module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    });

  } else {

    module.rules.push({
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ['css-loader', 'postcss-loader', 'sass-loader']
      }),
      include: [path.join(__dirname, 'src')],
    });

    // module.rules.push({
    //   test:   /\.scss$/,
    //   use: ExtractTextPlugin.extract({
    //     fallback: "style-loader",
    //     use: ['css-loader', 'postcss-loader?pack=rem', 'sass-loader']
    //   }),
    //   include: [path.join(__dirname, 'src/apps/packages/merchants')]
    // });

    module.rules.push({
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ['css-loader', 'postcss-loader']
      })
    });
  }

  return {
    devtool: options.devtool ? options.devtool : false,
    entry: entry,
    output: output,
    externals: {
    //require("jquery") 是引用自外部模块的
    //对应全局变量 jQuery
    '$': 'jQuery'
    },
    resolve: resolve,
    plugins: plugins,
    module: module,
    //     ]
    //   };
    // },
    devServer: {
      port: appConfig.port
    }
  };
};

