const gutil = require('gulp-util')
const connect = require('connect')

const proxyMapping = {
  dev: require('./dev-proxy'),
}

module.exports = function(gulp, config) {
  const port = config.port
  const proxyRouters = config.proxyRouters

  return function() {
    proxyMapping.dev.startProxy({
      port,
      routeConfig: proxyRouters.routers,
    })
    gutil.log(gutil.colors.green(`mockup Server started on ${port} port`))
  }
}
