

const RealCenterController = require('realCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new RealCenterController(), {
    rc: 'realCenter',
  })
}
