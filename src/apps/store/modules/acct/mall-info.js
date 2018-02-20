import {getUserMallInfoApi} from 'api/points'

const initState = () => {
  return {
    //当前折扣百分比 10000
    currentDiscount: 10000,
    //当前等级积分
    currentLevelintegral: 0,
    headIcon: '1',
    //积分
    integral: 0,
    levelId: 0,
    levelName: 'LV0',
    //下一个等级
    nexTLevelintegral: 0,
    //下个折扣
    nextDiscount: 10000,
    //下一个等级
    nextLevelId: 1,
    //下个等级名
    nextLevelName: 'LV1',
    //总积分
    totalIntegral: 0,
    //更新日期
    upgradeDate: null,
    userId: 0,
    userName: ''
  }
}

const getters = {
  //商城首页显示的基本信息
  mallBasicInfo: state => {
    return {
      levelId: state.levelId,
      fIntegral: _.convert2yuan(state.integral, {fixed: 0}),
      fNextLevelIntegral: _.convert2yuan(state.nexTLevelintegral - state.totalIntegral, {fixed: 0}),
      nextLevelName: state.nextLevelName,
      fTotalIntegral: _.convert2yuan(state.totalIntegral),
      fCurrentDiscount: _.formatDiv(state.currentDiscount, 1000),
      fNextDiscount: _.formatDiv(state.nextDiscount, 1000),
      nextPercent: _(_(state.currentLevelintegral).div(state.nexTLevelintegral)).mul(100)
    }
  }
}

// actions
const actions = {
  [types.GET_USER_MALL_INFO]({ commit }) {
    return getUserMallInfoApi(
      ({ data }) => { return commit(types.GET_USER_MALL_INFO_SUCCESS, data) },
    )
  },
}

// mutations
const mutations = {
  [types.GET_USER_MALL_INFO_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      const data = res.root || {}

      Object.assign(state, data)
    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
