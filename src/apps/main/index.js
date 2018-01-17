const App = require('./app')
const modules = require('skeleton/modules')

import Vue from 'vue'
import AnimatedInteger from 'com/animated-integer'
import store from '../store/index'

import MainHeader from 'skeleton/bases/header/index'

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

//每次路由变化是调用，切换显示区域
router.beforeEach((to, from, next) => {
  let isVue = false

  _(['/bc', '/analysis']).each(function (router) {
    if (to.path.indexOf(router) !== -1) {
      isVue = true
    }
  })

  if (to.path === '/bc/19') {
    isVue = false
  }

  $('#main').toggle(!isVue)
  $('#main-vue').toggle(isVue)

  next()
})

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
