

const Roll = require('../roll')

const activityConfig = [
  {
    activityId: 4,
    title: '会员 - 加奖活动',
    roll: true,
    View: require('./extraPrize'),
  },
  {
    activityId: 5,
    title: '代理 - 佣金活动',
    View: require('./commission'),
  },
  {
    activityId: 6,
    title: '代理 - 工资活动',
    roll: true,
    View: require('./salary'),
    itemTemplate: '<li>恭喜<span>%username</span>领到<span>%money元工资</span></li>',
  },
  {
    activityId: 7,
    title: '代理 - 冲凉奖励',
    roll: true,
    View: require('./rush'),
  },
  {
    activityId: 44,
    title: '代理 - 亏损补贴',
    roll: true,
    View: require('./loss'),
  },
]

const RebateView = Base.ItemView.extend({

  template: '',

  events: {
    'click .js-confirm': 'confirmHandler',
    'click .js-close': 'closeHandler',
    'click .js-search-btn': 'searchHandler',
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/rebateactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  doRebateXhr() {
    return Global.sync.ajax({
      url: '/info/rebateactivity/doget.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  searchRebateXhr() {
    return Global.sync.ajax({
      url: '/info/agentWages/validActiveUser.json',
    })
  },

  onRender() {
    const self = this
    const activityInfo = _(activityConfig).findWhere({
      activityId: this.options.activityId,
    })

    this.activityView = new activityInfo.View({
      el: self.$el,
      activityId: this.options.activityId,
    }).render()


    this.$fullscreen = this.$('.status_fullscreen')
    this.width = $(window).innerWidth() / 2
    this.height = $(window).innerHeight() / 2

    this.updateInfo()
    setInterval(() => {
      self.updateInfo()
    }, 30000)

    const ops = {
      el: '.js-roll',
    }

    if (activityInfo.itemTemplate) {
      ops.itemTemplate = activityInfo.itemTemplate
    }

    if (activityInfo.roll) {
      this.roll = new Roll(ops).render()
    }
  },

  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.$('.js-from-date').text(_(data.fromDate).toDate('YYYY年MM月DD日'))
          self.$('.js-end-date').text(_(data.endDate).toDate('YYYY年MM月DD日'))
          self.roll && self.roll.roll(data.dataList)
        }
      })
  },

  confirmHandler(e) {
    const self = this
    // var $target = $(e.currentTarget);

    if (this.data.status === 0) {
      Global.ui.notification.show('活动未开始')
      return false
    } else if (this.data.status === 2) {
      Global.ui.notification.show('活动已结束')
      return false
    }

    // if (!this.data.available) {
    //  this.activityView.trigger('available:false');
    //  return false;
    // }

    this.doRebateXhr()
      .done((res) => {
        if (res && res.result === 0) {
          self.activityView.trigger('confirm', res.root)
          self.openDialog(true)
        } else {
          self.openDialog(false, res.msg)
        }
      })
  },

  openDialog(status, msg) {
    this.$fullscreen.show()

    if (status) {
      const $get = this.$('.status_get')

      $get.show()

      $get.css({
        top: this.height - $get.height() / 2,
        left: this.width - $get.width() / 2,
      })
    } else {
      const $false = this.$('.status_false')

      this.$('.js-false').text(msg)
      $false.show()

      $false.css({
        top: this.height - $false.height() / 2,
        left: this.width - $false.width() / 2,
      })
    }
  },

  closeHandler(e) {
    $(e.currentTarget).parent().hide()
    this.$fullscreen.hide()
  },

  // 日工资查询按钮
  searchHandler (e) {
    this.searchRebateXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const dataInfo = res.root
          Global.ui.notification.show(`您昨日的有效投注人数为${dataInfo.yesterdayActivityUser}人，您今日的有效投注人数为${dataInfo.todayActivityUser}人，详情请在代理中心－报表查询中了解。`)
        } else if (res) {
          Global.ui.notification.show(res.msg)
        }
      })
  },
})

module.exports = RebateView
