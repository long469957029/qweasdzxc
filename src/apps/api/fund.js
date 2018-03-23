/**
 * Created by steven on 2018/1/28.
 */
export default {
  // 获取用户是否设置银行卡及资金密码
  userSecurityInfo (then) {
    return $http({
      url: '/fund/withdraw/info.json',
    })
      .then(then)
  },
  // 获取充值提现记录
  userFundInfo (then) {
    return $http({
      url: '/fund/balance/summary.json',
    })
      .then(then)
  },
  // 个人充值提现
  userRechargeWithdrawInfo({startTime,endTime},then) {
    return $http({
      url: '/info/gamereport/myrecharge.json',
      data: {
        startTime,
        endTime,
      },
    })
      .then(then)
  },
  // 个人数据
  userProfitInfo({startTime,endTime},then) {
    return $http({
      url: '/info/gamereport/myprofit.json',
      data: {
        startTime,
        endTime,
      },
    })
      .then(then)
  },
  // 平台转账信息
  userProfitInfo({channelId},then) {
    return $http({
      url: '/fund/balance/gametransferinfo.json',
      data: {
        channelId,
      },
    })
      .then(then)
  },
}
