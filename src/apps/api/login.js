/**
 * Created by steven on 2018/1/15.
 */
export default {
  // 获得登入二维码token
  valCodeXhr ({code}, then, fail) {
    return Global.sync.axios({
      url: '/acct/imgcode/val.json',
      data: {
        code,
      },
    })
      .then(then)
      .catch(fail)
  },
  // 登录
  pushLoginInfo({username, loginPwd, param, code}, then) {
    return Global.sync.axios({
      url: '/acct/login/dologin.json',
      data: {
        username,
        loginPwd,
        param,
        code,
      },
    })
      .then(then)
  },
  // doauth接口
  getUserInfo ({token}, then) {
    return Global.sync.axios({
      url: '/acct/login/doauth.json',
      data: {
        token,
      },
    })
      .then(then)
  },
}
