import {getColdHotApi, getCurrentMissApi} from 'api/betting'

const initState = () => {
  return {
    coldHot: [],
    currentMiss: [],
  }
}

// getters
const getters = {
}

// actions
const actions = {
  [types.GET_COLD_HOT] ({ commit }, { ticketId, playSeriesId, isOfficial, type = 'normal'}) {
    this.commit(types.CHECK_OUT_COLD_HOT)
    getColdHotApi(
      {
        ticketId,
        playSeriesId,
        isOfficial,
        type
      },
      (data) => { return commit(types.GET_COLD_HOT_SUCCESS, data) },
    )
  },

  [types.GET_CURRENT_MISS] ({ commit }, { ticketId, playSeriesId, isOfficial, type = 'normal' }) {
    this.commit(types.CHECK_OUT_CURRENT_MISS)
    getCurrentMissApi(
      {
        ticketId,
        playSeriesId,
        isOfficial,
        type
      },
      (data) => { return commit(types.GET_CURRENT_MISS_SUCCESS, data) }
    )
  },
}

const formatNum = (list) => {
  return _.chain(list).map((row) => {
    const max = _.max(row)
    const min = _.min(row)

    return _.map(row, (num) => {
      const item = {
        num,
        style: '',
      }
      if (num === max) {
        item.style = 'max'
      }
      if (num === min) {
        item.style = 'min'
      }

      return item
    })
  }).value()
}

// mutations
const mutations = {
  [types.CHECK_OUT_COLD_HOT] (state) {
    state.coldHot = []
  },
  [types.CHECK_OUT_CURRENT_MISS] (state) {
    state.currentMiss = []
  },
  [types.GET_COLD_HOT_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      state.coldHot = formatNum(res.root || [])
    }
  },

  [types.GET_CURRENT_MISS_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      state.currentMiss = formatNum(res.root || [])
    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
