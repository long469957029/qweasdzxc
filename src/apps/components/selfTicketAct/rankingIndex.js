

const TodayRankingInfoView = require('./todayRanking')
const YesterdayBigGodsInfoView = require('./yesterdayBigGods')

const RankingIndexView = Base.ItemView.extend({
  template: '',
  events: {
  },
  ticketId: 0,
  getRankingInfoXhr () {
    return Global.sync.ajax({
      url: '/info/redpack/dailylist.json',
    })
  },
  getBigGodsInfoXhr () {
    return Global.sync.ajax({
      url: '/info/redpack/yestoday.json',
    })
  },
  onRender() {
    const self = this

    // this.yesterdayBigGods = new YesterdayBigGodsInfoView().render();
    this.todayRanking = new TodayRankingInfoView({
      el: this.options.optionEL,
    }).render()
    this.showDayRanking = false
    this.getUrl()
    window.onhashchange = function () {
      self.getUrl()
    }
  },
  getUrl () {
    const self = this
    const strHash = document.location.hash
    if (strHash.slice(0, 6) == `#bc/${this.ticketId}`) {
      this.checkBigGodsStatus()
      this.showDayRanking = true
      this.getDayRankInfo()
      this.trigger('hidden:ffcEntry')
    } else {
      this.showDayRanking = false
      this.todayRanking.hideView()
      this.trigger('show:ffcEntry')
    }
  },
  getDayRankInfo () {
    const self = this
    this.getRankingInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          if (self.showDayRanking) {
            self.todayRanking.showView(res.root)
            self.setTimer()
          }
        }
      })
      .fail((res) => {
      })
  },
  setTimer () {
    const self = this
    clearInterval(this.timer1)
    this.timer1 = setInterval(() => {
      self.getDayRankInfo()
    }, 180000)
  },
  checkBigGodsStatus () {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')
    const nowUser = acctInfo.userId
    const haveShow = Global.cookieCache.get(`${nowUser}haveShowBigGods`)
    if (!haveShow) {
      this.getBigGodsInfoXhr()
        .done((res) => {
          if (res.result === 0) {
            if (res.root && !_.isNull(res.root)) {
              self.showBigGodsView(res.root)
              Global.cookieCache.set(`${nowUser}haveShowBigGods`, true)
            }
          }
        })
    }
  },
  showBigGodsView (data) {
    const self = this
    if (data && !_.isEmpty(data) && !_.isNull(data)) {
      this.$bigGodsDialog = Global.ui.dialog.show({
        body: '<div class="js-big-gods-main"></div>',
        anySize: '571',
        bodyClass: 'no-border no-bg no-padding',
      })
      const $bigGodsMain = this.$bigGodsDialog.find('.js-big-gods-main')
      const $bigGodsInfo = new YesterdayBigGodsInfoView({ data, parentView: this })
      $bigGodsMain.html($bigGodsInfo.render().el)

      this.$bigGodsDialog.on('hidden.modal', function (e) {
        $(this).remove()
        delete self.$bigGodsDialog
        $bigGodsInfo.destroy()
      })
    }
  },
  checkState ($target) {
    const self = this
    let isShow = false
    const $dialog = null
    this.getRankingInfoXhr().done((res) => {
      if (res.result === 0) {
        if (res.root.status === 1) {
          $target.removeClass('hidden')
          self.ticketId = res.root.ticketId
          self.render()
          isShow = true
        }
      }
    })
    return { $dialog, dialogParent: '', isShow }
  },

})

module.exports = RankingIndexView
