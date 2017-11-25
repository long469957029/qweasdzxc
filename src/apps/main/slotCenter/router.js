

const SlotCenterController = require('slotCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new SlotCenterController(), {
    sc: 'slotCenter',
  })
}
