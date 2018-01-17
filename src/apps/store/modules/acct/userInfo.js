import loginApi from '../../../api/login'

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
    userId: '',
    // 用户返点
    userRebate: 0,
    // 用户状态
    userStatus: 0,
    // 用户类型
    userType: 0,
    username: '',
  }
}

// getters
const getters = {}

// actions
const actions = {
  getUserInfo ({commit}, {token}) {
    // commit(types.CHECKOUT_TICKET_INFO)
    return loginApi.getUserInfo(
      {
        token,
      },
      ({data}) => {
        return commit(types.USER_LOGIN_SUCCESS, data)
      },
    )
  },
}

// mutations
const mutations = {
  [types.USER_LOGIN_SUCCESS] (state, data) {
    Object.assign(state, data)
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
