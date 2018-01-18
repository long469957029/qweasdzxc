import Vue from 'vue'
import VueRouter from 'vue-router'

import dashboardRouter from 'dashboard/router'
import bettingCenterRouter from 'bettingCenter/router'
import userCenterRouter from 'userCenter/router'
import vipCenterRouter from 'vipCenter/router'
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

Vue.use(VueRouter)


export const install = () => {

  // const acctInfo = Global.memoryCache.get('acctInfo')
  return new VueRouter({
    // mode: 'history',
    routes: [
      ...bettingCenterRouter,
      ...userCenterRouter,
      ...vipCenterRouter,
      ...activeCenterRouter,
      // ...acctInfo.userType !== 1 ? agencyCenterRouter : [],
      ...agencyCenterRouter,
      ...realCenterRouter,
      ...slotCenterRouter,
      ...fundCenterRouter,
      ...gameCenterRouter,
      ...sportCenterRouter,
      ...newsCenterRouter,
      ...dynamicCenterRouter,
      ...fishCenterRouter,
      ...helpCenterRouter,
      ...mallCenterRouter,
      ...analysisCenterRouter,
      ...dashboardRouter,
    ],
  })
}
