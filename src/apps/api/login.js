/**
 * Created by steven on 2018/1/15.
 */
export default {
  // 获得登入二维码token
  valCodeXhr ({code}, then, fail) {
    return $http({
      url: '/acct/imgcode/val.json',
      data: {
        code,
      },
    })
      .then(then)
      .catch(fail)
  },
  // 登录
  pushLoginInfo({username, loginPwd, param, code}, then, fail) {
    return $http({
      url: '/acct/login/dologin.json',
      data: {
        username,
        loginPwd,
        param,
        code,
      },
    })
      .then(then)
      .catch(fail)
  },
  // 退出登录
  logout(then) {
    return $http({
      url: '/acct/login/dologout.json',
    })
      .then(then)
  },
  // 重置用户初始密码
  resetInitPwd({newPwd, userToken}, then, fail) {
    return $http({
      url: 'acct/userinfo/setloginpwd.json',
      data: {
        password: newPwd,
        token: userToken,
      }
    })
      .then(then)
      .catch(fail)
  },
  // 重置用户初始密码
  freeTrialLogin(then, fail) {
    return $http({
      url: 'acct/userinfo/setloginpwd.json',
    })
      .then(then)
      .catch(fail)
  },
}
