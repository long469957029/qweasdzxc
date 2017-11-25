"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minfyCss = require('gulp-minify-css');
var path = require('path');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');

var _ = require('underscore');

var mockup = require('./local_modules/mockup/index');
var mockupConfig = require('./mockup.config');

var runSequence = require('run-sequence');

//css sprite
var spritesmith = require('gulp.spritesmith');

var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");

var argv = require('minimist')(process.argv.slice(2));

var devFactory = require('./webpack.dev.factory');
var productionFactory = require('./webpack.production.factory');

var mainConfig = require('./webpack.main.config');
var externalConfig = require('./webpack.external.config');
var zip = require('gulp-zip');

var serverIP = 'http://forehead.5x5x.com';

var packageConfig;
var projectPath;
var zipPath = [];

switch (argv.package)  {
  case 'main':
    packageConfig = mainConfig;
    projectPath = 'main';
    zipPath.push('www/main/**');
    break;
  case 'external':
    packageConfig = externalConfig;
    projectPath = 'external';
    zipPath.push('www/external/**');
    break;
  case 'all':
    zipPath.push('www/main/*','www/external/**');
    break;
  default :
    packageConfig = mainConfig;
    projectPath = 'main';
    zipPath.push('www/main/**');
    break;
}

if (argv.env === 'uat') {
  serverIP = 'http://forehead.5x5x.com/';
}

gulp.task('server', function (callback) {
  runSequence(
    ['server.webpack', 'server.mockup']
  );
});

// Start a webpack-dev-server
gulp.task("server.webpack", function(callback) {
  console.log(serverIP);
  var devConfig = devFactory({
    appConfig: packageConfig
  });

  var proxy = [
    {
      path: '*.json',
      target: serverIP,
      changeOrigin: true
    },
    {
      path: 'mock/*.json',
      target: 'http://localhost:7070/'
    },
    {
      path: '*',
      target: serverIP,
      changeOrigin: true
    }
  ];

  if (argv.mockup) {
    proxy = _(mockupConfig.routers).map(function(val, path) {
      return {
        path: path,
        target: 'http://localhost:7070/'
      };
    }).concat(proxy);
  }

  new WebpackDevServer(webpack(devConfig), {
    publicPath: devConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: proxy,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    headers: {'X-Custom-Header': 'yes'},
    stats: {
      colors: true
    }
  }).listen(devConfig.port, 'localhost', function(err, result) {
      if (err) {
        console.log(err);
      }

      console.log('Listening at localhost:' + devConfig.port);
    });

});

//启动mockup服务器
gulp.task('server.mockup', function(callback) {
  if (argv.mockup) {
    mockup(gulp, {
      port: 7070,
      proxyRouters: mockupConfig
    })();
  } else {
    console.log("mockup server doesn't running");
    callback();
  }
});

gulp.task('release', function(callback) {
  runSequence(
    'release.clean',
    'release.build',
    ['release.js', 'release.css', 'release.assets', 'release.html', 'release.compatible'],
    'zip',
    callback
  );
});

gulp.task("webpack", function(callback) {
  var productionConfig = productionFactory({
    appConfig: packageConfig
  });

  webpack(productionConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));

    gulp.pipe(stats.toJson())
      .dest('./stats.json');

    callback();
  });
});

gulp.task('image.min', function() {
  del('./minImages');
  gulp.src('./src/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({
        //quality: '70-80'
      })]
    })))
    .pipe(gulp.dest('./src/'));
});

gulp.task('image.merchants', function() {
  del('./minImages');
  gulp.src('./src/apps/packages/merchants/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('./src/apps/packages/merchants/'));
});

gulp.task('build.sprite', function(callback) {
  var spriteData =
    gulp.src(['./src/base/images/sprites/*.png', './src/base/images/sprites/*/*'])
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        cssFormat: 'scss',
        imgPath: '~base/images/sprite.png',
        algorithm: 'binary-tree',
        cssVarMap: function(sprite) {
          sprite.name = 'sfa-' + sprite.name;
        }
      }));

  var imgStream = spriteData.img
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({
        quality: '70-80'
      })]
    }))
    .pipe(gulp.dest('./src/base/images'));
  spriteData.css.pipe(gulp.dest('./src/base/styles'));
  //老虎机雪碧图相关scss文件生成后需要修改变量名及方法名，因此其他常规sprites文件夹下的图片合成雪碧图时，先注释以下内容，
  // //begin MG老虎机专用雪碧图
  // var spriteDataMG =
  //   gulp.src(['./src/base/images/spritesMG/*.png', './src/base/images/spritesMG/*/*'])
  //     .pipe(spritesmith({
  //       imgName: 'spriteMG.png',
  //       cssName: '_spriteMG.scss',
  //       cssFormat: 'scss',
  //       imgPath: '~base/images/spriteMG.png',
  //       algorithm: 'binary-tree',
  //       cssVarMap: function(sprite) {
  //         sprite.name = 'sfa-' + sprite.name;
  //       }
  //     }));
  //
  // var imgStreamMG = spriteDataMG.img
  //   .pipe(imagemin({
  //     progressive: true,
  //     svgoPlugins: [{removeViewBox: false}],
  //     // use: [pngquant({
  //     //   quality: '60-80'
  //     // })]
  //   }))
  //   .pipe(gulp.dest('./src/base/images'));
  // spriteDataMG.css.pipe(gulp.dest('./src/base/styles'));
  // //end  MG老虎机专用雪碧图
  // //begin PT老虎机专用雪碧图
  // var spriteDataPT =
  //   gulp.src(['./src/base/images/spritesPT/*.png', './src/base/images/spritesPT/*/*'])
  //     .pipe(spritesmith({
  //       imgName: 'spritePT.png',
  //       cssName: '_spritePT.scss',
  //       cssFormat: 'scss',
  //       imgPath: '~base/images/spritePT.png',
  //       algorithm: 'binary-tree',
  //       cssVarMap: function(sprite) {
  //         sprite.name = 'sfa-' + sprite.name;
  //       }
  //     }));
  //
  // var imgStreamPT = spriteDataPT.img
  //   .pipe(imagemin({
  //     progressive: true,
  //     svgoPlugins: [{removeViewBox: false}],
  //     // use: [pngquant({
  //     //   quality: '60-80'
  //     // })]
  //   }))
  //   .pipe(gulp.dest('./src/base/images'));
  // spriteDataPT.css.pipe(gulp.dest('./src/base/styles'));
  // //end  PT老虎机专用雪碧图
  callback();
});

//清理dist
gulp.task('release.clean', function(callback) {
  del.sync([
    './dist/' + projectPath + '/*',
    './www/' + projectPath + '/*'
  ]);
  callback();
});

//编译生产版本
gulp.task("release.build", function(callback) {
  del('./dist/' + projectPath + '/*');

  var productionConfig = productionFactory({
    appConfig: packageConfig
  });

  webpack(productionConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

//压缩转移js
gulp.task('release.js', function(cb) {
  // function createErrorHandler(name) {
  //   return function (err) {
  //     console.error('Error from ' + name + ' in compress task', err.toString());
  //   };
  // }
  return gulp.src(['./dist/' + projectPath + '/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)));
  // pump([
  //   gulp.src(['./dist/' + projectPath + '/*.js']),
  //   uglify(),
  //   gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)),
  //   cb
  // ]);
});

//压缩转移css
gulp.task('release.css', function() {
  return gulp.src(['./dist/' + projectPath + '/*.css'])
    .pipe(minfyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)));
});

//压缩转移其它资源 assets
gulp.task('release.assets', function() {
  return gulp.src(['./dist/' + projectPath + '/*.+(jpg|png|gif|eot|woff|svg|tff|eot|woff2|swf|ico|mp3|wav)'])
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)));
    //.pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath + '/' + packageConfig.output.publicPath)));
});

//压缩转移兼容性文件
gulp.task('release.compatible', function() {
  return gulp.src([
    './bower_components/es5-shim/es5-sham.min.js',
    './bower_components/es5-shim/es5-shim.min.js',
    './bower_components/json2/json2.js'
  ])
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./www/' + packageConfig.output.path + '/compatible'));
});

//压缩转移css
gulp.task('release.html', function() {
  return gulp.src(['./dist/' + projectPath + '/*.html'])
    .pipe(gulp.dest(path.join('./www/' + packageConfig.output.path + '/')));
});

//打压缩包，默认打www/main程序包，gulp zip --package=external，打external文件夹下的压缩包，gulp zip --package=all，将mian和external两个文件夹下的所有文件一起打包
gulp.task('zip', function() {
  return gulp.src(zipPath)
    .pipe(zip('forehead_wx.zip'))
    .pipe(gulp.dest('www'));
});
