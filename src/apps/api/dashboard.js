/**
 * 获取首页banner
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getBannerADApi = (then, fail) => {
  return $http({
    url: '/acct/usernotice/getdashboardadvertise.json',
    data:{
      version:1
    }
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取首页紧急公告列表
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getNoticeApi = (then, fail) => {
  return $http({
    url: '/info/activitylist/geturgentbulletinlist.json',
    data: {version: 2},
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取首页电子游戏列表
 * @param then
 * @param fail
 * @returns {Promise.<T>|*}
 */
const getIndexGameApi = (then, fail) => {
  return $http({
    url: '/info/indexGameConfig/gameConf.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取首页积分商城列表
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getMallHotListApi = (then, fail) => {
  return $http({
    url: '/mall/coupon/newItemList.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取首页盘口玩法彩种及经典彩种列表
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getIndexTicketApi = (then, fail) => {
  return $http({
    url: 'ticket/ticketmod/indexlist.json',
  })
    .then(then)
    .catch(fail)
}
export {
  getBannerADApi,
  getNoticeApi,
  getIndexGameApi,
  getMallHotListApi,
  getIndexTicketApi
}
