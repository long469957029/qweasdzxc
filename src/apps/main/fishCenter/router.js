

const FishCenterController = require('fishCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new FishCenterController(), {
    fc: 'fishCenter',
  })
}
