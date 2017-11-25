

const Model = require('skeleton/model')

const BettingModel = Model.extend({

  url: '/ticket/ticketmod/ticketinfo.json',

  defaults: {
    // 最后的开奖期号
    lastOpenId: '',
    // 最后的开奖号码
    lastOpenNum: [],
    // 当前期期号
    planId: '',
    // 当前期剩余时间
    leftSecond: 0,
    // 当前期总共时间
    totalSecond: 0,
    // 下一期期号
    nextPlanId: '',
    // 下一期总共时间
    nextTotalSecond: 0,
    // openVideoUrl: [],
    // totalTime: 60000,
    // 是否处于销售状态
    sale: true,
    ticketId: '',
    init: true,
    // 加拿大3.5分彩特有参数，pending:true的话，是暂停销售
    pending: false,
  },

  parse(res) {
    let data

    if (res && res.result === 0) {
      data = res.root || {}

      // 格式化开奖结果
      data.lastOpenNum = (data.lastOpenNum || '').split(',') || []
    }

    return data
  },

  // common APIs

  changeToUpdate() {
    this.set('init', false)
  },

  goToNextPlan() {
    const info = this.pick('planId', 'leftSecond', 'totalSecond', 'nextPlanId', 'nextTotalSecond')

    this.set({
      lastPlanId: info.planId,
      planId: info.nextPlanId,
      leftSecond: info.nextTotalSecond,
      totalSecond: info.nextTotalSecond,
    })
  },

  getVideoUrl() {
    const videoUrls = this.get('openVideoUrl')

    if (_.isEmpty(videoUrls)) {
      return ''
    } 
    return videoUrls[_.random(0, videoUrls.length - 1)]
  },

})

module.exports = BettingModel
