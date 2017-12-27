

const TabView = require('com/tabView')

const GameRecordView = require('agencyCenter/bettingRecord/gameRecord')
const TicketRecordView = require('agencyCenter/bettingRecord/ticketRecord')


const TeamBettingRecordView = TabView.extend({

  events: {},

  className: 'ac-team-main basic-black',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '彩票投注',
          name: 'jsAcBrTr',
          id: 'jsAcBrTr',
          router: 'ac/tbr',
          view: TicketRecordView,
        },
        {
          label: '游戏投注',
          name: 'jsAcBrGr',
          id: 'jsAcBrGr',
          router: 'ac/gbr',
          view: GameRecordView,
        },

      ],
    })
  },
})

module.exports = TeamBettingRecordView
