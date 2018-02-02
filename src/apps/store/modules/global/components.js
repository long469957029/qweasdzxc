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
    openFreeTrialDialog: false,
    openGameDownLoadDialog: false,
    token: '',
    gameDownLoadId:''
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
  freeTrialStatus: (state) => {
    return state.openFreeTrialDialog
  },
  userToken: (state) => {
    return state.token
  },
  gameDownLoadStatus: (state) => {
    return state.openGameDownLoadDialog
  },
  gameDownLoadGameId: (state) => {
    return state.gameDownLoadId
  }
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
  [types.TOGGLE_FREE_TRIAL](state, data) {
    state.openFreeTrialDialog = data
  },
  [types.TOGGLE_RESET_INIT_PWD](state, data) {
    state.openRestInitPwdDialog = data
  },
  [types.COMMIT_USER_TOKEN](state, data) {
    state.token = data
  },
  [types.TOGGLE_GMAE_DOWN_LOAD](state, {showDialog, gameId = 1}) {
    state.openGameDownLoadDialog = showDialog
    state.gameDownLoadId = gameId
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
