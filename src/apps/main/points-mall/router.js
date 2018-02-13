const PointsMall = () => import(/* webpackChunkName: "points-mall" */ './index')
const PointsCardPanel = () => import(/* webpackChunkName: "points-mall" */ './points-card-panel')
const PointsLotteryPanel = () => import(/* webpackChunkName: "points-mall" */ './points-lottery-panel')
const PointsGiftPanel = () => import(/* webpackChunkName: "points-mall" */ './points-gift-panel')
const PointsChargePanel = () => import(/* webpackChunkName: "points-mall" */ './points-charge-panel')
const PointsIntroduction = () => import(/* webpackChunkName: "points-mall" */ './points-introduction')

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
        name: 'pointsCards',
        path: 'cards',
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
        name: 'pointsCharge',
        path: 'charge',
        component: PointsChargePanel,
      },
    ]
  },
  {
    name: 'pointsIntro',
    path: '/points/intro',
    components: PointsIntroduction
  }
]
