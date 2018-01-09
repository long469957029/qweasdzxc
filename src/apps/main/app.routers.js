import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import dashboardRouter from 'dashboard/router'
import bettingCenterRouter from 'bettingCenter/router'
import userCenterRouter from 'userCenter/router'
import vipCenterRouter from 'vipCenter/router'
import activeCenterRouter from 'activeCenter/router'
import realCenterRouter from 'realCenter/router'
import slotCenterRouter from 'slotCenter/router'

// const fishCenterRouter = require('fishCenter/router')
// const sportCenterRouter = require('sportCenter/router')
// const agencyCenterRouter = require('agencyCenter/router')
// const fundCenterRouter = require('fundCenter/router')
// const newsCenterRouter = require('newsCenter/router')
// const dynamicCenterRouter = require('dynamicCenter/router')
// const helpCenterRouter = require('helpCenter/router')
// const gameCenterRouter = require('gameCenter/router')
// const mallCenterRouter = require('mallCenter/router')

export const install = () => {

  const acctInfo = Global.memoryCache.get('acctInfo')
  // dashboardRouter.install()
  // // accountCenterRouter.install()
  // activeCenterRouter.install()
  // // 0是代理，1是玩家，玩家不显示代理中心
  // if (acctInfo.userType !== 1) {
  //   agencyCenterRouter.install()
  // }
  // // 真人视讯大厅
  // realCenterRouter.install()
  // // 电子游戏大厅
  // slotCenterRouter.install()
  // // 捕鱼游戏大厅
  // fishCenterRouter.install()
  // // 体育游戏大厅
  // sportCenterRouter.install()
  // fundCenterRouter.install()
  // userCenterRouter.install()
  // vipCenterRouter.install()
  // // require.ensure([], function(require) {
  // // })
  // newsCenterRouter.install()
  // dynamicCenterRouter.install()
  // helpCenterRouter.install()
  // gameCenterRouter.install()
  // mallCenterRouter.install()

  return new VueRouter({
    // mode: 'history',
    routes: [
      ...bettingCenterRouter,
      ...userCenterRouter,
      ...vipCenterRouter,
      ...activeCenterRouter,
      ...realCenterRouter,
      ...slotCenterRouter,
      ...dashboardRouter,
    ]
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
