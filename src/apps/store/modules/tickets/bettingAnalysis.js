import betting from '../../../api/betting'

const initState = () => {
  return {
    coldHot: [],
    currentMiss: [],
  }
}

// getters
const getters = {
}

const getPlaySeriesId = (ticketId) => {
  let playSeriesId
  if (_.indexOf([1, 19, 27, 25, 13, 32, 19, 10, 1, 21], ticketId) !== -1) {
    playSeriesId = 20001
  } else if (_.indexOf([14, 5, 4, 11], ticketId) !== -1) {
    playSeriesId = 20013
  } else if (_.indexOf([6, 16], ticketId) !== -1) {
    playSeriesId = 20016
  } else if (_.indexOf([18], ticketId) !== -1) {
    playSeriesId = 20019
  }

  return playSeriesId
}
// actions
const actions = {
  getColdHot ({ commit }, { ticketId }) {
    betting.getColdHot(
      {
        ticketId,
        playSeriesId: getPlaySeriesId(ticketId),
      },
      (data) => { return commit(types.GET_COLD_HOT_SUCCESS, data) },
    )
  },

  getCurrentMiss ({ commit }, { ticketId }) {
    betting.getCurrentMiss(
      {
        ticketId,
        playSeriesId: getPlaySeriesId(ticketId),
      },
      (data) => { return commit(types.GET_CURRENT_MISS_SUCCESS, data) },
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
