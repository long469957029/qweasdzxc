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
    }

    // 0是代理，1是玩家，玩家不显示平台转账
    if (acctInfo.userType === 1) {
      delete fundRouter['fc/pt']
    }

    window.Global.appRouter.processAppRoutes(new FundCenterController(), fundRouter)
  }
})
