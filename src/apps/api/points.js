/**
 * 商城首页banner list
 * @author polo
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getMallBannerApi = (then, fail) => {
  return $http({
    url: '/acct/usernotice/getMallAdvertise.json',
  })
    .then(then)
    .catch(fail)
}

/**
 * 取得用户积分商城信息
 * @author polo
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getUserMallInfoApi = (then, fail) => {
  return $http({
    url: '/mall/integral/info.json',
  })
    .then(then)
    .catch(fail)
}

/**
 * 取得优惠券
 * @author polo
 * @param couponType
 * @param couponStatus
 * @param sortFlag
 * @param sortType
 * @param pageSize
 * @param pageIndex
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getCouponListApi = ({couponType, couponStatus, sortFlag, sortType, pageSize = 12, pageIndex = 0}, then, fail) => {
  return $http({
    url: '/mall/coupon/couponList.json',
    data: {
      couponType,
      couponStatus,
      sortFlag,
      sortType,
      pageSize,
      pageIndex,
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 兑换券
 * @author polo
 * @param couponId - 券id
 * @param then
 * @param fail
 * @returns {*}
 */
const exchangeCouponListApi = ({couponId}, then, fail) => {
  return $http({
    url: '/mall/coupon/exchange.json',
    data: {
      couponId
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * @brief 积分商城 礼物兑换
 * @author polo
 * @param itemType
 * @param itemStatus
 * @param sortFlag
 * @param sortType
 * @param pageSize
 * @param pageIndex
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getGiftListApi = ({
                          itemType,
                          itemStatus,
                          sortFlag,
                          sortType,
                          pageSize = 12,
                          pageIndex = 0,
                        }, then, fail) => {
  return $http({
    url: '/mall/gift/giftList.json',
    data: {
      itemType,
      itemStatus,
      sortFlag,
      sortType,
      pageSize,
      pageIndex,
    },
  })
    .then(then)
    .catch(fail)
}

/**
 * @brief 幸运夺宝
 * @author polo
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getTaskListApi = (then, fail) => {
  return $http({
    url: '/mall/lucky/conf.json',
  })
    .then(then)
    .catch(fail)
}

/**
 * 2元10元抽奖接口
 * @author polo
 * @param type 0:积分, 1:现金
 * @param lotteryType 0:2元抽奖 1:10元抽奖
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const lotteryApi = ({type, lotteryType = 0,}, then, fail) => {
  return $http({
    url: '/mall/lucky/lottery.json',
    data: {
      type,
      lotteryType
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 幸运抽奖
 * @author polo
 * @param id
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const luckyApi = ({id}, then, fail) => {
  return $http({
    url: '/mall/lucky/lotteryChest.json',
    data: {
      id
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 任务列表
 * @author polo
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const missionListApi = (then, fail) => {
  return $http({
    url: '/mall/mission/list.json',
  })
    .then(then)
    .catch(fail)
}

/**
 * 领取日常周常任务奖励
 * @author polo
 * @param termId
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const missionReceiveApi = ({termId}, then, fail) => {
  return $http({
    url: '/mall/mission/receive.json',
    data: {
      termId,
    },
  })
    .then(then)
    .catch(fail)
}

/**
 * 取得签到信息
 * @author polo
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getSignInInfoApi = (then, fail) => {
  return $http({
    url: '/mall/mission/signInfo.json',
  })
    .then(then)
    .catch(fail)
}


/**
 * 签到 仅当签到信息中isReceiveToday = false时，调用
 * @author polo
 * @param then
 * @param fail
 * @returns {*}
 */
const signInApi = (then, fail) => {
  return $http({
    url: '/mall/mission/sign.json'
  })
    .then(then)
    .catch(fail)
}


/**
 * 取得券兑换记录
 * @author polo
 * @param startDate
 * @param endDate
 * @param pageIndex
 * @param pageSize
 * @param couponToken
 * @param then
 * @param fail
 * @returns {* | Promise<T>}
 * @param couponType
 */
const getTicketRecordsApi = ({startDate = '', endDate = '', pageIndex = 0, pageSize = 10, couponType = '', couponToken = ''} = {}, then, fail) => {
  return $http({
    url: '/mall/coupon/myCouponAndGiveList.json',
    data: {
      startDate,
      endDate,
      pageIndex,
      pageSize,
      couponType,
      couponToken
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 取得礼物兑换记录
 * @author polo
 * @param startDate
 * @param endDate
 * @param pageIndex
 * @param pageSize
 * @param itemName
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getMyGiftRecordsApi = ({
                               startDate = '',
                               endDate = '',
                               pageIndex = 0,
                               pageSize = 10,
                               itemName = '',
                             }, then, fail) => {
  return $http({
    url: '/mall/gift/myGiftList.json',
    data: {
      startDate,
      endDate,
      pageIndex,
      pageSize,
      itemName,
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 礼物兑换前确认
 * @author polo
 * @param itemId
 * @param count
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const giftExchangeConfirmApi = ({itemId, count}, then, fail) => {
  return $http({
    url: 'mall/gift/confirm.json',
    data: {
      itemId,
      count
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 礼物兑换
 * @author polo
 * @param itemId
 * @param count 兑换数量
 * @param addressId
 * @param then
 * @param fail
 * @returns {* | Promise<T>}
 */
const giftExchangeApi = ({
                           itemId,
                           count,
                           addressId,
                         }, then, fail) => {
  return $http({
    url: 'mall/gift/exchange.json',
    data: {
      itemId,
      count,
      addressId,
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 积分明细列表
 * @author polo
 * @param startDate
 * @param endDate
 * @param pageIndex
 * @param pageSize
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getIntegralRecordsApi = ({
                                 startDate = '',
                                 endDate = '',
                                 pageIndex = 0,
                                 pageSize = 10,
                               }, then, fail) => {
  return $http({
    url: '/mall/integral/detailList.json',
    data: {
      startDate,
      endDate,
      pageIndex,
      pageSize,
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 地址列表
 * @author polo
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getAddressListApi = (then, fail) => {
  return $http({
    url: '/mall/gift/getUserAddressList.json',
  })
    .then(then)
    .catch(fail)
}


/**
 * 新增用户名地址
 * @author polo
 * @param name
 * @param phone
 * @param province
 * @param city
 * @param area
 * @param address
 * @param isDef
 * @param then
 * @param fail
 * @returns {* | Promise<T>}
 * @param rid
 */
const addressPushApi = ({
                          rid = null,
                          name,
                          phone,
                          province,
                          city,
                          area,
                          address,
                          isDef = 0,
                        }, then, fail) => {
  return $http({
    url: rid ? '/mall/gift/updateUserAddress.json' : '/mall/gift/createUserAddress.json',
    data: {
      name,
      phone,
      province,
      city,
      area,
      address,
      isDef,
      rid,
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 查询用户地址单笔
 * @deprecated
 * @param rid
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getAddressDetailApi = ({rid}, then, fail) => {
  return $http({
    url: '/mall/gift/getUserAddress.json',
    data: {
      rid
    }
  })
    .then(then)
    .catch(fail)
}


/**
 * 地址删除
 * @author polo
 * @param rid
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const addressDeleteApi = ({rid}, then, fail) => {
  return $http({
    url: '/mall/gift/delUserAddress.json',
    data: {
      rid
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 设置默认接口
 * @author polo
 * @param rid
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const setDefaultAddressApi = ({rid}, then, fail) => {
  return $http({
    url: '/mall/gift/setdefault.json',
    data: {
      rid
    }
  })
    .then(then)
    .catch(fail)
}

/**
 * 添加地址给抽奖实体礼物和后补地址
 * @author polo
 * @param itemId
 * @param addressId
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const addAddressToGiftApi = ({
                               itemId,
                               addressId
                             }, then, fail) => {
  return $http({
    url: 'mall/gift/editExInfo.json',
    data: {
      itemId,
      addressId
    }
  })
    .then(then)
    .catch(fail)
}

const levelIntroduceApi = (then, fail) => {
  return $http({
    url: '/mall/conf/IntegrallevelConf.json',
  })
    .then(then)
    .catch(fail)
}

const actionIntroduceApi = (then, fail) => {
  return $http({
    url: '/mall/conf/actionConf.json',
  })
    .then(then)
    .catch(fail)
}

/**
 * 获取用户已经获取的优惠券 （我的优惠券）
 * @author polo
 * @param couponType  1:充值卡, 2:加奖卡, 3:补贴卡, 4:反水卡, 5:代金券, 6:现金券
 * @param couponStatus 0:未使用, 1:已使用, 2:已过期
 * @param couponToken  选填, 券编号
 * @param pageSize
 * @param pageIndex
 * @param then
 * @param fail
 * @returns {*|Promise<T>}
 */
const getUserCouponListApi = ({couponType,couponStatus,couponToken,pageSize = 12,pageIndex}, then, fail) => {
  return $http({
    url: '/mall/coupon/myCouponList.json',
    data:{
      couponType,
      couponStatus,
      couponToken,
      pageSize,
      pageIndex
    }
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取话费/流量/qq充值配置信息
 * @param then
 * @param fail
 */
const getRechargeCfgApi = ({rechargeType}, then, fail) => {
  return $http({
    url: '/maill/recharge/phonedetail.json',
    data:{
      rechargeType
    }
  })
    .then(then)
    .catch(fail)
}
/**
 *
 * @param num 充值号码
 * @param rechargeType 充值大类型
 * @param type 充值小类型
 * @param amount 充值金额
 * @param then
 * @param fail
 */
const setRechargeApi = ({num,rechargeType,type,amount}, then, fail) => {
  return $http({
    url: '/mall/coupon/myCouponList.json',
    data:{
      num,
      rechargeType,
      type,
      amount
    }
  })
    .then(then)
    .catch(fail)
}

export {
  getMallBannerApi,
  getUserMallInfoApi,
  getCouponListApi,
  exchangeCouponListApi,
  getGiftListApi,
  getTaskListApi,
  lotteryApi,
  luckyApi,
  missionListApi,
  missionReceiveApi,
  getSignInInfoApi,
  getTicketRecordsApi,
  getMyGiftRecordsApi,
  getIntegralRecordsApi,
  signInApi,
  addressPushApi,
  getAddressListApi,
  getAddressDetailApi,
  addAddressToGiftApi,
  setDefaultAddressApi,
  addressDeleteApi,
  giftExchangeApi,
  giftExchangeConfirmApi,
  levelIntroduceApi,
  actionIntroduceApi,
  getUserCouponListApi,
  getRechargeCfgApi,
  setRechargeApi
}
