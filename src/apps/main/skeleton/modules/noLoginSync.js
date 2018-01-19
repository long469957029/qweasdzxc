/**
 * Created by steven on 2018/1/19.
 */
const urlList = [
  {
    url: '/acct/usernotice/getdashboardadvertise.json',
  },
  {
    url: 'ticket/ticketmod/indexlist.json',
  },
  {
    url: '/info/activitylist/geturgentbulletinlist.json',
  },
  {
    url: '/info/indexGameConfig/gameConf.json',
  },
  {
    url: '/mall/coupon/newItemList.json',
  },
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
