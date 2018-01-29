/**
 * Created by steven on 2018/1/22.
 */
export default {
  /**
   * 获取线路检测页URL清单
   * @param then
   * @param fail
   * @returns {*|Promise.<T>}
   */
  getServerListXhr (then, fail) {
    return $http({
      url: '/info/urls/list.json',
    })
      .then(then)
      .catch(fail)
  },
}
