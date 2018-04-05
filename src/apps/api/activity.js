const PAGESIZE = 6
const PAGEINDEX = 0

/**
 * 彩种擂台赛 - 获取代金券列表接口
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getTicketListApi = (then, fail) => {
  return $http({
    url: '/info/redpack/redActTikcets.json'
  })
    .then(then)
    .catch(fail)
}

/**
 * 彩种擂台赛 - 获取代金券接口
 * @param ticketId
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getTicketCouponApi = ({ticketId}, then, fail) => {
  return $http({
    url: '/info/redpack/getTicketCoupon.json',
    data: {
      ticketId
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 彩种擂台赛 - 获取日榜数据
 * @param then
 * @param fail
 * @returns {*}
 */
const getDailyListApi = (then, fail) => {
  return $http({
    url: '/info/redpack/dailylist.json',
  })
    .then(then)
    .catch(fail)
}

/**
 * 彩种擂台赛 - 获取周榜数据
 * @param then
 * @param fail
 * @returns {*}
 */
const getWeeklyListApi = (then, fail) => {
  return $http({
    url: '/info/redpack/weeklylist.json',
  })
    .then(then)
    .catch(fail)
}

const getYesterdayTop3Api = (then, fail) => {
  return $http({
    url: '/info/redpack/yestoday.json',
  })
    .then(then)
    .catch(fail)
}

// 老用户回归活动
/**
 * 获取回归礼包列表
 * @param then
 * @param fail
 */
const getGiftPackageListApi = (then, fail) => {
  return $http({
    url: '/info/userpack/info.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 领取回归礼包
 * @param
 * @param then
 * @param fail
 */
const getGiftPackageApi = (then, fail) => {
  return $http({
    url: '/info/userpack/doget.json'
  })
    .then(then)
    .catch(fail)
}
/**
 * 领取各种卡，需要传值resultType
 * @param resultType
 * @param then
 * @param fail
 */
const getDouseApi = ({resultType}, then, fail) => {
  return $http({
    url: '/info/userpack/douse.json',
    data:{
      resultType
    }
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取虚拟礼包数量
 * @param then
 * @param fail
 */
const getVirtualNumApi = (then, fail) => {
  return $http({
    url: '/info/userpack/giftNum.json'
  })
    .then(then)
    .catch(fail)
}
export {
  getTicketListApi,
  getTicketCouponApi,
  getDailyListApi,
  getWeeklyListApi,
  getYesterdayTop3Api,
  getGiftPackageListApi,
  getGiftPackageApi,
  getDouseApi,
  getVirtualNumApi
}



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
  // 获取新手礼包活动信息
  getNovicePackageInfo(then, fail){
    return $http({
      url: '/info/newpack/info.json',
    })
      .then(then)
      .catch(fail)
  },
  // 领取新手礼包优惠券活动信息
  doNovicePackage(then, fail){
    return $http({
      url: '/info/newpack/get.json',
    })
      .then(then)
      .catch(fail)
  },
}
