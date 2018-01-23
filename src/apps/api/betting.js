// 取得当期彩票信息
const getTicketInfoApi = ({ ticketId, type = 0, version = 1 }, then, fail) => {
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
}
// 取得彩票相关规则
const getTicketRulesApi = ({ ticketId, type = 0, version = 1 }, then, fail) => {
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
}

// 提交投注
const pushBettingApi = ({ planId, bet, usePack }, then, fail) => {
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
}

// 取得追号期数
const getPlansApi = ({ ticketId }, then, fail) => {
  return Global.sync.axios({
    url: '/ticket/chase/chaseinfo.json',
    data: {
      ticketId,
    },
  })
    .then(then)
    .catch(fail)
}

// 提交追号
const pushChaseApi = ({
  plan, play, suspend, usePack, amount,
}, then, fail) => {
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
}

// jsonp 考虑以后直接只用CORS
// 取得30期冷热
const getColdHotApi = ({ ticketId, playSeriesId }, then) => {
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
}

// 当前遗漏
const getCurrentMissApi = ({ ticketId, playSeriesId }, then) => {
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
}

//取得顶部彩种
const getTopTicketsApi = ({type = 0}, then, fail) => {
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
}

//设置当前顶部彩种
const setTopCurrentTicketApi = ({ticketId, type = 0}) => {
  return Global.sync.axios({
    url: '/ticket/show/viewTicket.json',
    data: {
      ticketId,
      type,
      device: 0
    }
  })
}

//秒秒彩开奖
const pushMmcBettingApi = ({ planId, bet, usePack = 0 }, then, fail) => {
  return Global.sync.axios({
    url: '/ticket/bet/betMmc.json',
    data: {
      // planId,
      bet,
      usePack,
    }
  })
    .then(then)
    .catch(fail)
}
//秒秒彩模拟开奖
const pushMmcSimulationBettingApi = ({ planId, bet, usePack = 0 }, then, fail) => {
  return Global.sync.axios({
    url: '/ticket/bet/virtmmc.json',
    data: {
      // planId,
      bet,
      usePack,
    }
  })
    .then(then)
    .catch(fail)
}

//取得秒秒彩信息
const getMmcTicketInfoApi = ({ticketId = 19}) => {
  return Global.sync.axios({
    url: '/ticket/ticketmod/ticketinfoMmc.json',
    data: {
      ticketId: ticketId
    }
  })
    .then(then)
    .catch(fail)
}

export {
  getTicketInfoApi,
  getTicketRulesApi,
  pushBettingApi,
  getPlansApi,
  getCurrentMissApi,
  getTopTicketsApi,
  pushChaseApi,
  setTopCurrentTicketApi,
  getColdHotApi,
  pushMmcBettingApi,
  pushMmcSimulationBettingApi,
  getMmcTicketInfoApi,
}
