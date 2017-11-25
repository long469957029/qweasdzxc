

require('./misc/index.scss')

const UserCenterController = require('userCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new UserCenterController(), {
    'gc/tr/detail/:betId': 'bettingDetail', // 投注详情

    'gc/cr/detail/:tradeNo/id/:chaseFormId': 'trackDetail', // 追号记录
    'gc/cr/detail/:chaseTradeNo/detail/:tradeNo': 'trackBetDetail', // 追号投注记录

    'uc/pm': 'personalManage',
    'uc/cm': 'cardManage', // 银行卡管理
    'uc/cm/bind': 'cardBinding', // 银行卡绑定
    'uc/pd': 'priceDetails', // 奖金详情
  })
}
