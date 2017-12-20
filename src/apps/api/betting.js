export default {
  getTicketInfo (ticketId, success, error) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketinfo.json',
      data: { ticketId },
      success,
      error,
    })
  },
  getTicketRules(ticketId, success, error) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketplaylist.json',
      localCache: true,
      cacheName: `ticketList.${ticketId}`,
      data: { ticketId },
      success,
      error,
    })
  },
}
