export default {
  getTicketInfo (ticketId, success, error) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketinfo.json',
      async: false,
      data: { ticketId },
      success,
      error,
    })
  },
  getTicketRules(ticketId, success, error) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketplaylist.json',
      localCache: true,
      cacheName: `ticketList.${this.options.ticketId}`,
      data: { ticketId },
      success,
      error,
    })
  },
}
