import MainTrend from './main-trend'
import SyncModule from 'skeleton/modules/sync'
import CustomCheckbox from 'com/custom-checkbox'
// import './index.scss';

Object.defineProperty(Vue.prototype, '_', { value: _ })

window.Global = new window.Base.Application()

window.Global.module('sync', SyncModule)

Vue.component('custom-checkbox', CustomCheckbox)

window.app = new Vue({
  template: `<div><main-trend></main-trend></div>`,
  components: {
    MainTrend
  },
  el: '#main',
})

