

require('./index.scss')
const weekRankingInfoView = require('./weekRanking')

const TodayRankingView = Base.ItemView.extend({
  template: require('./todayRanking.html'),
  events: {
    'click .js-unfolded-btn': 'showAndHiddenHanler',
    'click .js-put-away-btn': 'showAndHiddenHanler',
    'click .js-look-week-ranking': 'lookWeekRankingHanlder',
  },

  getWeekRankXhr () {
    return Global.sync.ajax({
      url: '/info/redpack/weeklylist.json',
    })
  },
  onRender() {
    const self = this
    this.$todayRankMain = this.$('.js-today-rank-main')
    this.$todayRankPutAway = this.$('.js-today-rank-putAway')
    this.$unfoldedBtn = this.$('.js-unfolded-btn')
    this.$todayRankUnfolded = this.$('.js-today-rank-unfolded')
    this.$putAwayBtn = this.$('.js-put-away-btn')
    this.$myRanking = this.$('.js-my-ranking')
    this.$mystatus = this.$('.js-my-status')
    this.$rankList = this.$('.js-rank-list')
  },
  showView (data) {
    this.$myRanking.html(data.myNum === 0 ? '未上榜' : data.myNum)
    this.$mystatus.html(_(data.amount).convert2yuan())
    this.$rankList.html(_(data.dataList).map((item, index) => {
      return `${' <li>' +
        '<div class="rank-li-info rank-name text-center pull-left"><span class="rank-num rank-'}${index + 1}"></span><span class="day-rank-name">${item.userName.slice(0, 3)}***</span></div>` +
        `<div class="rank-li-info rank-bet text-center pull-left">${_(item.bet).convert2yuan()}</div>` +
        `<div class="rank-li-info rank-reward text-center pull-left">${_(item.amount).convert2yuan()}</div>` +
        '</li>'
    }))
    this.$todayRankMain.removeClass('hidden')
  },
  hideView () {
    this.$todayRankMain.addClass('hidden')
  },
  showAndHiddenHanler (e) {
    // var $target = $(e.currentTarget);
    // $target.toggleClass('hidden');
    this.$todayRankPutAway.toggleClass('hidden')
    this.$unfoldedBtn.toggleClass('hidden')
    this.$todayRankUnfolded.toggleClass('hidden')
    this.$putAwayBtn.toggleClass('hidden')
  },
  lookWeekRankingHanlder () {
    const self = this
    this.getWeekRankXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.root && !_.isNull(res.root)) {
            self.showWeekRankDialog(res.root)
          }
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '获取周排行信息失败' : res.msg)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '获取周排行信息失败' : res.msg)
      })
  },
  showWeekRankDialog (data) {
    const self = this
    const $weekRankingDialog = Global.ui.dialog.show({
      body: '<div class="js-week-ranking-main"></div>',
      anySize: '836',
      anyPosition: '50',
      bodyClass: 'no-border no-bg no-padding',
    })
    const $weekRankMain = $weekRankingDialog.find('.js-week-ranking-main')
    const $weekRankInfo = new weekRankingInfoView({ data, parentView: this })
    $weekRankMain.html($weekRankInfo.render().el)

    $weekRankingDialog.on('hidden.modal', function (e) {
      $(this).remove()
      $weekRankInfo.destroy()
    })
  },
})

module.exports = TodayRankingView
