/**
 * Created by bill on 2018/2/12.
 * 需考虑不需要调用接口的配置优化
 */
const urlList = [
  //账户（不能:保存用户信息,查看操作银行卡，）
  '/acct/login/doauth.json',
  '/acct/userinfo/accountCenter.json',//账户安全状态
  '/acct/userinfo/userdetail.json',//用户详情
  '/acct/login/dologout.json',//登出
  //下单
  '/ticket/bethistory/userbethistory.json',
  '/ticket/bethistory/userchasehistory.json',
  '/ticket/bet/bet.json',
  '/ticket/chase/chaseinfo.json',
  '/ticket/chase/chase.json',
  '/ticket/ticketmod/ticketinfoMmc.json',//mmc玩法信息
  '/ticket/bet/betMmc.json',//mmc投注
  '/ticket/bet/virtmmc.json',//模拟开奖
  '/ticket/bet/openHistory.json',//开奖历史
  '/ticket/bet/detail.json',//投注详情
  '/ticket/chase/detail.json',//追号详情
  '/ticket/chase/cancel.json',//
  '/ticket/bet/cancel.json',//撤单
  '/ticket/chase/cancel.json',//停止追号
  'ticket/game/gameAndTicketHistory.json',//试玩右侧记录接口
  '/ticket/ticketmod/openHistoryDetail.json', // 秒秒彩遗漏走势
  '/ticket/ticketmod/trendDetail.json', // 秒秒彩遗漏走势
  //资金（不能 充值，提现，转账）
  '/fund/balance/summary.json',
  '/info/gamereport/myprofit.json',//资金总览，个人数据总览
  '/fund/balance/gametransferinfo.json',
  '/fund/balance/history.json',//帐变明细
]
module.exports = {
  get(id) {
    return _(urlList).findWhere((item)=>{
      return item === id
    })
  },
  getAll() {
    return urlList
  },
  urlList,
}
