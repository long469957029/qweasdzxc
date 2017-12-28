import '../index.scss'

const rechargeService = require('../recharge/rechargeService')

const WithdrawView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-rc-next-step': 'nextStepHandler',
    'click .js-fc-rc-pre': 'preStepHandler',
  },

  initialize() {

  },

  serializeData() {

  },

  onRender() {
    // 生成充值页广告
    this.$('.jc-rc-activity').html(rechargeService.getFunActivity(this.options.ac))
    // 初始化内容滑动效果数据
    this.conInnerConWidth = 740
    this.conSize = this.$('.jc-fc-rc-view').size()
    if (!this.cur) {
      this.cur = 0
    }
  },
  // 点击充值确定按钮下一步操作判断
  nextStepHandler() {
    if (this.cur < this.conSize - 1) {
      this.slide(this.conInnerConWidth, this.cur + 1)
    }
  },
  preStepHandler() {
    if (this.cur > 0) {
      this.slide(this.conInnerConWidth, this.cur - 1)
    }
  },
  slide(conInnerConWidth, index) {
    this.$('.jc-fc-rc-maskCon').animate({ marginLeft: `${-index * conInnerConWidth}px` })
    this.cur = index
  },
})

export default WithdrawView
