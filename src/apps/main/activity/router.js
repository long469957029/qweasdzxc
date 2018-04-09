const RechargeSalesActivity = () => import(/* webpackChunkName: "recharge-sales-activity" */ './rechargeSalesActivity')
const BetPlanActivity = () => import(/* webpackChunkName: "recharge-sales-activity" */ './betPlanActivity')
const WelfareSharingPlan = () => import(/* webpackChunkName: "recharge-sales-activity" */ './welfareSharingPlan')
const RechargePlan = () => import(/* webpackChunkName: "recharge-sales-activity" */ './rechargePlan')
const ArenaActivity = () => import(/* webpackChunkName: "arena-activity" */ './arena')
const UserReturnActivity = () => import(/* webpackChunkName: "users-return-activity" */ './users-return')

export default [
  {
    path: '/act/rechargeSales',
    component: RechargeSalesActivity,
  },
  {
    path: '/act/betPlan',
    component: BetPlanActivity
  },
  {
    path: '/act/welfareSharingPlan',
    component: WelfareSharingPlan
  },
  {
    path: '/act/rechargePlan',
    component: RechargePlan
  },
  {
    path: '/act/arena',
    component: ArenaActivity,
    meta: {
      footer: false,
      toolbar: false
    }
  },
  {
    path: '/act/userReturn',
    component: UserReturnActivity,
    meta: {
      footer: false,
      toolbar: false
    }
  }
]
