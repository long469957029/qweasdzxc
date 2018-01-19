import './misc/index.scss'
import BettingCenter from './betting-center'
import MMCBettingCenterView from './mmc'

export default [
  {
    path: '/bc/0/19',
    component: function() {
      RouterController.changeMainReginView(new MMCBettingCenterView({
        ticketId: 19,
      }))
    },
  },
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
    redirect: '/bc/0/:ticketId',
    // component: BettingCenter,
    // props: (route) => ({
    //   ticketId: Number(route.params.ticketId),
    //   ticketType: 0
    // }),
  },
  {
    path: '/bc/:ticketType/:ticketId',
    component: BettingCenter,
    props: (route) => ({
      ticketId: Number(route.params.ticketId),
      ticketType: Number(route.params.ticketType)
    }),
  },
]
