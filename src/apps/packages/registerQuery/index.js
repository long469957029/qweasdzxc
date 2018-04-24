import RegisterQuery from './register-query'
import store from '../../store/index'

import SyncModule from 'skeleton/modules/sync'
import UIModule from 'skeleton/modules/ui'
import DialogModule from 'skeleton/modules/ui/dialog'
import NotificationModule from "@/apps/main/skeleton/modules/ui/notification";
import MediatorModule from "@/apps/main/skeleton/modules/mediator";
import OAuthModule from "@/apps/main/skeleton/modules/oauth";
import OauthMediatorModule from "@/apps/main/skeleton/modules/mediator/oauth";
// import NewsMediatorModule from "@/apps/main/skeleton/modules/mediator/news";
import DataModule from "@/apps/main/skeleton/modules/data";

window.Global = new window.Base.Application()
window.store = store

window.Global.module('m', MediatorModule)
window.Global.module('ui', UIModule)
window.Global.module('ui.notification', NotificationModule)
window.Global.module('oauth', OAuthModule)
window.Global.module('sync', SyncModule)
window.Global.module('data', DataModule)
window.Global.module('m.oauth', OauthMediatorModule)
// window.Global.module('m.news', NewsMediatorModule)
window.Global.module('sync', SyncModule)

window.Global.module('ui.dialog', DialogModule)

  Object.defineProperty(Vue.prototype, '_', { value: _ })

  window.app = new Vue({
    template: `<register-query></register-query>`,
    components: {
      RegisterQuery
    },
    store,
    el: '#main',
  })

