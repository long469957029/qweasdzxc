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

Vue.use(VueRouter)


export const install = () => {

  const acctInfo = Global.memoryCache.get('acctInfo')
  return new VueRouter({
    // mode: 'history',
    routes: [
      ...bettingCenterRouter,
      ...userCenterRouter,
      ...vipCenterRouter,
      ...activeCenterRouter,
      ...acctInfo.userType !== 1 ? agencyCenterRouter : [],
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
      ...dashboardRouter,
    ],
    // routes: [
    //   {
    //     path: '/user/:id', component: User,
    //     children: [
    //       // 当 /user/:id 匹配成功，
    //       // UserHome 会被渲染在 User 的 <router-view> 中
    //       { path: '', component: UserHome },
    //
    //       // ...其他子路由
    //     ]
    //   }
    // ]
  })
}
