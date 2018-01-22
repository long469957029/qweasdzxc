import Vue from 'vue'
import VueRouter from 'vue-router'

import dashboardRouter from 'dashboard/router'
import bettingCenterRouter from 'bettingCenter/router'
import userCenterRouter from 'userCenter/router'
// import vipCenterRouter from 'vipCenter/router'
import activeCenterRouter from 'activeCenter/router'
import realCenterRouter from 'realCenter/router'
import slotCenterRouter from 'slotCenter/router'
import fishCenterRouter from 'fishCenter/router'
import sportCenterRouter from 'sportCenter/router'
import agencyCenterRouter from 'agencyCenter/router'
import newsCenterRouter from 'newsCenter/router'
import dynamicCenterRouter from 'dynamicCenter/router'
import fundCenterRouter from 'fundCenter/router'
import helpCenterRouter from 'helpCenter/router'
import gameCenterRouter from 'gameCenter/router'
import mallCenterRouter from 'mallCenter/router'
import analysisCenterRouter from './analysisCenter/router'
import mobileBetCenterRouter from './mobileBetCenter/router'

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
      // 真人
      ...realCenterRouter,
      // 老虎机
      ...slotCenterRouter,
      ...fundCenterRouter,
      ...gameCenterRouter,
      ...sportCenterRouter,
      ...newsCenterRouter,
      ...dynamicCenterRouter,
      // 捕鱼
      ...fishCenterRouter,
      ...helpCenterRouter,
      ...mallCenterRouter,
      ...analysisCenterRouter,
      ...dashboardRouter,
      // 手机投注
      ...mobileBetCenterRouter,
    ],
  })
}
