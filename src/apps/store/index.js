import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import bettingInfo from './modules/tickets/bettingInfo'
import rulesList from './modules/tickets/rulesList'
import bettingChoice from './modules/tickets/bettingChoice'
import bettingChase from './modules/tickets/bettingChase'
import bettingAnalysis from './modules/tickets/bettingAnalysis'
import topTickets from './modules/tickets/topTickets'
import loginStore from './modules/acct/loginStore'
import components from './modules/global/components'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    bettingInfo,
    rulesList,
    bettingChoice,
    bettingChase,
    bettingAnalysis,
    topTickets,
    loginStore,
    components,
  },
  strict: debug,
})
