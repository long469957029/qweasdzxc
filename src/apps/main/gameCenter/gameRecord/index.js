
import { channelId } from 'skeleton/misc/menuConfig'

const TabView = require('com/tabView')

const PlatfomrMoneyDetailView = require('gameCenter/gameRecord/gameRecord')
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
        // {
        //   label: '游戏投注',
        //   name: 'jsGcGrGr',
        //   id: 'jsGcGrGr',
        //   router: 'gc/gr',
        //   view: GameRecordView,
        // },
        {
          label: 'AG',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.ag },
        }, {
          label: 'EBET',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.ebet },
        }, {
          label: 'BBIN',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.bbin },
        },
        {
          label: 'PT',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.pt },
        }, {
          label: 'MG',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.mg },
        },
        {
          label: 'GG',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.gg },
        },
        {
          label: '188体育',
          name: 'jsFcMdPlatform',
          id: 'jsFcMdPlatform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.sport },
        },
      ],
      title: '投注记录',
    })
  },
})

module.exports = TeamBettingRecordView
