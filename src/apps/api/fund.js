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
}
