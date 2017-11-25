

const TabView = require('com/tabView')

const SubRecordView = require('agencyCenter/profitAndLoss/sumProfitAndLoss')
const GameRecordView = require('agencyCenter/profitAndLoss/gameProfitAndLoss')
const TicketRecordView = require('agencyCenter/profitAndLoss/ticketProfitAndLoss')


const TeamBettingRecordView = TabView.extend({

  events: {},

  className: 'as-passwordManage',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '总盈亏',
          name: 'jsAcPlSr',
          id: 'jsAcPlSr',
          router: 'ac/spl',
          view: SubRecordView,
        },
        {
          label: '彩票盈亏',
          name: 'jsAcPlTr',
          id: 'jsAcPlTr',
          router: 'ac/pl',
          view: TicketRecordView,
        },
        {
          label: '游戏盈亏',
          name: 'jsAcPlGr',
          id: 'jsAcPlGr',
          router: 'ac/gpl',
          view: GameRecordView,
        },

      ],
    })
  },
})

module.exports = TeamBettingRecordView
