import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import bettingInfo from './modules/bettingInfo'
import rulesList from './modules/rulesList'
import bettingChoice from './modules/bettingChoice'
import bettingChase from './modules/bettingChase'

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
  },
  strict: debug,
})
