import permissions from 'apps/main/directAccess'
import avatarConfig from 'userCenter/misc/avatarConfig'
import login from 'api/login'

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
    fBalance: 0,
    fLastLoginTime: '',
    fLoginTime: '',
    vip: '',
    userSecurityInfo: [],
  }
}

// getters
const getters = {
  userAvatar: (state) => {
    let headIcon = state.headIcon ? state.headIcon : '1'
    return avatarConfig.get(headIcon.toString()).logo
  },
  username: (state) => {
    return state.uName ? state.uName : state.username
  },
  getLoginStatus: (state) => {
    return state.userId > 0
  },
  isLogin: (state) => {
    return state.userId > 0
  },
  getUserInfo: (state) => {
    return state
  },
  getUserType: (state) => {
    return state.userType === 0
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
  userSecurityInfo: (state) => {
    return state.userSecurityInfo
  },
}

// actions
const actions = {
  [types.DO_LOGOUT]({commit}) {
    login.logout(({data}) => {
      return commit(types.USER_LOGOUT_SUCCESS, data)
    })
  },

  [types.CHECK_LOGIN_STATUS]({commit}) {
    return new Promise((resolve, reject) => {
      login.oauthCheckApi(({data}) => {
        resolve(data)
        if (data && data.result === 0) {
          return commit(types.USER_OAUTH_SUCCESS, data.root)
        }
      }, () => {
        reject()
      })
    })
  },
}

// mutations
const mutations = {
  // 用户登录成功
  [types.USER_LOGIN_SUCCESS](state, data) {
    Global.memoryCache.set('authorizeChecking', false)//点击确定后才允许重新弹窗
    this.commit(types.USER_OAUTH_SUCCESS, data)
    this.commit(types.USER_IS_VIP, data.vip)
    window.Global.m.publish('acct:login', data)//todo 待确认是否可以从USER_OAUTH_SUCCESS转移到此处
    // 开启oauth监听
    window.Global.m.oauth.start()
    // 开启消息监听
    window.Global.m.news.start()

    Object.assign(state, data)

    Global.m.oauth.check()

    this.commit(types.TRACKING_USER)
  },

  [types.TRACKING_USER](state) {
    //tracking users
    Raven.setUserContext(state)
  },

  // 用户oauth确认成功
  [types.USER_OAUTH_SUCCESS](state, data) {
    Global.memoryCache.set('authorizeChecking', false)//点击确定后才允许重新弹窗
    window.Global.memoryCache.set('acctInfo', data)
    window.Global.cookieCache.set('token', data.token, 160)

    window.Global.m.publish('acct:updating', data)

    data.fBalance = data.balance === 0 ? _(data.balance).convert2yuan({
      fixed: 2,
      clear: false
    }) : _(data.balance).convert2yuan()
    data.fLastLoginTime = _(data.lastLoginTime).toTime()
    data.fLoginTime = _(data.loginTime).toTime()
    data.headIcon = _(data.headIcon).toString()
    this.commit(types.TOGGLE_LOGOUT_NOTICE, false)
    Object.assign(state, data)

    this.commit(types.TRACKING_USER)
  },

  // 清除用户数据
  [types.USER_CLEAR](state) {
    Object.assign(state, initState())
    Global.cookieCache.clear('token')
    Global.cookieCache.clear('loginState')
    Global.cookieCache.clear('security')
    Global.cookieCache.clear('isTestUser')
    Global.cookieCache.clear('userBindInfo')
    // 关闭oauth轮询监听
    if(window.Global.m ){
      window.Global.m.publish('acct:loginOut')
      if(window.Global.m.oauth) {
        // 关闭oauth轮询监听
        window.Global.m.oauth.stop()
      }
      if(window.Global.m.news){
        // 关闭消息监听
        window.Global.m.news.stop()
      }
    }
    this.commit(types.TOGGLE_LOGOUT_DIALOG, false)
    this.commit(types.USER_IS_VIP, 0)
  },
  [types.USER_LOGOUT_SUCCESS](state, data) {
    if (data && data.result === 0) {
      Object.assign(state, initState())
      Global.cookieCache.clear('token')
      Global.cookieCache.clear('loginState')
      Global.cookieCache.clear('security')
      Global.cookieCache.clear('isTestUser')
      Global.cookieCache.clear('userBindInfo')
      window.Global.m.publish('acct:loginOut')
      // 关闭oauth轮询监听
      window.Global.m.oauth.stop()
      // 开启消息监听
      window.Global.m.news.stop()
      this.commit(types.TOGGLE_LOGOUT_DIALOG, false)
      this.commit(types.USER_IS_VIP, 0)
      let hash = window.location.hash
      let ind = hash.indexOf('?')
      hash = hash.substring(1, ind > 0 ? ind : hash.length)
      if (data.popupLogin) {
        window.router.push(hash + '?popupLogin=true')
      } else {
        window.router.push(hash)
      }
      window.location.reload()
    }
  },
  [types.TOGGLE_DO_LOGOUT](state, data) {
    state.loginOutStatus = data
  },
  [types.USER_SECURITY_INFO](state, data) {
    state.userSecurityInfo = data
  },

  [types.SEND_USER_INFO](state, data) {
    const findIP = new Promise(r=>{var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}})

    /*Usage example*/
    findIP.then(ip => {
      Raven.setUserContext({
        ip: ip,
        url: window.document.location.href
      })
      Raven.captureMessage('UserInfo', {
        level: 'info'
      })
    })

  }
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
