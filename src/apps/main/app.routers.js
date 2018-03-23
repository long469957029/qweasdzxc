import VueRouter from 'vue-router'

import dashboardRouter from './dashboard/router'
import bettingCenterRouter from './betting-center/router'
import userCenterRouter from './userCenter/router'
import activityRouter from './activity/router'

import activeCenterRouter from './activeCenter/router'
import pointsMallRouter from './points-mall/router'

import agencyCenterRouter from 'agencyCenter/router'
import fundCenterRouter from 'fundCenter/router'
import gameCenterRouter from './game-center/router'
import analysisCenterRouter from './analysisCenter/router'
import mobileBetCenterRouter from './mobileBetCenter/router'
import aboutUsRouter from './aboutUs/router'
import helpRouter from './help-center/router'
// import personalCenterRouter from './personalCenter/router'


Vue.use(VueRouter)


export const install = () => {

  // const acctInfo = Global.memoryCache.get('acctInfo')
  return new VueRouter({
    // mode: 'history',
    routes: [
      ...bettingCenterRouter,
      ...userCenterRouter,
      // ...vipCenterRouter,
      ...activeCenterRouter,
      ...agencyCenterRouter,
      ...fundCenterRouter,
      // ...newsCenterRouter,
      // ...dynamicCenterRouter,
      ...analysisCenterRouter,
      ...dashboardRouter,
      // 手机投注
      ...mobileBetCenterRouter,
      // 关于我们
      ...aboutUsRouter,
      // 活动
      ...activityRouter,
      ...gameCenterRouter,
      ...helpRouter,
      ...pointsMallRouter,
      // 资金管理
      // ...personalCenterRouter,
    ],
    // scrollBehavior (to, from, savedPosition) {
    //   if (savedPosition) {
    //     return savedPosition
    //   } else {
    //     return { x: 0, y: 0 }
    //   }
    // }
  })
}
