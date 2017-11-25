

require('./index.scss')
const TabView = require('com/tabView')

const MyTicketInfoView = require('./myTicket')
const TicketExchangeInfoView = require('./ticketExchange')
const MyGiftExchangeInfoView = require('./giftExchange')
const IntegralDetailsInfoView = require('./integralDetails')

const MyIntegralView = TabView.extend({

  events: {},

  className: 'mall-my-tab',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '我的优惠券',
          name: 'jsMyTicket',
          id: 'jsMyTicket',
          view: MyTicketInfoView,
        },
        {
          label: '券兑换记录',
          name: 'jsTicketExchange',
          id: 'jsTicketExchange',
          view: TicketExchangeInfoView,
        },
        {
          label: '礼物兑换记录',
          name: 'jsGiftExchange',
          id: 'jsGiftExchange',
          view: MyGiftExchangeInfoView,
        },
        {
          label: '积分明细',
          name: 'jsIntegralDetails',
          id: 'jsIntegralDetails',
          view: IntegralDetailsInfoView,
        },
      ],
    })
  },
})

module.exports = MyIntegralView
