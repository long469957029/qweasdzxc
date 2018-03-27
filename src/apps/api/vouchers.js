/**
 * 获取用户代金券接口（轮询）
 * @author polo
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 * @example
 *
 * {
 *     "result": 0,
 *     "msg": "ok",
 *     "sign": null,
 *     "root": {
 *         "amountTotal": 0, //无用数据
 *         "count": 0, //无用数据
 *         "dataList": [{
 *             "amount": 10000,
 *             "ticketId": 1,
 *             "ticketName": "彩种名称",
 *             "validEndDate": 1522130033683
 *         }],
 *         "gameDataList": null //无用数据
 *     }
 * }
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
