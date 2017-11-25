

const SportCenterController = require('sportCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new SportCenterController(), {
    sp: 'sportCenter',
  })
}
