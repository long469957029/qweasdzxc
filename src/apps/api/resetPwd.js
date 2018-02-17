/**
 * 获取验证码
 * @param code
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const valCodeXhr = ({code}, then, fail) => {
  return $http({
    url: '/acct/imgcode/val.json',
    data: {
      code,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 校验用户名及验证码
 * @param username
 * @param verifyCode
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const verifyUserNameXhr = ({username, verifyCode}, then, fail) => {
  return $http({
    url: '/acct/login/verifyusername.json',
    data: {
      username,
      verifyCode,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取密保问题
 * @param username
 * @param loginToken
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getSecurityQuestionXhr = ({username, loginToken}, then, fail) => {
  return $http({
    url: '/acct/usersecurity/getUserQesForLoginPwd.json',
    data: {
      username,
      loginToken,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 验证用户输入的密码问题
 * @param username
 * @param loginToken
 * @param secrityList
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const verifySecurityQuestionXhr = ({username, loginToken, secrityList}, then, fail) => {
  return $http({
    url: '/acct/usersecurity/verqesforloginpwd.json',
    data: {
      secrityList,
      username,
      loginToken,
    },
    tradition:true
  })
    .then(then)
    .catch(fail)
}
/**
 * 发送短信验证码
 * @param token
 * @param username
 * @param type
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const setSmscodeXhr = ({url, token,username,type = 6}, then, fail) => {
  return $http({
    url,
    data: {
      token,
      username,
      type,
    }
  })
    .then(then)
    .catch(fail)
}
/**
 * 验证短信验证码
 * @param token
 * @param username
 * @param type  6 在找回密码中用
 * @param code
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const verifyCodeXhr = ({url,token,username,type = 6, code}, then, fail) => {
  return $http({
    url,
    data: {
      token,
      username,
      type,
      code
    }
  })
    .then(then)
    .catch(fail)
}
/**
 * 重置登录密码
 * @param loginPwd
 * @param username
 * @param loginToken
 * @param then
 * @param fail
 * @returns {Promise.<T>|*}
 */
const resetLoginPwd = ({loginPwd,username,loginToken}, then, fail) => {
  return $http({
    url: '/acct/userinfo/resetloginpwd.json',
    data: {
      loginPwd,
      username,
      loginToken
    }
  })
    .then(then)
    .catch(fail)
}

export {
  valCodeXhr,
  verifyUserNameXhr,
  getSecurityQuestionXhr,
  verifySecurityQuestionXhr,
  setSmscodeXhr,
  verifyCodeXhr,
  resetLoginPwd
}
