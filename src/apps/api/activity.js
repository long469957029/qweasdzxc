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
  doRechargeSalesPlan({cycle}, then, fail){
    return $http({
      url: '/info/agentsalesactivity/doget.json',
      data: {
        cycle: cycle,
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
  // 领取投注计划活动信息
  doBetPlan({index}, then, fail){
    return $http({
      url: '/info/bettarget/doget.json',
      data: {
        index: index
      }
    })
      .then(then)
      .catch(fail)
  },
  // 获取福利制度活动信息
  getWelfareSharingPlanInfo(then, fail){
    return $http({
      url: '/info/ladder/info.json',
    })
      .then(then)
      .catch(fail)
  },
  // 福利计算器
  curWelfare({amount,profit}, then, fail){
    return $http({
      url: '/info/ladder/cal.json',
      data: {
        betAmount: amount,
        profit:profit,
      }
    })
      .then(then)
      .catch(fail)
  },
  // 领取福利制度活动奖励
  doWelfareSharingPlan(then, fail){
    return $http({
      url: '/info/ladder/get.json',
    })
      .then(then)
      .catch(fail)
  },
  // 获取充值计划活动信息
  getRechargePlanInfo(then, fail){
    return $http({
      url: '/info/rechargetarget/info.json',
    })
      .then(then)
      .catch(fail)
  },
  // 领取充值计划活动信息
  doRechargePlan({index}, then, fail){
    return $http({
      url: '/info/rechargetarget/doget.json',
      data: {
        index: index
      }
    })
      .then(then)
      .catch(fail)
  },
}
