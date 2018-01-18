export default {
  //走势图
  /**
   * @param {Number} trendTypeId
   * @param {Number} ticketId
   * @param {Number} playSeriesId
   * @param {Number} limit
   * @param {Number} day
   **/
  getTrend({trendTypeId, ticketId, playSeriesId, days = null, limit = 30}, then) {
    return Global.sync.ajax({
      url: 'http://trend.ybf01.com/trends/trend/sscTrend.json',
      data: {
        trendTypeId,
        ticketId,
        playSeriesId,
        days,
        limit
      },
      dataType: 'jsonp',
    })
      .done(then)
  },

  /**
   * 就走势图
   * @param ticketId
   * @param limit
   * @param days
   * @param then
   * @param fail
   * @returns {*|Promise<T>}
   */
  getTrendByOld({ticketId, limit = 30, days = null}, then, fail) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/trendDetail.json',
      data: {
        ticketId,
        lastOpenNum: limit,
        days,
        isNumberDistributed: true
      },
    })
      .then(then)
      .catch(fail)
  },

  // 当前遗漏
  getRoadBalls({ ticketId, types, locations, limit = 100 }, then) {
    return Global.sync.ajax({
      url: 'http://trend.ybf01.com/trends/trend/combo.json',
      data: {
        ticketId,
        types,
        locations,
        limit,
      },
      dataType: 'jsonp',
    })
      .done(then)
  },
}
