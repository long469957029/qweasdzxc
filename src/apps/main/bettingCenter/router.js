import './misc/index.scss'
import BettingCenter from './betting-center'
import MMCBettingCenterView from './mmc'

const BettingDetailView = require('./bettingCenter-detail')

export default [
  {
    path: '/bc/19',
    component: function() {
      RouterController.changeMainReginView(new MMCBettingCenterView({
        ticketId: 19,
      }))
    },
  },
  {
    path: '/bc/:ticketId',
    component: BettingCenter
  },
  {
    path: '/bc/:ticketId/:type',
    component: BettingCenter
  },
  {
    path: '/bc/betting/detail/:betId',
    component: function() {
      RouterController.changeMainReginView(new BettingDetailView({
        tradeNo: $route.params.tradeNo,
      }), {
        main: {
          title: '投注详情',
          subReturn: true,
        },
        sidebar: Global.ui.menu.get('uc'),
        parentRouter: `bc/${$route.params.ticketId}`,
      })
    }
  },
  {
    path: '/bc/br/detail/:ticketId/:betId',
    component: function() {
      RouterController.changeMainReginView(new BettingDetailView({
        tradeNo: app.$route.params.tradeNo,
      }), {
        main: {
          title: '投注详情',
          subReturn: true,
        },
        sidebar: Global.ui.menu.get('uc'),
        parentRouter: `bc/${$route.params.ticketId}`,
      })
    }
  },
  // {'bc/br/detail/:ticketId/:betId': 'bettingDetail'}, // 投注详情
]
