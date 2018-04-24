/**
 * Created by steven on 2018/1/22.
 */

/**
 * 获取线路检测页URL清单
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getServerListApi = (then, fail) => {
  return $http({
    url: '/info/urls/list.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 第三方游戏下载页，判断是否需要系统提供账号
 * @param channelId
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getDownGameUserInfo = ({channelId},then,fail) => {
  return $http({
    url: '/info/game/userInfo.json',
    data:{
      channelId
    }
  })
    .then(then)
    .catch(fail)
}
/**
 * 保存第三方账号密码，需要传游戏id（channelId）
 * @param channelId
 * @param pwd
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const saveDownGamePwd = ({channelId,password}, then, fail) => {
  return $http({
    url: '/info/game/changePassword.json',
    data:{
      channelId,
      password
    }
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取特定注册ID下的用户
 * * @param linkId
 * @param username
 * @param mobile
 * @param qq
 * @param wechat
 * @param time
 * @param pageSize
 * @param pageIndex
 * @param mobile
 * @param qq
 * @returns {*|Promise<T>}
 */
const getSpecialRegisterIdUserListApi = ({linkId,username, mobile, qq,wechat,time,pageSize,pageIndex},then,fail) => {
  return $http({
    url: '/acct/reg/linkRegUserList.json',
    data: {
      linkId,
      username,
      mobile,
      qq,
      wechat,
      time,
      pageSize,
      pageIndex
    }
  })
    .then(then)
    .catch(fail)
}
export {
  getServerListApi,
  getDownGameUserInfo,
  saveDownGamePwd,
  getSpecialRegisterIdUserListApi
}
