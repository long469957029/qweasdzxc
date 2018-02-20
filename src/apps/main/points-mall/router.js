const PointsMall = () => import(/* webpackChunkName: "points-mall" */ './index')
const PointsCardPanel = () => import(/* webpackChunkName: "points-mall" */ './points-card-panel')
const PointsLotteryPanel = () => import(/* webpackChunkName: "points-mall" */ './points-lottery-panel')
const PointsTaskPanel = () => import(/* webpackChunkName: "points-mall" */ './points-task-panel')
const PointsGiftPanel = () => import(/* webpackChunkName: "points-mall" */ './points-gift-panel')
const PointsChargePanel = () => import(/* webpackChunkName: "points-mall" */ './points-charge-panel')
const PointsIntroduction = () => import(/* webpackChunkName: "points-mall" */ './points-introduction')

const PointsRecordsPanel = () => import(/* webpackChunkName: "points-mall" */ './points-records')
const AddressManage = () => import(/* webpackChunkName: "points-mall" */ './points-records/address-manage')
const ChargeRecords = () => import(/* webpackChunkName: "points-mall" */ './points-records/charge-records')
const GiftRecords = () => import(/* webpackChunkName: "points-mall" */ './points-records/gift-records')
const TicketRecords = () => import(/* webpackChunkName: "points-mall" */ './points-records/ticket-records')
const PointsRecords = () => import(/* webpackChunkName: "points-mall" */ './points-records/points-records')

export default [
  {
    path: '/points',
    component: PointsMall,
    children: [
      {
        name: 'pointsMall',
        path: '',
        component: PointsCardPanel,
      },
      {
        name: 'pointsGifts',
        path: 'gifts',
        component: PointsGiftPanel,
      },
      {
        name: 'pointsLottery',
        path: 'lottery',
        component: PointsLotteryPanel,
      },
      {
        name: 'pointsTask',
        path: 'task',
        component: PointsTaskPanel,
      },
      {
        name: 'pointsCharge',
        path: 'charge',
        component: PointsChargePanel,
      },
    ]
  },
  {
    path: '/points/records',
    component: PointsRecordsPanel,
    children: [
      {
        name: 'ticketRecords',
        path: '',
        component: TicketRecords,
      },
      {
        name: 'giftRecords',
        path: 'gifts',
        component: GiftRecords,
      },
      {
        name: 'chargeRecords',
        path: 'charge',
        component: ChargeRecords,
      },
      {
        name: 'pointsRecords',
        path: 'points',
        component: PointsRecords,
      },
      {
        name: 'addressManage',
        path: 'address',
        component: AddressManage,
      }
    ]
  },
  {
    name: 'pointsIntro',
    path: '/points/intro',
    component: PointsIntroduction
  }
]
