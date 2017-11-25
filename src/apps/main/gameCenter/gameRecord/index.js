

const TabView = require('com/tabView')

const GameRecordView = require('gameCenter/gameRecord/gameRecord')
const ChaseRecordView = require('userCenter/views/trackRecords')
const TicketRecordView = require('userCenter/views/bettingRecords')


const TeamBettingRecordView = TabView.extend({

  events: {},

  className: 'as-passwordManage',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '彩票投注',
          name: 'jsGcGrTr',
          id: 'jsGcGrTr',
          router: 'gc/tr',
          view: TicketRecordView,
        },
        {
          label: '彩票追号',
          name: 'jsGcGrCr',
          id: 'jsGcGrr',
          router: 'gc/cr',
          view: ChaseRecordView,
        },
        {
          label: '游戏投注',
          name: 'jsGcGrGr',
          id: 'jsGcGrGr',
          router: 'gc/gr',
          view: GameRecordView,
        },

      ],
    })
  },
})

module.exports = TeamBettingRecordView
