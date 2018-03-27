

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
          view: TicketRecordView,
          options: { userName: this.options.userName, type: 0},
        },
        {
          label: '双面盘',
          name: 'jsAcDoubleSided',
          id: 'jsAcDoubleSided',
          view: TicketRecordView,
          options: { userName: this.options.userName, type: 1},
        },
        {
          label: 'AG真人',
          name: 'jsAcBrGr',
          id: 'jsAcBrGr',
          view: GameRecordView,
          options: { channelId: 1, type: 1, userName: this.options.userName },
        },
        {
          label: 'EBET',
          name: 'jsEbetPlGr',
          id: 'jsEbetPlGr',
          view: GameRecordView,
          options: { channelId: 2, type: 1, userName: this.options.userName },
        },
        {
          label: 'BBIN',
          name: 'jsBbinPlGr',
          id: 'jsBbinPlGr',
          view: GameRecordView,
          options: { channelId: 3, type: 1, userName: this.options.userName },
        },
        {
          label: 'PT',
          name: 'jsPtPlGr',
          id: 'jsPtPlGr',
          view: GameRecordView,
          options: { channelId: 4, type: 3, userName: this.options.userName },
        },
        {
          label: 'MG',
          name: 'jsMgPlGr',
          id: 'jsMgPlGr',
          view: GameRecordView,
          options: { channelId: 5, type: 3, userName: this.options.userName },
        },
        {
          label: 'AG捕鱼',
          name: 'jsAgFishPlGr',
          id: 'jsAgFishPlGr',
          view: GameRecordView,
          options: { channelId: 1, type: 4, userName: this.options.userName },
        },
        {
          label: 'GG',
          name: 'jsGgPlGr',
          id: 'jsGgPlGr',
          view: GameRecordView,
          options: { channelId: 6, type: 4, userName: this.options.userName },
        },
        // {
        //   label: '体育',
        //   name: 'jsFcMdPlatform',
        //   id: 'jsFcMdPlatform',
        //   view: GameRecordView,
        //   options: { channelId: 7, type: 4, userName: this.options.userName },
        // },
      ],
    })
  },
})

module.exports = TeamBettingRecordView
