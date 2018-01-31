const App = require('./app')
const modules = require('skeleton/modules')

import Vue from 'vue'
import {AnimatedInteger, XDialog, CustomCheckbox} from 'build'
import store from '../store/index'

import MainHeader from 'skeleton/bases/header'
import Login from 'skeleton/bases/login'
import Logout from 'skeleton/bases/login/logout'
import MainFooter from 'skeleton/bases/footer'
import ResetPwd from 'skeleton/bases/login/resetPassWord'
import LoginLauncher from 'skeleton/bases/loginLauncher'
import FreeTrial from 'skeleton/bases/freeTrial'
import DialogManage from 'skeleton/bases/dialogManage'


Object.defineProperty(Vue.prototype, '_', {value: _})
Object.defineProperty(Vue.prototype, '$', {value: $})

Vue.component('custom-checkbox', CustomCheckbox)
Vue.component('animated-integer', AnimatedInteger)
Vue.component('x-dialog', XDialog)

require('widgets')

window.Global = App
window.Global.Prefab = Base.Prefab
window.Global.appRouter = new Base.AppRouter()

/** **************************************************************** */
// 初始化系统级别 Modules
modules.install()
/** **************************************************************** */

const appRouters = require('./app.routers')

// 配置初始化路由（按功能模块）
const router = appRouters.install()

let desHash = window.location.hash

window.location.hash = '#/i'

window.store = store
window.router = router


router.onReady(() => {
  $('body').addClass('loaded').find('.wm-loader-wrapper').remove()
  $('.js-wrapper').removeClass('hide')
})
//每次路由变化时调用，切换显示区域
router.beforeEach((to, from, next) => {
  if (store.getters.checkPermission(to.path)) {
    let isVue = false
    _(['/bc', '/analysis', '/i', '/aa', '/mb', '/au']).each((bcRouter) => {
      if (to.path.indexOf(bcRouter) !== -1) {
        isVue = true
      }
    })
    if (to.path === '/') {
      isVue = true
    }
    if (to.path === '/bc/19') {
      isVue = false
    }
    if (!isVue && to.path !== '/i') {
      desHash = window.location.hash
      next()
      window.location.hash = '#/i'
      Global.appRouter.navigate(desHash.substring(1), {trigger: false, replace: true})
      $('#main').toggle(!isVue)
      $('#main-vue').toggle(isVue)
      return
    } else if (!isVue) {
      window.location.hash = desHash
    }
    $('#main').toggle(!isVue)
    $('#main-vue').toggle(isVue)
    next()
  } else {
    store.commit(types.TOGGLE_LOGIN_DIALOG, true)
    $('#main').toggle(false)
    $('#main-vue').toggle(true)
    next('/') // 否则全部重定向到首页
  }
})
//临时解决popover框bug
router.beforeEach((to, from, next) => {
  $('.popover').remove()
  next()
})

App.start()

// 开启菜单权限监听
Global.ui.menu.start()



// 进行系统OAuth校验

Global.m.oauth.check()
  .complete(() => {
    window.app = new Vue({
      el: '#main-wrapper',
      components: {
        MainHeader,
        MainFooter,
        Login,
        Logout,
        ResetPwd,
        LoginLauncher,
        FreeTrial,
        DialogManage
      },
      store,
      router,
      computed: {
        ...mapGetters([
          'loginDialogStatus',
          'logoutDialogStatus',
          'resetPassWordDialogStatus',
          'loginLauncherStatus',
          'freeTrialStatus',
          'getLoginStatus'
        ]),
      },
    })

    window.$route = app.$route

    _.delay(() => {
      window.location.hash = desHash === '#/i' ? '#/' : desHash
    }, 0)
  })
  .done((res) => {
    if (res && res.result === 0) {
      // /** **************************************************************** */
      // // appRouters.install()
      // /** **************************************************************** */

      // 开启oauth监听
      // Global.m.oauth.start()

      // 开启消息监听
      // Global.m.news.start()

      window.store.commit(types.USER_LOGIN_SUCCESS, res.root || {})

    }
  })
