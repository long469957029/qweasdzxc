/**
 * 走势图
 * @param {Number} trendTypeId
 * @param {Number} ticketId
 * @param {Number} playSeriesId
 * @param {Number} limit
 * @param {Number} day
 **/
const getTrendApi = ({trendTypeId, ticketId, playSeriesId, days = null, limit = 30}, then) => {
  return Global.sync.ajax({
    url: 'http://trend.ybf01.com/trends/trend/trendAnalyzeP2.json',
    data: {
      // trendTypeId,
      ticketId,
      // playSeriesId,
      days,
      limit
    },
    dataType: 'jsonp',
  })
    .done(then)
}

/**
 * 旧走势图
 * 只给秒秒彩使用
 * @param ticketId
 * @param limit
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getTrendByOldApi = ({ticketId, limit = 30}, then, fail) => {
  return $http({
    url: '/ticket/ticketmod/trendDetail.json',
    data: {
      ticketId,
      lastOpenNum: limit,
      isNumberDistributed: false
    },
  })
    .then(then)
    .catch(fail)
}

/**
 * 路珠分析
 * @param ticketId
 * @param types
 * @param locations
 * @param limit
 * @param then
 */
const getRoadBallsApi = ({ ticketId, types, locations, limit = 100 }, then) => {
  return Global.sync.ajax({
    url: 'http://trend.ybf01.com/trends/trend/comboP2.json',
    data: {
      ticketId,
      types,
      locations,
      limit,
    },
    dataType: 'jsonp',
  })
    .done(then)
}

/**
 * 取得两面长龙数据
 * @param ticketId
 * @param isOfficial
 * @param then
 */
const getTwoSideApi = ({ ticketId, isOfficial }, then) => {
  return Global.sync.ajax({
    url: 'http://trend.ybf01.com/trends/trend/twoSideList.json',
    data: {
      ticketId: isOfficial ? ticketId : ticketId + 10000,
    },
    dataType: 'jsonp',
  })
    .done(then)
}

/**
 * 取得开奖记录
 * @param ticketId
 * @param pageSize
 * @param then
 * @returns {*}
 */
const getOpenHistoryApi = ({ticketId, pageSize = 15}, then) => {
  return $http({
    url: '/ticket/ticketmod/openhistory.json',
    data: {
      pageSize,
      ticketId,
    }
  })
    .done(then)
}

export {
  getTrendApi,
  getTrendByOldApi,
  getRoadBallsApi,
  getTwoSideApi,
  getOpenHistoryApi,
}
