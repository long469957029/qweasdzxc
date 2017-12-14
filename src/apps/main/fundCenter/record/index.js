

import TabView from 'com/tabView'

import WithdrawView from './withdraw'
import RechargeView from './recharge'
import TransferView from './transfer'

const FundRecordsView = TabView.extend({

  // className: 'ac-wr-view',
  className: 'fc-detail',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '充值',
          name: 'record-recharge',
          id: 'js-record-recharge',
          view: RechargeView,
        }, {
          label: '提现',
          name: 'record-withdraw',
          id: 'js-record-withdraw',
          view: WithdrawView,
        }, {
          label: '转帐',
          name: 'record-transfer',
          id: 'js-record-transfer',
          view: TransferView,
        },
      ],
      title: '充提记录',
    })
  },
})

export default FundRecordsView
