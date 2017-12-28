

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
          label: 'AG真人',
          name: 'jsAcBrGr',
          id: 'jsAcBrGr',
          router: 'ac/gbr',
          view: GameRecordView,
          options: { channelId: 1, type: 1 },
        },
        {
          label: 'EBET',
          name: 'jsEbetPlGr',
          id: 'jsEbetPlGr',
          view: GameRecordView,
          options: { channelId: 2, type: 1 },
        },
        {
          label: 'BBIN',
          name: 'jsBbinPlGr',
          id: 'jsBbinPlGr',
          view: GameRecordView,
          options: { channelId: 3, type: 1 },
        },
        {
          label: 'PT',
          name: 'jsPtPlGr',
          id: 'jsPtPlGr',
          view: GameRecordView,
          options: { channelId: 4, type: 3 },
        },
        {
          label: 'MG',
          name: 'jsMgPlGr',
          id: 'jsMgPlGr',
          view: GameRecordView,
          options: { channelId: 5, type: 3 },
        },
        {
          label: 'AG捕鱼',
          name: 'jsAgFishPlGr',
          id: 'jsAgFishPlGr',
          view: GameRecordView,
          options: { channelId: 1, type: 4 },
        },
        {
          label: 'GG',
          name: 'jsGgPlGr',
          id: 'jsGgPlGr',
          view: GameRecordView,
          options: { channelId: 6, type: 4 },
        },

      ],
    })
  },
})

module.exports = TeamBettingRecordView
