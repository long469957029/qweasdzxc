const PAGESIZE = 6
const PAGEINDEX = 0

export default {
  getActivityList({activityType = '', pageSize = PAGESIZE, pageIndex = PAGEINDEX}, then, fail) {
    return $http({
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

  getActivityDetail({rid = ''}, then, fail) {
    return $http({
      url: '/info/activityCenter/detail.json',
      data: {
        rid,
      },
    })
      .then(then)
      .catch(fail)
  },
  // 获取冲量活动信息
  getRechargeSalesInfo(then, fail){
    return $http({
      url: '/info/agentsalesactivity/info.json',
    })
      .then(then)
      .catch(fail)
  },
  // 领取冲量活动奖励
  doRechargeSalesPlan({cycle},then, fail){
    return $http({
      url: '/info/agentsalesactivity/doget.json',
      data:{
        cycle:cycle,
      }
    })
      .then(then)
      .catch(fail)
  },
  // 获取投注计划活动信息
  getBetPlanInfo(then, fail){
    return $http({
      url: '/info/bettarget/info.json',
    })
      .then(then)
      .catch(fail)
  },
}
