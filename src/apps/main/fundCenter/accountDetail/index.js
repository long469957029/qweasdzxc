

import { channelId } from 'skeleton/misc/menuConfig'
import TabView from 'com/tabView'

import CenterMoneyDetailView from 'fundCenter/accountDetail/center'
import PlatfomrMoneyDetailView from 'fundCenter/accountDetail/game'


const AccountDetailsView = TabView.extend({

  events: {},

  className: 'fc-ad-detail basic-black p-bottom-lg',

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
          name: 'jsFcAGform',
          id: 'jsFcAGform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.ag },
        }, {
          label: 'EBET',
          name: 'jsFcEBETform',
          id: 'jsFcEBETform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.ebet },
        }, {
          label: 'BBIN',
          name: 'jsFcBBINform',
          id: 'jsFcBBINform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.bbin },
        },
        {
          label: 'PT',
          name: 'jsFcPTform',
          id: 'jsFcPTform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.pt },
        }, {
          label: 'MG',
          name: 'jsFcMGform',
          id: 'jsFcMGform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.mg },
        },
        {
          label: 'GG',
          name: 'jsFcGGform',
          id: 'jsFcGGform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.gg },
        },
        {
          label: '体育',
          name: 'jsFcSportform',
          id: 'jsFcSportform',
          view: PlatfomrMoneyDetailView,
          options: { channelId: channelId.sport },
        },
      ],
    })
  },
})

export default AccountDetailsView
