/**
 * 校验用户输入的用户名是否存在
 * @param username
 * @param then
 * @param fail
 * @returns {*|Promise.<T>}
 */
const checkNameExistApi = ({username}, then, fail) => {
  return Global.sync.axios({
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
const registerApi = ({data}, then, fail) => {
  return Global.sync.axios({
    type: 'POST',
    url: '/acct/reg/doreg.json',
    withoutToken: true,
    data,
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
  return Global.sync.axios({
    type: 'POST',
    url: '/acct/usernotice/getregadvertise.json',
    withoutToken: true,
  })
    .then(then)
    .catch(fail)
}
export {
  checkNameExistApi,
  registerApi,
  getBannerADApi
}
