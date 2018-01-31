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
export {
  getAccountSafeApi
}
