const PAGESIZE = 6
const PAGEINDEX = 0

export default {
  getActivityList({ activityType = '', pageSize = PAGESIZE, pageIndex = PAGEINDEX }, then, fail) {
    return Global.sync.axios({
      url: '/info/activityCenter/list.json',
      data: {
        activityType,
        pageSize,
        pageIndex,
      },
    })
      .then(then)
      .catch(fail)
  },

  getActivityDetail({ rid = '' }, then, fail) {
    return Global.sync.axios({
      url: '/info/activityCenter/detail.json',
      data: {
        rid,
      },
    })
      .then(then)
      .catch(fail)
  },
}
