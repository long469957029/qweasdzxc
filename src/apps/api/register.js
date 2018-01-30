/**
 * 校验用户输入的用户名是否存在
 * @param username
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const checkNameExistApi = ({username}, then, fail) => {
  return $http({
    type: 'POST',
    url: '/acct/reg/userexist.json',
    withoutToken: true,
    data:{
      username
    },
  })
    .then(then)
    .catch(fail)
}

/**
 * 注册api
 * @param data
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const registerApi = ({userName,loginPwd,linkId}, then, fail) => {
  return $http({
    type: 'POST',
    url: '/acct/reg/doreg.json',
    withoutToken: true,
    data:{
      userName,
      loginPwd,
      linkId
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取广告banner配置
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const getBannerADApi = (then, fail) => {
  return $http({
    type: 'POST',
    url: '/acct/usernotice/getregadvertise.json',
    withoutToken: true,
  })
    .then(then)
    .catch(fail)
}
/**
 * 注册页统计接口
 * @param linkId
 * @param then
 * @param fail
 * @returns {Promise.<T>|*}
 */
const sendLinkViewApi = ({linkId},then, fail) => {
  return $http({
    url: '/acct/reg/linkView.json',
    data: {
      linkId
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 校验linkId类型，普通or红包
 * @param linkId
 * @param type
 * @param then
 * @param fail
 * @returns {Promise.<T>|*}
 */
const checkLinkTypeApi = ({linkUrl,type = 0},then,fail) => {
  return $http({
    url: '/acct/reg/viewType.json',
    data: {
      linkUrl,
      type
    },
    withoutToken: true,
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取红包金额
 * @param linkId
 * @param then
 * @param fail
 * @returns {Promise.<T>|*}
 */
const recieveRedpackApi = ({linkId},then, fail) => {
  return $http({
    type: 'POST',
    url: '/acct/reg/linkRedpack.json',
    withoutToken: true,
    data:{
      linkId
    }
  })
    .then(then)
    .catch(fail)
}
export {
  checkNameExistApi,
  registerApi,
  getBannerADApi,
  sendLinkViewApi,
  checkLinkTypeApi,
  recieveRedpackApi
}
