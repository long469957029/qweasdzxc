let _ = require('underscore');
let path = require('path');
let webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
let AssetsPlugin = require('assets-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')


module.exports = function(options) {
  var appConfig = options.appConfig;

  //==============entry================
  var entry = _(appConfig.entry).reduce(function(entries, entry, entryName) {
    if (options.debug) {
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

  if (options.debug) {

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

  //==============resolve================
  const resolve = {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
    extensions: ['.js', '.vue', 'scss', 'html'],
    alias: appConfig.resolve.alias
  };

  //==============plugins================
  let plugins = [
    // new webpack.ResolverPlugin(
    //   new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    // ),
    new webpack.DefinePlugin({
      DEBUG: Boolean(options.debug),
    }),
    new webpack.ProvidePlugin(appConfig.providePlugin),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /zh-cn/),

  ];

  if (process.env.NODE_ENV === 'analyse') {
    plugins.push(new BundleAnalyzerPlugin())
  }

  plugins.push(new webpack.DllReferencePlugin({
    // context: path.join(__dirname, 'src', 'vendor'),
    context: __dirname,
    // scope: 'vendorDLL',
    manifest: require('./src/dll/vendor-manifest.json'),
    extensions: ['', '.js']
  }));

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

    plugins.push(new ExtractTextPlugin('[name].[hash].styles.css'));
    plugins.push(new AssetsPlugin());
    plugins.push(new UglifyJsPlugin());
  }

  // 生成静态入口html，插件存在bug，无法根据chunks的顺序插入，而是按照了entry的id的顺序，不可控
  // 暂时用数字标明顺序
  _(appConfig.entries).each(function(entryInfo, entryName) {
    plugins.push(new HtmlWebpackPlugin({
      title: entryInfo.title,
      filename: entryName + '.html',
      template: entryInfo.template,
      chunks: entryInfo.chunks,
      chunksSortMode: 'manual',
      inject: 'body',
      favicon: entryInfo.favicon,
      resources : entryInfo.resources
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
      filepath: path.resolve('./src/dll/*.dll.js'),
      hash: true,
      includeSourcemap: false
    }
  ]));

  //==============module================
  const module = {
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
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              js: 'babel-loader',
              scss: [
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
            },
          }
        },
        include: [path.join(__dirname, 'src')]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        include: options.debug ? [path.join(__dirname, 'src')] : [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules', 'ramda')],
        exclude: /jquery|jqmeter|turn.html4/,
      },
    ]
  };

  if (options.debug) {
    module.rules.push({
      test:   /\.scss$/,
      use: [
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
      include: [path.join(__dirname, 'src')],
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
    });

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

