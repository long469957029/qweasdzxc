import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mark6 from './modules/tickets/mark6'
import bettingInfo from './modules/tickets/bettingInfo'
import rulesList from './modules/tickets/rulesList'
import bettingChoice from './modules/tickets/bettingChoice'
import bettingChase from './modules/tickets/bettingChase'
import bettingAnalysis from './modules/tickets/bettingAnalysis'
import bettingVouchers from './modules/tickets/bettingVouchers'
import topTickets from './modules/tickets/topTickets'
import loginStore from './modules/acct/loginStore'
import mallInfo from './modules/acct/mall-info'
import components from './modules/global/components'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  actions,
  getters,
  modules: {
    bettingInfo,
    rulesList,
    bettingChoice,
    bettingChase,
    bettingAnalysis,
    bettingVouchers,
    topTickets,
    loginStore,
    mark6,
    mallInfo,
    components,
  },
  strict: debug,
})

if (module.hot) {
  module.hot.accept([
    './actions',
    './getters',
    './modules/tickets/bettingInfo',
    './modules/tickets/rulesList',
    './modules/tickets/bettingChoice',
    './modules/tickets/bettingChase',
    './modules/tickets/bettingAnalysis',
    './modules/tickets/bettingVouchers',
    './modules/tickets/topTickets',
    './modules/tickets/mark6',
    './modules/acct/loginStore',
    './modules/acct/mall-info',
    './modules/global/components',
  ], () => {
    const actions = require('./actions').default
    const getters = require('./getters').default
    const bettingInfo = require('./modules/tickets/bettingInfo').default
    const rulesList = require('./modules/tickets/rulesList').default
    const bettingChoice = require('./modules/tickets/bettingChoice').default
    const bettingChase = require('./modules/tickets/bettingChase').default
    const bettingAnalysis = require('./modules/tickets/bettingAnalysis').default
    const bettingVouchers = require('./modules/tickets/bettingVouchers').default
    const topTickets = require('./modules/tickets/topTickets').default
    const mark6 = require('./modules/tickets/mark6').default
    const loginStore = require('./modules/acct/loginStore').default
    const mallInfo = require('./modules/acct/mall-info').default
    const components = require('./modules/global/components').default

    store.hotUpdate({
      actions,
      getters,
      modules: {
        bettingInfo,
        rulesList,
        bettingChoice,
        bettingChase,
        bettingAnalysis,
        bettingVouchers,
        topTickets,
        mark6,
        loginStore,
        mallInfo,
        components,
      }
    })
  })
}

export default store
