

const MallCenterController = require('mallCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new MallCenterController(), {
    ma: 'mallCenter',
    mad: 'instruction', // 积分等级说明
  })
}
