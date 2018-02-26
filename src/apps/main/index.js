const App = require('./app')
const modules = require('skeleton/modules')

import {
  SlotStaticGrid,
  StaticGrid,
  SearchGrid,
  AnimatedInteger,
  XDialog,
  StatusCell,
  BusPlugin,
  CustomCheckbox,
  Popover,
  TransferDom,
} from 'build'

import store from '../store'

import MainHeader from 'skeleton/bases/header'
import NavBar from 'skeleton/bases/navbar'
import Login from 'skeleton/bases/login'
import Logout from 'skeleton/bases/login/logout'
import MainFooter from 'skeleton/bases/footer'
import ResetPwd from 'skeleton/bases/login/resetPassWord'
import LoginLauncher from 'skeleton/bases/loginLauncher'
import FreeTrial from 'skeleton/bases/freeTrial'
import DialogManage from 'skeleton/bases/dialogManage'
import GameDownLoad from 'gameCenter/downLoad'
import DesktopMessage from 'skeleton/bases/desktop-message'
// import novicePackage from 'activity/novicePackageActivity'


Object.defineProperty(Vue.prototype, '_', {value: _})
Object.defineProperty(Vue.prototype, '$', {value: $})

Vue.use(BusPlugin)
Vue.use(Popover)
Vue.component('static-grid', StaticGrid)
Vue.component('search-grid', SearchGrid)
Vue.component('slot-static-grid', SlotStaticGrid)
Vue.component('custom-checkbox', CustomCheckbox)
Vue.component('animated-integer', AnimatedInteger)
Vue.component('x-dialog', XDialog)
Vue.component('status-cell', StatusCell)
Vue.directive('TransferDom', TransferDom)

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

window.store = store
window.router = router


router.onReady(() => {
  $('body').addClass('wm-loaded')
  _.delay(() => {
    $('html').css('overflow', '')
  }, 400)
})
//每次路由变化时调用，切换显示区域
router.beforeEach((to, from, next) => {
  if (store.getters.checkPermission(to.path)) {
    next()
  } else {
    store.commit(types.TOGGLE_LOGIN_DIALOG, true)
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
        NavBar,
        MainFooter,
        Login,
        Logout,
        ResetPwd,
        LoginLauncher,
        FreeTrial,
        DialogManage,
        GameDownLoad,
        DesktopMessage
        // novicePackage,
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
          'getLoginStatus',
          'gameDownLoadStatus',
          'openDeskTopMsgStatus'
        ]),
      },
    })

    window.$route = app.$route

  })
  .done((res) => {
    if (res && res.result === 0) {
      window.store.commit(types.USER_LOGIN_SUCCESS, res.root || {})
    }
  })
