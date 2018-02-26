/**
 * 取得当期彩票信息
 * @param ticketId
 * @param type
 * @param version
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getTicketInfoApi = ({ ticketId, type = 0, version = 1 }, then, fail) => {
  return $http({
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

/**
 * 取得彩票相关规则
 * @param ticketId
 * @param type
 * @param version
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getTicketRulesApi = ({ ticketId, type = 0, version = 1 }, then, fail) => {
  return $http({
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

/**
 * 提交投注
 * @param planId
 * @param bet
 * @param then
 * @param fail
 * @returns {* | Promise<T>}
 * @param couponRid
 */
const pushBettingApi = ({ planId, bet, couponRid = 0 }, then, fail) => {
  const usePack = !!couponRid ? 1 : 0
  return $http({
    url: '/ticket/bet/bet.json',
    tradition: true,
    data: {
      planId,
      bet,
      usePack,
      couponRid
    },
  })
    .then(then)
    .catch(fail)
}

/**
 * 取得追号期数
 * @param ticketId
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getPlansApi = ({ ticketId }, then, fail) => {
  return $http({
    url: '/ticket/chase/chaseinfo.json',
    data: {
      ticketId,
    },
  })
    .then(then)
    .catch(fail)
}

/**
 * 提交追号
 * @param plan
 * @param play
 * @param suspend
 * @param usePack
 * @param amount
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const pushChaseApi = ({
  plan, play, suspend, usePack, amount,
}, then, fail) => {
  return $http({
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

/**
 * 取得30期冷热 五星
 * @param ticketId
 * @param playSeriesId
 * @param then
 * @param type
 * @param isOfficial
 */
const getColdHotApi = ({ ticketId, playSeriesId, isOfficial, type = 'normal' }, then) => {
  return Global.sync.ajax({
    url: type === 'normal' ? 'http://trend.ybf01.com/trends/data/coldHotData.json' : 'http://trend.ybf01.com/trends/data/numDisColdHotData.json',
    data: {
      ticketId: isOfficial ? ticketId : ticketId + 10000,
      playSeriesId,
      platform: 2,
    },
    dataType: 'jsonp',
  })
    .done(then)
}

/**
 * 当前遗漏 五星
 * @param ticketId
 * @param playSeriesId
 * @param then
 * @param type
 * @param isOfficial
 */
const getCurrentMissApi = ({ ticketId, playSeriesId, isOfficial, type = 'normal' }, then) => {
  return Global.sync.ajax({
    url: type === 'normal' ? 'http://trend.ybf01.com/trends/data/currentMiss.json' : 'http://trend.ybf01.com/trends/data/numDisCurrentMiss.json',
    data: {
      ticketId: isOfficial ? ticketId : ticketId + 10000,
      playSeriesId,
      platform: 2
    },
    dataType: 'jsonp',
  })
    .done(then)
}

/**
 * 取得顶部彩种
 * @param type
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getTopTicketsApi = ({type = 0}, then, fail) => {
  return $http({
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

/**
 * 设置当前顶部彩种
 * @param ticketId
 * @param type
 * @returns {*}
 */
const setTopCurrentTicketApi = ({ticketId, type = 0}) => {
  return $http({
    url: '/ticket/show/viewTicket.json',
    data: {
      ticketId,
      type,
      device: 0
    }
  })
}

/**
 * 秒秒彩开奖
 * @param bet
 * @param couponRid
 * @param then
 * @param fail
 * @returns {* | Promise<T>}
 */
const pushMmcBettingApi = ({bet, couponRid = 0}, then, fail) => {
  const usePack = !!couponRid ? 1 : 0

  return $http({
    url: '/ticket/bet/betMmc.json',
    tradition: true,
    data: {
      planId: 'mmc',
      bet,
      usePack,
      couponRid
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 秒秒彩模拟开奖
 * @param planId
 * @param bet
 * @param usePack
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const pushMmcSimulationBettingApi = (then, fail) => {
  return $http({
    url: '/ticket/bet/virtmmc.json',
  })
    .then(then)
    .catch(fail)
}

/**
 * 取得秒秒彩信息
 * @param ticketId
 * @returns {*|Promise<T>}
 */
const getMmcTicketInfoApi = ({ticketId = 19}, then ,fail) => {
  return $http({
    url: '/ticket/ticketmod/ticketinfoMmc.json',
    data: {
      ticketId
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 取得代金券
 * @param ticketId
 * @param then
 */
const getVouchersApi = ({ticketId}, then) => {
  return $http({
    url: '/info/redpack/ticketCouponList.json',
    data: {
      ticketId
    }
  })
    .then(then)
}

/**
 * 撤销投注
 * @param betId
 * @param then
 */
const bettingCancelApi = ({betId}, then) => {
  return $http({
    url: '/ticket/bet/cancel.json',
    data: {
      betId
    }
  })
    .then(then)
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
  getMmcTicketInfoApi,
  pushMmcBettingApi,
  pushMmcSimulationBettingApi,
  getVouchersApi,
  bettingCancelApi,
}
