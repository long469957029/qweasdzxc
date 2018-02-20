/**
 * Created by steven on 2018/1/22.
 */

/**
 * 获取线路检测页URL清单
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getServerListApi = (then, fail) => {
  return $http({
    url: '/info/urls/list.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 第三方游戏下载页，判断是否需要系统提供账号
 * @param channelId
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getDownGameUserInfo = ({channelId},then,fail) => {
  return $http({
    url: '/info/game/userInfo.json',
    data:{
      channelId
    }
  })
    .then(then)
    .catch(fail)
}
export {
  getServerListApi,
  getDownGameUserInfo
}
