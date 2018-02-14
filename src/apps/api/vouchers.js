/**
 * 获取用户代金券接口（轮询）
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getRedPackInfoApi = (then, fail) => {
  return $http({
    url: '/info/redpack/info.json'
  })
    .then(then)
    .catch(fail)
}


export {
  getRedPackInfoApi
}
