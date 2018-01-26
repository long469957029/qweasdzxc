import ResetInitPwd from './reset-init-pwd'
import store from '../../store/index'

import SyncModule from 'skeleton/modules/sync'
import MediatorModule from 'skeleton/modules/mediator'
import UIModule from 'skeleton/modules/ui'
import DialogModule from 'skeleton/modules/ui/dialog'

window.Global = new window.Base.Application()
window.store = store

window.Global.module('m', MediatorModule)
window.Global.module('ui', UIModule)
window.Global.module('sync', SyncModule)
window.Global.module('ui.dialog', DialogModule)

  Object.defineProperty(Vue.prototype, '_', { value: _ })

  window.app = new Vue({
    template: `<div><reset-init-pwd></reset-init-pwd></div>`,
    components: {
      ResetInitPwd
    },
    store,
    el: '#main',
  })

