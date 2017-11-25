

require('./index.scss')
require('./jqmeter.min')
const statusModule = require('../modules/pickUp/statusModule')

const TaskCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  events: {
    'click .js-mc-pickUp-btn': 'btnPickUpHandler',
  },
  getTaskRewardInfoXhr () {
    return Global.sync.ajax({
      url: '/mall/mission/list.json',
    })
  },
  getMissionXHR (id) {
    return Global.sync.ajax({
      url: '/mall/mission/receive.json',
      data: {
        termId: id,
      },
    })
  },
  onRender() {
    /* this.$('.progress-content').jQMeter({
     goal:'1000',
     raised:'600',
     width:'100%',
     }); */
    const self = this
    self.getTaskRewardInfoXhr()
      .done((res) => {
        if (res.result == 0) {
          self.createDailyList(res.root.daily)
          self.createweeklyList(res.root.week)
          self.loadingFinish()
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg)
      })
  },
  initialize () {
  },
  createDailyList (data) {
    const self = this
    _(data).map((item, index) => {
      self.$(`.js-daily-recharge${item.termId}`).text(_(item.termThrehold).formatDiv(10000, { fixed: 0 }))
      if (item.termBonusType == 1) {
        self.$(`.js-daily-integral${item.termId}`).html(`<span style="color: #666666">奖励积分</span><span class="money-number">${_(item.termBonus).formatDiv(10000, { fixed: 0 })}</span>`)
      } else {
        self.$(`.js-daily-integral${item.termId}`).html(`<span style="color: #666666">奖励现金</span><span class="money-number">${_(item.termBonus).formatDiv(10000, { fixed: 0 })}</span>`)
      }
      self.$(`.js-daily-progress-area${item.termId}`).jQMeter({
        goal: _(item.termThrehold).formatDiv(10000, { fixed: 0 }).toString(),
        raised: _(item.currentAmount).formatDiv(10000, { fixed: 0 }).toString(),
        width: '100%',
      })
      self.$(`.js-daily-currentAmount${item.termId}`).text(_(item.currentAmount).formatDiv(10000, { fixed: 0 }))
      if (item.status == 0) {
        if (item.currentAmount >= item.termThrehold) {
          self.$(`.js-daily-pickUp-btn${item.termId}`).addClass('js-mc-pickUp-btn mc-pick-up-btn').text('立即领取').attr('data-termid', item.termId)
            .attr('data-termBonusType', item.termBonusType)
        } else {
          self.$(`.js-daily-pickUp-btn${item.termId}`).addClass('mc-pick-up-no-btn').text('立即领取')
        }
      } else {
        self.$(`.js-daily-pickUp-btn${item.termId}`).addClass('mc-pick-up-over-btn').text('已领取').attr('disabled', true)
      }
    })
  },
  createweeklyList (data) {
    const self = this
    _(data).map((item, index) => {
      self.$(`.js-weekly-recharge${item.termId}`).text(_(item.termThrehold).formatDiv(10000, { fixed: 0 }))
      if (item.termBonusType == 1) {
        self.$(`.js-weekly-integral${item.termId}`).html(`<span style="color: #666666">奖励积分</span><span class="money-number">${_(item.termBonus).formatDiv(10000, { fixed: 0 })}</span>`)
      } else {
        self.$(`.js-weekly-integral${item.termId}`).html(`<span style="color: #666666">奖励现金</span><span class="money-number">${_(item.termBonus).formatDiv(10000, { fixed: 0 })}</span>`)
      }
      self.$(`.js-weekly-progress-area${item.termId}`).jQMeter({
        goal: _(item.termThrehold).formatDiv(10000, { fixed: 0 }).toString(),
        raised: _(item.currentAmount).formatDiv(10000, { fixed: 0 }).toString(),
        width: '100%',
      })
      self.$(`.js-weekly-currentAmount${item.termId}`).text(_(item.currentAmount).formatDiv(10000, { fixed: 0 }))
      if (item.status == 0) {
        if (item.currentAmount >= item.termThrehold) {
          self.$(`.js-weekly-pickUp-btn${item.termId}`).addClass('js-mc-pickUp-btn mc-pick-up-btn').text('立即领取').attr('data-termid', item.termId)
            .attr('data-termBonusType', item.termBonusType)
        } else {
          self.$(`.js-weekly-pickUp-btn${item.termId}`).addClass('mc-pick-up-no-btn').text('立即领取')
        }
      } else {
        self.$(`.js-weekly-pickUp-btn${item.termId}`).addClass('mc-pick-up-over-btn').text('已领取').attr('disabled', true)
      }
    })
  },
  btnPickUpHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const termId = $target.data('termid')
    const termBonusType = $target.data('termbonustype')
    let moneyImg = false
    let html = '恭喜您成功领取积分'
    let unit = ''
    if (termBonusType == 2) {
      moneyImg = true
      html = '恭喜您成功领取现金'
      unit = '元'
    }
    self.getMissionXHR(termId)
      .done((res) => {
        if (res.result == 0) {
          const $pickDialog = Global.ui.dialog.show({
            anySize: '500',
            body: '<div class="mc-pk-moll"></div>',
            bodyClass: 'mc-pick-up-module-body',
          })
          const $pickUpStatus = $pickDialog.find('.mc-pk-moll')
          $pickUpStatus.html(new statusModule({
            status: 0,
            moneyImg,
            seal: false,
            title: '领取成功！',
            msg: `<span style="color: #333333">${html}</span><span style="color: #e8675d">${_(res.root.reveiveIntegral).formatDiv(10000)}${unit}</span>!`,
            text: '',
          }).render().el)
          self.onRender()
          self.trigger('update:userInfo')
          $pickDialog.on('hidden.modal', function (e) {
            $(this).remove()
          })
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
      .fail(() => {

      })
    /* var $pickDialog = Global.ui.dialog.show({
     anySize: '500',
     body: '<div class="mc-pk-moll"></div>',
     bodyClass:'mc-pick-up-module-body',
     });
     var $pickUpStatus =$pickDialog.find('.mc-pk-moll');
     $pickUpStatus.html(new statusModule({
     status:'0',
     moneyImg:false,
     seal:false,
     msg:'本次兑换已花费积分2000',
     text:'原积分20000，已享Lv.4等级9.5折兑换特权'
     }).render().el); */
  },
})

module.exports = TaskCenterView
