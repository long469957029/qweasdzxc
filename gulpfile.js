

const gulp = require('gulp')
const gutil = require('gulp-util')
const uglify = require('gulp-uglify')
// const concat = require('gulp-concat')
const minfyCss = require('gulp-minify-css')
const path = require('path')
const del = require('del')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const cache = require('gulp-cache')

const _ = require('underscore')

const mockup = require('./local_modules/mockup/index')
const mockupConfig = require('./mockup.config')

const runSequence = require('run-sequence')

// css sprite
const spritesmith = require('gulp.spritesmith')

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const argv = require('minimist')(process.argv.slice(2))

const devFactory = require('./webpack.dev.factory')
const productionFactory = require('./webpack.production.factory')

const mainConfig = require('./webpack.main.config')
const externalConfig = require('./webpack.external.config')
const Fontmin = require('fontmin')
const zip = require('gulp-zip')
const svgo = require('imagemin-svgo')
const fs = require('fs')
const rename = require('gulp-rename')
const fontConfig = require('./font-config.json')

let serverIP = 'http://forehead.5x5x.com'

let packageConfig
let projectPath
const zipPath = []

switch (argv.package) {
  case 'main':
    packageConfig = mainConfig
    projectPath = 'main'
    zipPath.push('www/main/**')
    break
  case 'external':
    packageConfig = externalConfig
    projectPath = 'external'
    zipPath.push('www/external/**')
    break
  case 'all':
    zipPath.push('www/main/*', 'www/external/**')
    break
  default:
    packageConfig = mainConfig
    projectPath = 'main'
    zipPath.push('www/main/**')
    break
}

if (argv.env === 'uat') {
  serverIP = 'http://forehead.5x5x.com/'
}

gulp.task('server', () => {
  runSequence(['server.webpack', 'server.mockup'])
})

// Start a webpack-dev-server
gulp.task('server.webpack', () => {
  console.log(serverIP)
  const devConfig = devFactory({
    appConfig: packageConfig,
  })

  let proxy = [
    {
      path: '*.json',
      target: serverIP,
      changeOrigin: true,
    },
    {
      path: 'mock/*.json',
      target: 'http://localhost:7070/',
    },
    {
      path: '*',
      target: serverIP,
      changeOrigin: true,
    },
  ]

  if (argv.mockup) {
    proxy = _(mockupConfig.routers).map((val, pathInfo) => {
      return {
        path: pathInfo,
        target: 'http://localhost:7070/',
      }
    }).concat(proxy)
  }

  new WebpackDevServer(webpack(devConfig), {
    publicPath: devConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    headers: { 'X-Custom-Header': 'yes' },
    stats: {
      colors: true,
    },
  }).listen(devConfig.port, 'localhost', (err) => {
    if (err) {
      console.log(err)
    }

    console.log(`Listening at localhost:${devConfig.port}`)
  })
})

// 启动mockup服务器
gulp.task('server.mockup', (callback) => {
  if (argv.mockup) {
    mockup(gulp, {
      port: 7070,
      proxyRouters: mockupConfig,
    })()
  } else {
    console.log("mockup server doesn't running")
    callback()
  }
})

gulp.task('release', (cb) => {
  runSequence(
    'release.clean',
    'release.build',
    ['release.js', 'release.css', 'release.assets', 'release.html', 'release.compatible'],
    'zip',
    cb
  )
})

gulp.task('webpack', (callback) => {
  const productionConfig = productionFactory({
    appConfig: packageConfig,
  })

  webpack(productionConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({
      // output options
    }))

    gulp.pipe(stats.toJson())
      .dest('./stats.json')

    callback()
  })
})

gulp.task('image.min', () => {
  del('./minImages')
  gulp.src('./src/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant({
        // quality: '70-80'
      })],
    })))
    .pipe(gulp.dest('./src/'))
})

gulp.task('image.merchants', () => {
  del('./minImages')
  gulp.src('./src/apps/packages/merchants/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
    })))
    .pipe(gulp.dest('./src/apps/packages/merchants/'))
})

gulp.task('build.sprite', (callback) => {
  const spriteData =
    gulp.src(['./src/base/images/sprites/*.png', './src/base/images/sprites/*/*'])
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        cssFormat: 'scss',
        imgPath: '~base/images/sprite.png',
        algorithm: 'binary-tree',
        cssVarMap (sprite) {
          sprite.name = `sfa-${sprite.name}`
        },
      }))

  const imgStream = spriteData.img
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant({
        quality: '70-80',
      })],
    }))
    .pipe(gulp.dest('./src/base/images'))
  spriteData.css.pipe(gulp.dest('./src/base/styles'))
  // 老虎机雪碧图相关scss文件生成后需要修改变量名及方法名，因此其他常规sprites文件夹下的图片合成雪碧图时，先注释以下内容，
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
  callback()
})

// 清理dist
gulp.task('release.clean', (callback) => {
  del.sync([
    `./dist/${projectPath}/*`,
    `./www/${projectPath}/*`,
  ])
  callback()
})

// 编译生产版本
gulp.task('release.build', (callback) => {
  del(`./dist/${projectPath}/*`)

  const productionConfig = productionFactory({
    appConfig: packageConfig,
  })

  webpack(productionConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({
      // output options
    }))
    callback()
  })
})

// 压缩转移js
gulp.task('release.js', () => {
  // function createErrorHandler(name) {
  //   return function (err) {
  //     console.error('Error from ' + name + ' in compress task', err.toString());
  //   };
  // }
  return gulp.src([`./dist/${projectPath}/*.js`])
    .pipe(uglify())
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)))
  // pump([
  //   gulp.src(['./dist/' + projectPath + '/*.js']),
  //   uglify(),
  //   gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)),
  //   cb
  // ]);
})

// 压缩转移css
gulp.task('release.css', () => {
  return gulp.src([`./dist/${projectPath}/*.css`])
    .pipe(minfyCss({
      compatibility: 'ie8',
    }))
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)))
})

// 压缩转移其它资源 assets
gulp.task('release.assets', () => {
  return gulp.src([`./dist/${projectPath}/*.+(jpg|png|gif|eot|woff|svg|tff|eot|woff2|swf|ico|mp3|wav)`])
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)))
  // .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath + '/' + packageConfig.output.publicPath)));
})

// 压缩转移兼容性文件
gulp.task('release.compatible', () => {
  return gulp.src([
    './bower_components/es5-shim/es5-sham.min.js',
    './bower_components/es5-shim/es5-shim.min.js',
    './bower_components/json2/json2.js',
  ])
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(`./www/${packageConfig.output.path}/compatible`))
})

// 压缩转移css
gulp.task('release.html', () => {
  return gulp.src([`./dist/${projectPath}/*.html`])
    .pipe(gulp.dest(path.join(`./www/${packageConfig.output.path}/`)))
})

// 打压缩包，默认打www/main程序包，gulp zip --package=external，打external文件夹下的压缩包，gulp zip --package=all，将mian和external两个文件夹下的所有文件一起打包
gulp.task('zip', () => {
  return gulp.src(zipPath)
    .pipe(zip('forehead_wx.zip'))
    .pipe(gulp.dest('www'))
})

// 字体提取格式转换，原生字体推荐ttf原生格式
gulp.task('font.min', (cb) => {
  runSequence(
    'font.minimal',
    'font.dest',
    cb
  )
})

gulp.task('font.minimal', () => {
  _(fontConfig).each((fontInfo) => {
    const fontmin = new Fontmin()
      .src(`./src/base/fonts/origins/${fontInfo.font}`)
      .use(Fontmin.glyph({
        text: fontInfo.text,
        hinting: false,
      }))

    if (_(fontInfo.targets).contains('eot')) {
      fontmin.use(Fontmin.ttf2eot())
    }

    if (_(fontInfo.targets).contains('woff')) {
      fontmin.use(Fontmin.ttf2woff({
        deflate: true, // deflate woff. default = false
      }))
    }

    if (_(fontInfo.targets).contains('svg')) {
      fontmin.use(Fontmin.ttf2svg())
    }

    fontmin.use(Fontmin.css({
      fontPath: '~base/fonts/', // location of font file
      // base64: true,           // inject base64 data:application/x-font-ttf; (gzip font with css).
      //                         default = false
      // glyph: true,            // generate class for each glyph. default = false
      // iconPrefix: 'my-icon',  // class prefix, only work when glyph is `true`. default to "icon"
      // fontFamily: 'myfont',   // custom fontFamily, default to filename or get from analysed ttf file
      asFileName: true, // rewrite fontFamily as filename force. default = false
      local: true, // boolean to add local font. default = false
    }))
      .dest('./src/base/fonts')

    fontmin.run((err, files) => {
      if (err) {
        throw err
      }
      console.log(files[0])

      // 此处有bug
      // cb()
      // => { contents: <Buffer 00 01 00 ...> }
    })
  })
})
gulp.task('font.dest', (callback) => {
  const imports = []
  _(fontConfig).each((fontInfo) => {
    gulp.src(`./src/base/fonts/${fontInfo.target}.css`)
      .pipe(rename(`${fontInfo.target}.scss`))
      .pipe(gulp.dest('./src/base/styles/fonts'))

    del([`./src/base/fonts/${fontInfo.target}.css`])
    console.log(`./src/base/fonts/${fontInfo.target}.css`)

    imports.push(`"fonts/${fontInfo.target}"`)
  })

  fs.writeFile('./src/base/styles/_fonts.scss', `@charset "UTF-8";\n@import\n${imports.join(',\n')};`, callback)
})
