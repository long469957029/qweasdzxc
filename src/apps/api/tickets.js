export default {
  // 取得所有彩种
  getTicketList (then) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/ticketlist.json',
    })
      .then(then)
  },

  //取得彩种开奖信息
  getTicketOpeningList ({ticketId, pageSize, date}, then) {
    return Global.sync.axios({
      url: '/ticket/ticketmod/openHistoryDetail.json',
      data: {
        ticketId,
        // pageSize: pageSize ? pageSize : 1000,
        pageSize,
        date,
      },
    })
      .then(then)
  },
}
