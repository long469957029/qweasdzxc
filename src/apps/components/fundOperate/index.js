import TabView from 'com/tabView'

import WithdrawView from './withdraw'
import RechargeView from './recharge'
import TransferView from './transfer'

const rechargeService = require('./recharge/rechargeService')

const FundOperateView = TabView.extend({

  // className: 'ac-wr-view',
  className: 'fc-rw',

  getActivityInfo () {
    return Global.sync.ajax({
      async: false,
      url: '/info/activityCenter/fundList.json',
    })
  },
  initialize() {
    // 请求充值页广告
    this.getActivityInfo().done((res) => {
      if (res.result === 0) {
        this.activityList = res.root.records.length === 0 ? null : res.root.records
        this.activityData = this.activityList
      } else if (res.result === 1) {
        this.activityList = null
        rechargeService.getFunActivity(this.activityList)
      }
    })
    const cursize = 0
    _(this.options).extend({
      tabs: [
        {
          label: '充值',
          name: 'jsFcRecharge',
          id: 'js-recharge',
          view: RechargeView,
          options: { ac: this.activityList, cur: cursize },
        },
        {
          label: '转帐',
          name: 'jsFcTransfer',
          id: 'js-transfer',
          view: TransferView,
          options: { ac: this.activityList, cur: cursize },
        },
        {
          label: '提现',
          name: 'jsFcWithdraw',
          id: 'js-withdraw',
          view: WithdrawView,
          options: { ac: this.activityList, cur: cursize },
        },
      ],
    })
  },
})

export default FundOperateView
