import permissions from 'apps/main/directAccess'

const initState = () => {
  return {
    // 用户余额
    balance: 0,
    betLottery: false,
    betLotteryStatus: false,
    deprecated: false,
    dividendStatus: '',
    foundsLock: false,
    // 是否配置手机号
    hasMobile: false,
    // 头像id
    headIcon: '1',
    // 是否是今天第一次登陆
    isFirstLoginToday: false,
    // 上一次登陆地址
    lastLoginAdd: '',
    // 上一次登陆IP
    lastLoginIp: '',
    // 上一次登陆时间
    lastLoginTime: '',
    // 本次登陆地点
    loginAdd: '',
    // 本次登陆IP
    loginIp: '',
    // 本次登陆时间
    loginTime: '',
    mallMemberLevel: 0,
    memberLevel: 0,
    merchant: false,
    mobileProt: false,
    newbie: true,
    outTime: 0,
    redEnvelope: false,
    token: '',
    uName: '',
    unreadNoticeListFromMobile: '',
    // 用户等级
    userGroupLevel: '',
    // 用户ID
    userId: -1,
    // 用户返点
    userRebate: 0,
    // 用户状态
    userStatus: 0,
    // 用户类型,0:代理，1:会员，2:试玩账号
    userType: 0,
    username: '',
    routers: permissions.permissionsList,
    loginOutStatus: false,
  }
}

// getters
const getters = {
  getLoginStatus: (state) => {
    return state.userId > 0
  },
  getLoginOutStatus: (state) => {
    return state.loginOutStatus
  },
  checkPermission: (state) => (path) => {
    let isPass = true
    _(state.routers).each((item) => {
      if (path.indexOf(item.path) >= 0) {
        if (item.needLogin) {
          if (state.userId > 0) {
            isPass = true
            return false
          } else {
            isPass = false
            return false
          }
        }
      }
    })
    return isPass
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  // 用户登录
  [types.USER_LOGIN_SUCCESS] (state, data) {
    Object.assign(state, data)
  },
  // 清楚用户数据
  [types.USER_CLEAR] (state) {
    Object.assign(state, initState())
  },
  [types.USER_LOGOUT_SUCCESS] (state, data) {
    Object.assign(state, initState())
    state.loginOutStatus = data
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}