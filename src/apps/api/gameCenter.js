/**
 * Created by kim on 2018/2/1.
 */
/**
 * 获取游戏列表 各游戏状态
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getGameListApi = () => {
  return Global.sync.ajax({
    url: '/ticket/game/list.json',
    async: false,
  })
}
/**
 * 获取用户游戏余额
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getSummaryApi = (then,fail) => {
  return $http({
    url: '/fund/balance/summary.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 点击游戏的时候 获取游戏地址
 * @param gameId
 * @param type
 * @param device
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getGameUrlApi = ({gameId,type = 0 ,device = 0}) => {
  return Global.sync.ajax({
    url: '/info/game/jumpInfo.json',
    data:{
      token: Global.cookieCache.get('token'),
      gameId,
      type,
      device,
    },
    async: false,
  })
}
/**
 * 获取第三方游戏中奖名单， gameType（ 1:真人, 2:体育, 3:老虎机,  4:捕鱼）
 * @param gameType
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getPrizeListApi = ({gameType},then,fail) => {
  return $http({
    url: '/ticket/game/prizeList.json',
    data:{
      gameType
    }
  })
    .then(then)
    .catch(fail)
}
export {
  getGameListApi,
  getSummaryApi,
  getGameUrlApi,
  getPrizeListApi
}
