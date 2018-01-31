/**
 * 检查回归用户是否有红包
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const userLossInfoApi = (then, fail) => {
  return $http({
    url: '/info/userLost/info.json'
  })
    .then(then)
    .catch(fail)
}
/**
 * 回归用户领取红包
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const userGetAwardInfoApi = (then, fail) => {
  return $http({
    url: '/info/userLost/getAward.json'
  })
    .then(then)
    .catch(fail)
}

export {
  userLossInfoApi,
  userGetAwardInfoApi
}
