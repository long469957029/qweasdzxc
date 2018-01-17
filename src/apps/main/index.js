const App = require('./app')
const modules = require('skeleton/modules')

import Vue from 'vue'
import AnimatedInteger from 'com/animated-integer'
import store from '../store/index'

import MainHeader from 'skeleton/bases/header/index'

Object.defineProperty(Vue.prototype, '_', { value: _ })

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

const router = appRouters.install()

// 每次路由变化是调用，切换显示区域
router.beforeEach((to, from, next) => {
  let isVue = false

  _(['/bc', '/i', '/analysis']).each(function(router) {
    if (to.path.indexOf(router) !== -1) {
      isVue = true
    }
  })

  if (to.path === '/') {
    isVue = true
  }

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

window.router = router
window.$route = app.$route



// Global.m.oauth.start()
// App.start()

// 进行系统OAuth校验
Global.m.oauth.check().done((res) => {
  if (res && res.result === 0) {
    /** **************************************************************** */
    // 配置初始化路由（按功能模块）
    appRouters.install()
    /** **************************************************************** */

    // 开启oauth监听
    Global.m.oauth.start()

    // 开启消息监听
    Global.m.news.start()

    // 开启菜单权限监听
    Global.ui.menu.start()

    // 开启下雨活动监听
    // Global.m.volcanicActivity.start();
    // Global.m.rainActivity.start();

    // 开启摇钱树活动监听
    // Global.m.treeActivity.start();

    // 开启踩彩财活动监听
    // Global.m.treadActivity.start();

    App.start()
  }
})
