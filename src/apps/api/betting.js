export default {
  // 取得当期彩票信息
  getTicketInfo ({ ticketId, type = 0, version = 1 }, then, fail) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/ticketinfo.json',
      data: {
        ticketId,
        type,
        version,
      },
    })
      .then(then)
      .catch(fail)
  },
  // 取得彩票相关规则
  getTicketRules ({ ticketId, type = 0, version = 1 }, then, fail) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/ticketplaylist.json',
      localCache: true,
      cacheName: `ticketList.${ticketId}.${type}`,
      data: {
        ticketId,
        type,
        version,
      },
    })
      .then(then)
      .catch(fail)
  },
  // 提交投注
  pushBetting({ planId, bet, usePack }, then, fail) {
    return Global.sync.axios({
      url: '/ticket/bet/bet.json',
      tradition: true,
      data: {
        planId,
        bet,
        usePack,
      },
    })
      .then(then)
      .catch(fail)
  },

  // 取得追号期数
  getPlans({ ticketId }, then, fail) {
    return Global.sync.axios({
      url: '/ticket/chase/chaseinfo.json',
      data: {
        ticketId,
      },
    })
      .then(then)
      .catch(fail)
  },

  // 提交追号
  pushChase({
    plan, play, suspend, usePack, amount,
  }, then, fail) {
    return Global.sync.axios({
      url: '/ticket/chase/chase.json',
      tradition: true,
      data: {
        plan,
        play,
        suspend,
        usePack,
        amount,
      },
    })
      .then(then)
      .catch(fail)
  },

  // jsonp 考虑以后直接只用CORS
  // 取得30期冷热
  getColdHot({ ticketId, playSeriesId }, then) {
    return Global.sync.ajax({
      url: 'http://trend.ybf01.com/trends/data/coldHotData.json',
      data: {
        ticketId,
        playSeriesId,
        token: 'a8d60d17-2957-450a-9421-0749c2621704',
      },
      dataType: 'jsonp',
    })
      .done(then)
  },

  // 当前遗漏
  getCurrentMiss({ ticketId, playSeriesId }, then) {
    return Global.sync.ajax({
      url: 'http://trend.ybf01.com/trends/data/currentMiss.json',
      data: {
        ticketId,
        playSeriesId,
        token: 'a8d60d17-2957-450a-9421-0749c2621704',
      },
      dataType: 'jsonp',
    })
      .done(then)
  },

  //取得顶部彩种
  getTopTickets({type = 0}, then, fail) {
    return Global.sync.axios({
      url: '/ticket/show/getTopTickets.json',
      data: {
        type,
      },
      abort: false
    })
      .then(then)
      .catch(fail)
      // /ticket/show/viewTicket.json
  },

  //设置当前顶部彩种
  setTopCurrentTicket({ticketId, type = 0}) {
    return Global.sync.axios({
      url: '/ticket/show/viewTicket.json',
      data: {
        ticketId,
        type,
        device: 0
      }
    })
  }
}

