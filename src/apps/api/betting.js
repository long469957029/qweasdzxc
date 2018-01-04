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
      cacheName: `ticketList.${ticketId}`,
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

  pushChase({plan, play, suspend, usePack, amount}, then, fail) {
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
}
