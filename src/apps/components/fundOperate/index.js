import TabView from 'com/tabView'

import WithdrawView from './withdraw'
import RechargeView from './recharge'
import TransferView from './transfer'

const FundOperateView = TabView.extend({

  className: 'fc-rw',

  initialize() {
    const cursize = 0
      _(this.options).extend({
        tabs: [
          {
            label: '充值',
            name: 'jsFcRecharge',
            id: 'recharge',
            view: RechargeView,
            options: {cur: cursize},
          },
          {
            label: '转帐',
            name: 'jsFcTransfer',
            id: 'transfer',
            view: TransferView,
            options: {cur: cursize},
          },
          {
            label: '提现',
            name: 'jsFcWithdraw',
            id: 'withdraw',
            view: WithdrawView,
            options: {cur: cursize},
          },
        ],
      })
  },
})

export default FundOperateView
