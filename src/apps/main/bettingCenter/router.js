import './misc/index.scss'
import BettingCenter from './betting-center'
import MMCBettingCenter from './mmc-betting-center'
import MMCBettingCenterView from './old_mmc'

export default [
  {
    path: '/bc/19',
    redirect: '/bc/0/19',
  },
  {
    path: '/bc/0/19',
    component: MMCBettingCenter,
    props: (route) => ({
      ticketId: 19,
      ticketType: 0
    }),
  },
  {
    path: '/bc/old/19',
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
