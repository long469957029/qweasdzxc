

require('./style.scss')
const TabView = require('com/tabView')

const ApplyView = require('./apply')
const ApplyRecordView = require('./applyRecord')
const RefundRecordView = require('./refundRecord')
const RefundRepayView = require('./refundRepay')

const VipCreditView = TabView.extend({

  className: 'vipCredit-view',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '申请贷款',
          name: 'apply',
          id: 'jsApply',
          view: ApplyView,
        },
        {
          label: '申请还款',
          name: 'refundRecord',
          id: 'jsRefundRecord',
          view: RefundRecordView,
        },
        {
          label: '借贷记录',
          name: 'applyRecord',
          id: 'jsApplyRecord',
          view: ApplyRecordView,
        },
        {
          label: '还款记录',
          name: 'applyRepay',
          id: 'jsApplyRepay',
          view: RefundRepayView,
        },
      ],
    })
  },
})

module.exports = VipCreditView
