export default {
  //走势图
  /**
   * @param {Number} trendTypeId
   * @param {Number} ticketId
   * @param {Number} playSeriesId
   * @param {Number} limit
   * @param {Number} day
   **/
  getTrend({trendTypeId, ticketId, playSeriesId, day = null, limit = 30}, then) {
    return Global.sync.ajax({
      url: 'http://trend.ybf01.com/trends/trend/sscTrend.json',
      data: {
        trendTypeId,
        ticketId,
        playSeriesId,
        day,
        limit
      },
      dataType: 'jsonp',
    })
      .done(then)
  },

  getTrendByOld({ticketId, pageSize, startDate, endDate}, then, fail) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/trend.json',
      data: {
        ticketId,
        pageSize,
        startDate,
        endDate,
      },
    })
      .then(then)
      .catch(fail)
  }
}
