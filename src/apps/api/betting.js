export default {
  getTicketInfo (ticketId) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketinfo.json',
      async: false,
      data: { ticketId },
    })
  },
}
