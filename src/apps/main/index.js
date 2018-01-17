const App = require('./app')
const modules = require('skeleton/modules')

import Vue from 'vue'
import AnimatedInteger from 'com/animated-integer'
import store from '../store/index'

import MainHeader from 'skeleton/bases/header/index'
import whiteList from './directAccess'

<<<<<<< HEAD
Object.defineProperty(Vue.prototype, '_', { value: _ })
=======
Object.defineProperty(Vue.prototype, '_', {value: _})
>>>>>>> e38fed3a8a08d392f948076285c4d29cd686ed9c

Vue.component('animated-integer', AnimatedInteger)

require('widgets')

window.Global = App
window.Global.Prefab = Base.Prefab
window.Global.appRouter = new Base.AppRouter()

/** **************************************************************** */
// 初始化系统级别 Modules
modules.install()
/** **************************************************************** */

const appRouters = require('./app.routers')

// 因应二号改版 验证机制不同 可以新增一个新的 userType 作为游客
// Global.memoryCache.set('acctInfo', { userType: 1 })

// 配置初始化路由（按功能模块）
const router = appRouters.install()


const desHash = window.location.hash

window.location.hash = '#/i'

window.app = new Vue({
  el: '#main-wrapper',
  components: {
    MainHeader,
  },
  store,
  router,
})

_.delay(() => {
  window.location.hash = desHash === '#/i' ? '#/' : desHash
}, 0)

window.store = store
window.router = router
window.$route = app.$route

//每次路由变化是调用，切换显示区域
router.beforeEach((to, from, next) => {
  let isVue = false
  _(['/bc', '/analysis']).each((bcRouter) => {
    if (to.path.indexOf(bcRouter) !== -1) {
      isVue = true
    }
  })
  if (to.path === '/bc/19') {
    isVue = false
  }
  $('#main').toggle(!isVue)
  $('#main-vue').toggle(isVue)
  next()
  // // 判断用户是否登录
  // if (store.getters.getLoginStatus) {
  //   // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
  //   // 这种情况出现在手动修改地址栏地址时
  //   if (to.path === 'index.html') {
  //     router.replace('')
  //   } else {
  //     // 如果跳转页面存在于路由中则进入，否则跳转到404
  //     // 因为可以通过改变url值进行访问，所以必须有该判断
  //     if (to.matched.length) {
  //       if (whiteList.indexOf(to.path) < 0) {
  //         // store.dispatch('user/actionlog', to)
  //       }
  //       let isVue = false
  //       _(['/bc', '/analysis']).each((bcRouter) => {
  //         if (to.path.indexOf(bcRouter) !== -1) {
  //           isVue = true
  //         }
  //       })
  //       if (to.path === '/bc/19') {
  //         isVue = false
  //       }
  //       $('#main').toggle(!isVue)
  //       $('#main-vue').toggle(isVue)
  //       next()
  //     } else {
  //       router.replace('')
  //     }
  //   }
  // } else {
  //   // 如果是免登陆的页面则直接进入，否则跳转到登录页面
  //   if (whiteList.indexOf(to.path) >= 0) {
  //     // console.log('该页面无需登录即可访问')
  //     let isVue = false
  //     _(['/bc', '/analysis']).each((bcRouter) => {
  //       if (to.path.indexOf(bcRouter) !== -1) {
  //         isVue = true
  //       }
  //     })
  //
  //     if (to.path === '/bc/19') {
  //       isVue = false
  //     }
  //     $('#main').toggle(!isVue)
  //     $('#main-vue').toggle(isVue)
  //     next()
  //   } else {
  //     // console.log('请重新登录')
  //     router.replace('')
  //   }
  // }
})
App.start()

// 进行系统OAuth校验
Global.m.oauth.check().done((res) => {
  if (res && res.result === 0) {
    // /** **************************************************************** */
    // // appRouters.install()
    // /** **************************************************************** */

    // 开启oauth监听
    Global.m.oauth.start()

    // 开启消息监听
    Global.m.news.start()

    // 开启菜单权限监听
    // Global.ui.menu.start()
  }
})
