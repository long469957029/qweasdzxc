/**
 * Created by steven on 2018/1/19.
 */
const urlList = [

  '/acct/usernotice/getdashboardadvertise.json',//首页banner广告

  'ticket/ticketmod/indexlist.json',//获取首页盘口玩法彩种及经典彩种列表

  '/info/activitylist/geturgentbulletinlist.json',//紧急公告

  '/info/indexGameConfig/gameConf.json',//获取首页电子游戏列表

  '/mall/coupon/newItemList.json',//获取首页积分商城列表

  '/ticket/game/prizeList.json',//前台 - 中奖记录

  '/info/newpack/info.json',

  '/info/feedback/stat.json',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',

  //公告，活动，商城
]
module.exports = {
  get(id) {
    return _(urlList).findWhere((item)=>{
      return item === id
    })
  },
  getAll() {
    return urlList
  },
  urlList,
}
