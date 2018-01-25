export default {
  /**
   * 获取首页banner
   * @param then
   * @param fail
   * @returns {*|Promise.<T>}
   */
  getBannerADXhr (then, fail) {
    return Global.sync.axios({
      url: '/acct/usernotice/getdashboardadvertise.json',
      data:{
        version:1
      }
    })
      .then(then)
      .catch(fail)
  },

  /**
   * 获取首页紧急公告列表
   * @param then
   * @param fail
   * @returns {*|Promise.<T>}
   */
  getNoticeXhr (then, fail) {
    return Global.sync.axios({
      url: '/info/activitylist/geturgentbulletinlist.json',
      data: {version: 2},
    })
      .then(then)
      .catch(fail)
  },

  /**
   * 获取首页电子游戏列表
   * @param then
   * @param fail
   * @returns {Promise.<T>|*}
   */
  getIndexGameXhr (then, fail) {
    return Global.sync.axios({
      url: '/info/indexGameConfig/gameConf.json',
    })
      .then(then)
      .catch(fail)
  },
  /**
   * 获取首页积分商城列表
   * @param then
   * @param fail
   * @returns {*|Promise.<T>}
   */
  getMallHotListXhr (then, fail) {
    return Global.sync.axios({
      url: '/mall/coupon/newItemList.json',
    })
      .then(then)
      .catch(fail)
  },
  /**
   * 获取首页盘口玩法彩种及经典彩种列表
   * @param then
   * @param fail
   * @returns {*|Promise.<T>}
   */
  getIndexTicketXhr (then, fail) {
    return Global.sync.axios({
      url: 'ticket/ticketmod/indexlist.json',
    })
      .then(then)
      .catch(fail)
  },

}
