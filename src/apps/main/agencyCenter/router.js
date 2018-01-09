

require('./misc/index.scss')
const FundCenterController = require('agencyCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new FundCenterController(), {
    'ac/llm': 'lowLevelManage', // 下级管理
    // 'ac/llm/rebate/:userId': 'rebateManage', // 升点(返点)管理

    'ac/llm/detail/:userId': 'lowLevelDetail', // 下级管理详情

    'ac/llm/message/:userId': 'sendMessage', // 发消息
    'ac/tr/:userId': 'transfer', // 转账
    'ac/oam': 'openAccountManage', // 开户

    'ac/tbr': 'teamBettingRecord', // 团队投注记录-ticket
    // 'ac/gbr': 'gameBettingRecord', // 团队投注记录-game

    'ac/oam/pd/:ticket': 'openAccountManagePrice',
    'ac/rm': 'reportManage', // 报表查询
    // 'ac/rm/betting/:userId': 'bettingRecords4Report', // 账变
    'ac/td': 'teamDynamic',

    'ac/spl': 'profitAndLoss', // 盈亏报表--total
    'ac/pl': 'ticketProfitAndLoss', // 盈亏报表--ticket
    'ac/gpl': 'gameProfitAndLoss', // 盈亏报表--game


    // 'ac/betting/:userId': 'bettingRecords', // 投注
    // 'ac/track/:userId': 'trackRecords', // 追号
    // 'ac/account/:userId': 'accountDetail', // 账变
    // 'ac/betting/:userId/detail/:betId': 'bettingDetail', // 投注详情
    // 'ac/track/:userId/detail/:tradeNo': 'trackDetail', // 追号详情


    'ac/rp': 'redPacket', // 红包查询

    'ac/reb': 'rebateReport', // 返点查询
    'ac/div': 'dividendReport', // 分红查询

    'ac/dm': 'dividendManage', // 分红管理
    'ac/ld': 'directAgentGrant', // 下级分红发放
    'ac/lg': 'lowLevelGrant', // 下级分红发放
    'ac/sum': 'signUserManage', // 签约用户管理
    'ac/su': 'signUser', // 签约用户
    'ac/am': 'agreementManagement', // 签约信息管理，查看，签约，修改


    'ac/tad': 'teamAccountDetail', // 账变
    'ac/to': 'teamOverview', // 账变
    'ac/tr': 'transfer', // 资金管理-转账

  })
}
