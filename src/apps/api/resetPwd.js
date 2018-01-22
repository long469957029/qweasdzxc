export default {
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
  verifyUserNameXhr ({username,verifyCode},then,fail) {
    return Global.sync.axios({
      url: '/acct/login/verifyusername.json',
      data: {
        username,
        verifyCode,
      },
    })
      .then(then)
      .catch(fail)
  },
  getSecurityQuestionXhr ({username,loginToken}, then, fail){
    return Global.sync.axios({
      url: '/acct/usersecurity/getqesforloginpwd.json',
      data: {
        username,
        loginToken,
      },
    })
      .then(then)
      .catch(fail)
  }
}
