/**
 *
 * @type {*|Gulp}
 */
const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const del = require('del')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const cache = require('gulp-cache')
const pump = require('pump')
const minimist = require('minimist')
const buffer = require('vinyl-buffer');

const _ = require('underscore')

const mockup = require('./local_modules/mockup/index')
const mockupConfig = require('./mockup.config')

const runSequence = require('run-sequence')

// css sprite
const spritesmith = require('gulp.spritesmith')

svgSprite = require('gulp-svg-sprite');

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const argv = minimist(process.argv.slice(2))

const webpackConfig = require('./webpack.config')
const Fontmin = require('fontmin')
const zip = require('gulp-zip')
const fs = require('fs')
const rename = require('gulp-rename')
const fontConfig = require('./font-config.json')

const dllConfig = require('./webpack.dll.config');

let serverIP = 'http://forev3.5x5x.com'

let packageConfig
let projectPath
const zipPath = []

switch (argv.package) {
  case 'main':
    packageConfig = webpackConfig
    projectPath = 'main'
    zipPath.push('www/main/**')
    break
  case 'all':
    zipPath.push('www/main/*')
    break
  default:
    packageConfig = webpackConfig
    projectPath = 'main'
    zipPath.push('www/main/**')
    break
}

gulp.task('server', () => {
  runSequence(['server.webpack', 'server.mockup'])
})

// Start a webpack-dev-server
gulp.task('server.webpack', () => {
  // let proxy = [
  //   {
  //     path: '*.json',
  //     target: serverIP,
  //     changeOrigin: true,
  //   },
  //   {
  //     path: 'mock/*.json',
  //     target: 'http://localhost:7070/',
  //   },
  //   {
  //     path: '*',
  //     target: serverIP,
  //     changeOrigin: true,
  //   },
  // ]

  let proxy = {}

  if (argv.mockup) {
    _(mockupConfig.routers).each((json, pathInfo) => {
      proxy[pathInfo] = {
        target: 'http://localhost:7070/',
        path: json
      }
      // return {
      //   path: pathInfo,
      // }
    })
  }

  Object.assign(proxy, {
    // context: ['*.json', '**.json', '**/**.json', '/**/**.json'],
    // target: serverIP,
    '**/*.json': {
      target: serverIP,
      changeOrigin: true,
    },
    'mock/*.json': {
      target: 'http://localhost:7070/',
    },
    '/acct/imgcode/code': {
      target: serverIP,
      changeOrigin: true,
    },
    '/info/imgs/': {
      target: serverIP,
      changeOrigin: true,
    },
    // '*.jsonp': {
    //   target: serverIP,
    //   changeOrigin: true,
    // },
    // '*': {
    //   target: `http:localhost${devConfig.devServer.port}`,
    //   changeOrigin: true,
    // },
  })

  new WebpackDevServer(webpack(packageConfig), {
    publicPath: packageConfig.output.publicPath,
    hot: true,
    clientLogLevel: 'error',
    historyApiFallback: true,
    // inline: true,
    progress: false,
    proxy,
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
      hash: false,
      maxModules: 15,
      modules: false,
      performance: true,
      reasons: false,
      // source: false,
      timings: true,
      // version: false,
      warnings: true,
    },
    // 取消框架域名检测
    disableHostCheck: true
  }).listen(packageConfig.devServer.port, 'localhost', (err) => {
    if (err) {
      console.log(err)
    }

    console.log(`Listening at localhost:${packageConfig.devServer.port}`)
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
    ['release.js', 'release.css', 'release.assets', 'release.html'],
    // 'cp.vendor',
    'zip',
    cb
  )
})

gulp.task('webpack', (callback) => {

  webpack(packageConfig, (err, stats) => {
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
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({
        // quality: '70-80'
      })],
    })))
    .pipe(gulp.dest('./src/'))
})

// gulp.task('image.merchants', () => {
//   del('./minImages')
//   gulp.src('./src/apps/packages/merchants/**/*.{png,jpg,gif,ico}')
//     .pipe(cache(imagemin({
//       progressive: true,
//       svgoPlugins: [{ removeViewBox: false }],
//       use: [pngquant()],
//     })))
//     .pipe(gulp.dest('./src/apps/packages/merchants/'))
// })

gulp.task('build.sprite', (callback) => {
  const spriteConfig = require('./sprites-config')

  const args = minimist(process.argv.slice(1));

  const spriteTarget = args.target

  const total = spriteConfig.length
  let finished = 0
  // process.exit()

  _(spriteConfig).each((info) => {


    if (spriteTarget !== 'all' && info.name !== spriteTarget) {
      finished += 1
      return
    }
    const spriteData =
      gulp.src([`./src/base/images/${info.name}/*.png`, `./src/base/images/${info.name}/*/*`])
        .pipe(spritesmith({
          imgName: `${info.name}.png`,
          cssName: `_${info.name}.scss`,
          cssFormat: 'scss',
          imgPath: `~base/images/${info.name}.png`,
          imgOpts: {quality: 75},
          algorithm: 'binary-tree',
          cssSpritesheetName: info.name,
          cssVarMap(sprite) {
            sprite.name = `sfa-${sprite.name}`
          },
        }))

    const imgStream = spriteData.img
      .pipe(buffer())
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 5}),
      ]))
      .pipe(gulp.dest('./src/base/images'))
    spriteData.css
      .pipe(gulp.dest('./src/base/styles'))

    finished += 1
    if (finished === total) {
      callback()
    }
  })
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

  webpack(packageConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({
      // output options
    }))
    callback()
  })
})


gulp.task('cp.vendor', (cb) => {
  return pump([
    gulp.src([`./src/dll/*.+(gz)`]),
    gulp.dest(path.join('./www/', projectPath))
  ], cb)
})
// 压缩转移js
gulp.task('release.js', (cb) => {
  return pump([
    gulp.src([`./dist/${projectPath}/*.js`]),
    gulp.dest(path.join('./www/', projectPath))
  ], cb)
})

// 压缩转移css
gulp.task('release.css', () => {
  return gulp.src([`./dist/${projectPath}/*.css`])
    // .pipe(csso())
    .pipe(gulp.dest(path.join('./www/', projectPath)))
})

// 压缩转移其它资源 assets
gulp.task('release.assets', () => {
  return gulp.src([`./dist/${projectPath}/*.+(jpg|png|gif|eot|woff|svg|tff|eot|woff2|swf|ico|mp3|wav)`])
    .pipe(gulp.dest(path.join('./www/', projectPath)))
  // .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath + '/' + packageConfig.output.publicPath)));
})

// 转移html
gulp.task('release.html', () => {
  return gulp.src([`./dist/${projectPath}/*.html`])
    .pipe(gulp.dest(path.join('./www/', projectPath)))
})

// 打压缩包，默认打www/main程序包，gulp zip --package=external，打external文件夹下的压缩包，gulp zip --package=all，将mian和external两个文件夹下的所有文件一起打包
gulp.task('zip', () => {
  return gulp.src(zipPath)
    .pipe(zip('forehead_wx_v3.zip'))
    .pipe(gulp.dest('www'))
})

//编译dll
gulp.task('dll:prepare', function (callback) {
  del('./src/dist/dll/*');
  global.DLL = 1;

  webpack(dllConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});


// 字体提取格式转换，原生字体推荐ttf原生格式
gulp.task('font.min', (cb) => {
  runSequence(
    'font.minimal',
    'font.dest',
    cb
  )
})

gulp.task('font.minimal', (cb) => {
  const total = fontConfig.length
  let finished = 0
  _(fontConfig).each((fontInfo) => {
    const fontmin = new Fontmin()
      .src(`./src/base/fonts/origins/${fontInfo.font}`)
      .use(Fontmin.glyph({
        text: fontInfo.text,
        hinting: false,
      }))
    if (fontInfo.font.indexOf('otf') > -1) {
      fontmin.use(Fontmin.otf2ttf())
    }
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
      finished += 1
      console.log(files[0])

      // 此处有bug
      if (finished === total) {
        cb()
      }
      // cb()
      // => { contents: <Buffer 00 01 00 ...> }
    })
  })
})

gulp.task('build:svg', (callback) => {
  gulp.src('./src/base/svgs/*.svg')
    .pipe(svgSprite({
      // shape: {
      //   dimension: {			// Set maximum dimensions
      //     maxWidth: 32,
      //     maxHeight: 32
      //   },
      //   spacing: {			// Add padding
      //     padding: 10
      //   },
      //   dest: 'intermediate-svg'	// Keep the intermediate files
      // },
      mode: {
        view: {			// Activate the «view» mode
          bust: false,
          render: {
            scss: true		// Activate Scss output (with default options)
          }
        },
        symbol: true		// Activate the «symbol» mode
      }
    }))
    .pipe(gulp.dest('./src/base/out'))
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
