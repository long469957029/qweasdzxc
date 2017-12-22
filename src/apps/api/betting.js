export default {
  getTicketInfo (ticketId, then, fail) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/ticketinfo.json',
      data: { ticketId },
    })
      .then(then)
      .catch(fail)
  },
  getTicketRules(ticketId, then, fail) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/ticketplaylist.json',
      localCache: true,
      cacheName: `ticketList.${ticketId}`,
      data: { ticketId },
    })
      .then(then)
      .catch(fail)
  },
  pushBetting({planId, bet, usePack}, then, fail) {
    return Global.sync.axios({
      url: '/ticket/bet/bet.json',
      tradition: true,
      data: {
        planId,
        bet,
        usePack
      },
    })
      .then(then)
      .catch(fail)
  }
}
