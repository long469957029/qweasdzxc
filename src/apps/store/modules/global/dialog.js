/**
 * Created by steven on 2018/1/19.
 */
const initState = () => {
  return {
    // 定义全局显示Login弹窗属性
    openLoginDialog: false,
  }
}

// getters
const getters = {
  getLoginDialogStatus: (state) => {
    return state.openLoginDialog
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  [types.OPEN_LOGIN_DIALOG](state, data) {
    state.openLoginDialog = data
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
