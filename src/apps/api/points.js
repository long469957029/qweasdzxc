/**
 * 取得优惠券
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
 * @brief 积分商城 礼物兑换
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

export {
  getCouponListApi,
  getGiftListApi,
  getTaskListApi,
}
