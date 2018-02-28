import VueRouter from 'vue-router'

import dashboardRouter from './dashboard/router'
import bettingCenterRouter from './betting-center/router'
import userCenterRouter from './userCenter/router'
import activityRouter from './activity/router'

import activeCenterRouter from './activeCenter/router'
import pointsMallRouter from './points-mall/router'

// import realCenterRouter from 'realCenter/router'
// import slotCenterRouter from 'slotCenter/router'
// import fishCenterRouter from 'fishCenter/router'
// import sportCenterRouter from 'sportCenter/router'
import agencyCenterRouter from 'agencyCenter/router'
// import newsCenterRouter from 'newsCenter/router'
// import dynamicCenterRouter from 'dynamicCenter/router'
import fundCenterRouter from 'fundCenter/router'
import gameCenterRouter from 'gameCenter/router'
import analysisCenterRouter from './analysisCenter/router'
import mobileBetCenterRouter from './mobileBetCenter/router'
import aboutUsRouter from './aboutUs/router'
import helpRouter from './help-center/router'

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
    ],
  })
}
