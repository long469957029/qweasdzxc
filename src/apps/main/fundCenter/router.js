import FundCenterController from 'fundCenter/controller'

define((require, exports) => {
  exports.install = function() {
    const acctInfo = Global.memoryCache.get('acctInfo')

    const fundRouter = {
      'fc/fm': 'fundManage', // 资金管理
      'fc/re': 'recharge', // 资金管理-充值
      'fc/wd': 'withdrawal', // 资金管理-提现
      'fc/tr': 'transfer', // 资金管理-转账
      'fc/ad': 'accountDetails', // 账户明细--中心钱包
      'fc/rd': 'records', // 记录：充值 提现 转帐
      'fc/rb': 'rebateRecords', // 返水记录

      'fc/td': 'ticketRecordDetail', // 投注记录
      'fc/cr': 'chaseRecord',
      'fc/gr': 'gameRecord',
      // 'fc/tr/detail/:betId': 'bettingDetail', // 投注详情
      // 'fc/cr/detail/:tradeNo/id/:chaseFormId': 'trackDetail', // 追号记录
      // 'fc/cr/detail/:chaseTradeNo/detail/:tradeNo': 'trackBetDetail', // 追号投注记录
    }

    // 0是代理，1是玩家，玩家不显示平台转账
    if (acctInfo.userType === 1) {
      delete fundRouter['fc/pt']
    }

    window.Global.appRouter.processAppRoutes(new FundCenterController(), fundRouter)
  }
})
