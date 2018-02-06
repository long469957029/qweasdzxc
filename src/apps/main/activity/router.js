const mainActivity = () => import(/* webpackChunkName: "main-activity" */ './main-activity')
const rechargeSalesActivity = () => import(/* webpackChunkName: "recharge-sales-activity" */ './rechargeSalesActivity/index')
const betPlanActivity = () => import(/* webpackChunkName: "recharge-sales-activity" */ './betPlanActivity/index')
const welfareSharingPlan = () => import(/* webpackChunkName: "recharge-sales-activity" */ './welfareSharingPlan/index')

export default [
  { path: '/act/', component: mainActivity,
    children: [
      { path: 'rechargeSales', component: rechargeSalesActivity },
      { path: 'betPlan', component: betPlanActivity },
      { path: 'welfareSharingPlan', component: welfareSharingPlan },
    ]
  }
]
