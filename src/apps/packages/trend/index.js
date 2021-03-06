import MainTrend from './main-trend'
import CustomCheckbox from 'com/custom-checkbox'
import store from '../../store/index'

import SyncModule from 'skeleton/modules/sync'
import OauthMediatorModule from 'skeleton/modules/mediator/oauth'
import OAuthModule from 'skeleton/modules/oauth'
import MediatorModule from 'skeleton/modules/mediator'
import UIModule from 'skeleton/modules/ui'
import NotificationModule from 'skeleton/modules/ui/notification'
import DialogModule from 'skeleton/modules/ui/dialog'
import '../misc/common.scss'

window.Global = new window.Base.Application()
window.store = store

window.Global.module('m', MediatorModule)
window.Global.module('ui', UIModule)
window.Global.module('ui.notification', NotificationModule)
window.Global.module('oauth', OAuthModule)
window.Global.module('sync', SyncModule)
window.Global.module('m.oauth', OauthMediatorModule)
window.Global.module('ui.dialog', DialogModule)

Global.m.oauth.checkLogin().done(() => {
  Object.defineProperty(Vue.prototype, '_', { value: _ })

  Vue.component('custom-checkbox', CustomCheckbox)

  window.app = new Vue({
    template: `<main-trend></main-trend>`,
    components: {
      MainTrend
    },
    store,
    el: '#main',
  })
});

