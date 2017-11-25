

require('./index.scss')

const userLossView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-userLoss-openRedBao-btn': 'openRedBaoHandler',
    'click .js-userLoss-gotoPlay-btn': 'closeRedBaoHandler',
  },

  initialize() {

  },

  onRender() {
    this.$userLossDialog = this.$('.js-userLoss-dialog')
    this.$userLossContent = this.$userLossDialog.find('.js-userLoss-content')
    this.$userLossMoneyDiv = this.$userLossDialog.find('.js-userLoss-money-div')
    this.$userLossMoney = this.$userLossMoneyDiv.find('.js-userLoss-money')
    this.$userLossOpenRedBaoBtn = this.$userLossDialog.find('.js-userLoss-openRedBao-btn')
    this.$userLossGotoPlayBtn = this.$userLossDialog.find('.js-userLoss-gotoPlay-btn')
  },

  // 用户是否领取接口
  userLossInfoXhr() {
    return Global.sync.ajax({
      url: '/info/userLost/info.json',
      async: false,
    })
  },
  // 用户拆红包接口
  userGetAwardInfoXhr() {
    return Global.sync.ajax({
      url: '/info/userLost/getAward.json',
    })
  },

  checkState(e) {
    const self = this
    let isShow = false
    let $dialog = null
    this.userLossInfoXhr().done((res) => {
      if (res.result === 0) {
        if (res.root.isAward) {
          $dialog = self.render().$el
          isShow = true
        }
      }
    })
    return { $dialog, dialogParent: '.js-userLoss-dialog', isShow }
  },

  openRedBaoHandler (e) {
    const self = this
    this.userGetAwardInfoXhr().done((res) => {
      if (res && res.result === 0) {
        const money = res.root.awardAmount
        self.$userLossMoney.html(money)
        self.$userLossContent.addClass('open')
        self.$userLossMoneyDiv.show()
        self.$userLossOpenRedBaoBtn.hide()
        self.$userLossGotoPlayBtn.show()
      } else if (res && res.result === 1) {
        Global.ui.notification.show(res.msg)
      }
    })
  },

  closeRedBaoHandler () {
    this.$userLossDialog.remove()
  },
})

module.exports = userLossView
