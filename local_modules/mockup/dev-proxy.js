

const fs = require('fs')
const gutil = require('gulp-util')
const connect = require('connect')
const url = require('url')
const connectRoute = require('connect-route')
const proxyMiddleware = require('./proxy-middleware')

const app = connect()
exports.startProxy = function(options) {
  const port = options.port
  const routeCfg = options.routeConfig || {}
  gutil.log(gutil.colors.green(`routerCfg are ${routeCfg}`))

  app.use(connectRoute((router) => {
    //= ==================Put test data here=================================//
    Object.keys(routeCfg).forEach((path) => {
      const file = routeCfg[path]
      console.log(`config routing ${path} to file ${file}`)
      router.get(path, fromFile(file))
      router.post(path, fromFile(file))
    })

    router.get('/SomeOther/*', (req, res, next) => {
      // custom reponse
      res.end('')
    })
  }))

  // app.use('/', proxyMiddleware({
  //  ua: 'android', //android|ios|chrome|ie|android_tablet
  //  urlRules: [{
  //    pattern: '*', //proxy the static resources to localhost
  //    target: 'http://localhost:8080'
  //  }]
  // }));
  app.listen(port)
}


function fromFile(testFile) {
  return function(req, res, next) {
    setInterval(() => {
      fs.readFile(testFile, {
        encoding: 'UTF-8',
      }, (err, data) => {
        if (err) {
          console.log('failed to read ', err)
        }
        res.end(data)
      })
    }, 300)
  }
}
