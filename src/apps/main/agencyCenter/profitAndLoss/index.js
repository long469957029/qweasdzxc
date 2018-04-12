
const TabView = require('com/tabView')

const SubRecordView = require('agencyCenter/profitAndLoss/sumProfitAndLoss')
const GameRecordView = require('agencyCenter/profitAndLoss/gameProfitAndLoss')
const TicketRecordView = require('agencyCenter/profitAndLoss/ticketProfitAndLoss')


const TeamBettingRecordView = TabView.extend({

  events: {},

  className: 'ac-team-main basic-black',

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
          label: '彩票',
          name: 'jsAcPlTr',
          id: 'jsAcPlTr',
          router: 'ac/pl',
          view: TicketRecordView,
        },
        {
          label: 'AG真人',
          name: 'jsAcPlGr',
          id: 'jsAcPlGr',
          router: 'ac/gpl',
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
        {
          label: '体育',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: GameRecordView,
          options: { channelId: 7, type: 4},
        },
      ],
    })
  },
})

module.exports = TeamBettingRecordView
