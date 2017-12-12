

import { channelId } from 'skeleton/misc/menuConfig'
import TabView from 'com/tabView'

import CenterMoneyDetailView from 'fundCenter/accountDetail/center'
import PlatfomrMoneyDetailView from 'fundCenter/accountDetail/game'


const AccountDetailsView = TabView.extend({

  events: {},

  className: 'fc-detail',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '中心钱包',
          name: 'jsFcMdCenter',
          id: 'jsFcMdCenter',
          router: 'fc/ad',
          view: CenterMoneyDetailView,
          options: this.options,
        }, {
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
      title: '帐变明细',
    })
  },
})

export default AccountDetailsView
