

// require('./misc/index.scss');

const ViprCenterController = require('vipCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new ViprCenterController(), {
    'vip/home': 'vipHome',
    'vip/level': 'vipLevel',
    'vip/point': 'vipPoint',
    'vip/cash': 'vipCash',
    'vip/prize': 'vipPrize',
    'vip/credit': 'vipCredit',
    'vip/award': 'vipAward',
    'vip/festival': 'vipFestival',
    'vip/card': 'vipCard',
    'vip/rv': 'vipReturnVisit',
  })
}
