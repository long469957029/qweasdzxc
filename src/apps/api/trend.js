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
  }
}
