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
      version: 2,
    })
      .then(then)
      .catch(fail)
  },
}
