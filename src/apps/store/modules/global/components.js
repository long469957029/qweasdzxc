/**
 * Created by steven on 2018/1/19.
 */

const initState = () => {
  return {
    // 定义全局显示弹窗属性
    openLoginDialog: false,
    openLogoutDialog: false,
    openResetPassWordDialog: false,
    openLoginLauncher: false,
  }
}

// getters
const getters = {
  loginDialogStatus: (state) => {
    return state.openLoginDialog
  },
  logoutDialogStatus: (state) => {
    return state.openLogoutDialog
  },
  resetPassWordDialogStatus: (state) => {
    return state.openResetPassWordDialog
  },
  loginLauncherStatus: (state) => {
    return state.openLoginLauncher
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  [types.TOGGLE_LOGIN_DIALOG](state, data) {
    state.openLoginDialog = data
  },

  [types.TOGGLE_LOGOUT_DIALOG](state, data) {
    state.openLogoutDialog = data
  },
  [types.TOGGLE_RESET_PASSWORD_DIALOG](state, data) {
    state.openResetPassWordDialog = data
  },
  [types.TOGGLE_LOGIN_LAUNCHER](state, data) {
    state.openLoginLauncher = data
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
