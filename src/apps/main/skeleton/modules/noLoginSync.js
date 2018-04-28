/**
 * Created by steven on 2018/1/19.
 */
const urlList = [
  {
    url: '/acct/usernotice/getdashboardadvertise.json',//首页banner广告
  },
  {
    url: 'ticket/ticketmod/indexlist.json',//获取首页盘口玩法彩种及经典彩种列表
  },
  {
    url: '/info/activitylist/geturgentbulletinlist.json',//紧急公告
  },
  {
    url: '/info/indexGameConfig/gameConf.json',//获取首页电子游戏列表
  },
  {
    url: '/mall/coupon/newItemList.json',//获取首页积分商城列表
  },
  {
    url: '/ticket/game/prizeList.json',//前台 - 中奖记录
  },
  {
    url: '/mall/coupon/newItemList.json',
  },
  {
    url: '/ticket/game/prizeList.json',
  },
  {
    url: '/info/game/userInfo.json'
  },
  {
    url: '/info/game/userInfo.json'
  },
  {
    url: '/info/activityCenter/detail.json'
  },
  {
    url: '/info/rechargetarget/info.json'
  },
  {
    url: '/info/bettarget/info.json'
  },
  {
    url: '/ticket/ticketmod/openHistoryDetail.json',
  },
  {
    url: '/ticket/ticketmod/ticketlist.json',
  }, {
    url: '/acct/usernotice/getMallAdvertise.json'
  }
]
module.exports = {
  get(id) {
    return _(urlList).findWhere({
      id,
    })
  },
  getAll() {
    return urlList
  },
  urlList,
}
