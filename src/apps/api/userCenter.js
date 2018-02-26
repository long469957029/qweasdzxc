/**
 * 获取用户密码相关设置信息
 * @param then
 * @param fail
 */
const getAccountSafeApi = (then, fail) => {
    return $http({
      url: '/acct/userinfo/accountCenter.json',
    })
      .then(then)
      .catch(fail)
}
/**
 * 获取用户是否绑定手机号，邮箱和银行卡信息，以及首次绑定的相关奖励
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getBindInfoApi = (then, fail) => {
  return $http({
    url: '/info/newpack/bindinfo.json',
  })
    .then(then)
    .catch(fail)
}
export {
  getAccountSafeApi,
  getBindInfoApi
}
