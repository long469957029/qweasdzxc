import MainChange from './main-change'
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
    template: `<main-change></main-change>`,
    components: {
      MainChange
    },
    store,
    el: '#main',
  })

