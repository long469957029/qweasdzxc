
import { channelId } from 'skeleton/misc/menuConfig'

const TabView = require('com/tabView')

const PlatfomrMoneyDetailView = require('fundCenter/gameRecord/gameRecord')
const ChaseRecordView = require('fundCenter/gameRecord/trackRecords')
const TicketRecordView = require('fundCenter/gameRecord/bettingRecords')


const TeamBettingRecordView = TabView.extend({

  events: {},

  className: 'fc-gr-detail basic-black p-bottom-lg',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '彩票投注',
          name: 'jsGcGrTr',
          id: 'jsGcGrTr',
          router: 'fc/td',
          view: TicketRecordView,
          options: { type: 0,ticketType:2 },
        },
        {
          label: '彩票追号',
          name: 'jsGcGrCr',
          id: 'jsGcGrr',
          router: 'fc/cr',
          view: ChaseRecordView,
        },
        {
          label: '双面盘',
          name: 'jsDoubleSided',
          id: 'jsDoubleSided',
          view: TicketRecordView,
          options: { type: 1,ticketType:1 },
        },
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
        // {
        //   label: '188体育',
        //   name: 'jsFcMdPlatform',
        //   id: 'jsFcMdPlatform',
        //   view: PlatfomrMoneyDetailView,
        //   options: { channelId: channelId.sport },
        // },
      ],
    })
  },
})

module.exports = TeamBettingRecordView
