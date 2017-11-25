

require('./index.scss')

const WinlossView = Base.ItemView.extend({

  template: require('./index.html'),

  rootData: null,

  events: {
    'click .js-close-btn': 'closeActivityHandler',
    'click .js-accept-btn': 'acceptHandler',
    'click .js-acceptwin-btn': 'acceptWinHandler',
    'click .js-acceptloss-btn': 'acceptLossHandler',
  },

  // 查看活动详细信息接口
  getActivityInfoXhr() {
    return Global.sync.ajax({
      url: '/info/rebaterewardactivity/info.json',
      async: false,
      data: {
        activityId: 25,
      },
    })
  },

  // 领取加奖接口
  getWinAwardXhr() {
    return Global.sync.ajax({
      url: '/info/rebaterewardactivity/doget.json',
      data: {
        activityId: 25,
        resultType: 0,
      },
    })
  },

  // 领取补贴接口
  getLossAwardXhr () {
    return Global.sync.ajax({
      url: '/info/rebaterewardactivity/doget.json',
      data: {
        activityId: 25,
        resultType: 1,
      },
    })
  },

  showAwardInfoXhr() {
    return Global.sync.ajax({
      url: '/info/rebaterewardactivity/confirm.json',
    })
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  onRender() {
    this.initPage()
    this.initTimer()
    this.$mainContain = this.$('.js-main-contain')
    this.$errorContain = this.$('.js-error-contain')
    this.$acceptContain = this.$('.js-accept-contain')
    this.$successContain = this.$('.js-success-contain')
    this.$failureContain = this.$('.js-failure-contain')
  },

  // 初始化页面的居中和动画
  initPage() {
    const $main_contain = this.$('.main_contain')
    const $pop_contain = this.$('.pop_contain')
    const window_width = $(window).innerWidth()
    const window_height = $(window).innerHeight()
    $main_contain.css({
      left: `${window_width / 2 - $main_contain.width() / 2}px`,
      top: `${window_height / 2 - $main_contain.height() / 2}px`,
    })
    $pop_contain.css({
      left: `${window_width / 2 - $pop_contain.width() / 2}px`,
      top: `${window_height / 2 - $pop_contain.height() / 2}px`,
    })
    // 钻石动画
    const $diamond_01 = this.$('.diamond_01')
    const $diamond_02 = this.$('.diamond_02')
    const $diamond_03 = this.$('.diamond_03')
    const $diamond_04 = this.$('.diamond_04')
    const $diamond_05 = this.$('.diamond_05')
    // 标题动画
    const $title_pic = this.$('.title_pic')
    $title_pic.animate({
      opacity: '1',
      top: '-170px',
    }, 300, () => {
      $diamond_01.animate({
        opacity: '1',
      }, 300, () => {
        $diamond_02.animate({
          opacity: '1',
        }, 300, () => {
          $diamond_03.animate({
            opacity: '1',
          }, 300, () => {
            $diamond_04.animate({
              opacity: '1',
            }, 300, () => {
              $diamond_05.animate({
                opacity: '1',
              }, 300, () => {
                allLusterIO()
              })
            })
          })
        })
      })
    })
    // 闪光效果
    const $luster = this.$('.luster')
    function allLusterIO() {
      setInterval(() => {
        $luster.eq(0).animate({
          opacity: '1',
        }, () => {
          $luster.eq(0).animate({
            opacity: '0',
          })
        })
      }, 300)
      setInterval(() => {
        $luster.eq(1).animate({
          opacity: '1',
        }, () => {
          $luster.eq(1).animate({
            opacity: '0',
          })
        })
      }, 400)
      setInterval(() => {
        $luster.eq(2).animate({
          opacity: '1',
        }, () => {
          $luster.eq(2).animate({
            opacity: '0',
          })
        })
      }, 300)
      setInterval(() => {
        $luster.eq(3).animate({
          opacity: '1',
        }, () => {
          $luster.eq(3).animate({
            opacity: '0',
          })
        })
      }, 300)
      setInterval(() => {
        $luster.eq(4).animate({
          opacity: '1',
        }, () => {
          $luster.eq(4).animate({
            opacity: '0',
          })
        })
      }, 600)
      setInterval(() => {
        $luster.eq(5).animate({
          opacity: '1',
        }, () => {
          $luster.eq(5).animate({
            opacity: '0',
          })
        })
      }, 500)
      setInterval(() => {
        $luster.eq(6).animate({
          opacity: '1',
        }, () => {
          $luster.eq(6).animate({
            opacity: '0',
          })
        })
      }, 700)
      setInterval(() => {
        $luster.eq(7).animate({
          opacity: '1',
        }, () => {
          $luster.eq(7).animate({
            opacity: '0',
          })
        })
      }, 300)
      setInterval(() => {
        $luster.eq(8).animate({
          opacity: '1',
        }, () => {
          $luster.eq(8).animate({
            opacity: '0',
          })
        })
      }, 600)
      setInterval(() => {
        $luster.eq(9).animate({
          opacity: '1',
        }, () => {
          $luster.eq(9).animate({
            opacity: '0',
          })
        })
      }, 400)
    }
  },

  // 初始化计时器
  initTimer() {
    const self = this
    const $hour = this.$('.hour')
    const $minute = this.$('.minute')
    const $second = this.$('.second')
    // 还有多少时间开始
    /* 时，分，秒 */
    // var ready_time = [0, 0, 2];
    // var ready_time_millisecond = (ready_time[0] * 60 * 60 + ready_time[1] * 60 + ready_time[2]) * 1000;
    // 还有多少时间结束
    /* 时，分，秒 */
    // var begin_time = [0, 5, 0];
    // var begin_time_millisecond = (begin_time[0] * 60 * 60 + begin_time[1] * 60 + begin_time[2]) * 1000;
    // 设置倒计时时间
    this.getActivityInfoXhr().done((res) => {
      if (res && res.result === 0) {
        self.rootData = res.root
        // 设置显示奖金率和时间
        self.$('.js-ward').html(res.root.rewardScale / 100)
        self.$('.js-bate').html(res.root.rebateScale / 100)
        self.$('.js-from-time').html(res.root.fromTime)
        self.$('.js-end-time').html(res.root.endTime)
      }
    })
    // var ready_time_millisecond = 0;
    const ready_time_millisecond = self.rootData ? self.rootData.diFromTime : 0
    const begin_time_millisecond = self.rootData ? self.rootData.diEndTime : 0
    let clear_ready
    let clear_begin
    // 启动预计开始倒计时
    function countdownReady(ready_time_millisecond) {
      let old_time = (new Date()).getTime()
      let new_time = old_time
      clear_ready = setInterval(() => {
        new_time = (new Date()).getTime()
        if ((new_time - old_time) >= 1000) {
          ready_time_millisecond -= 1000
          old_time = new_time
        }
        setTime(ready_time_millisecond)
        if (ready_time_millisecond <= 0) {
          clearInterval(clear_ready)
          countdownBegin(begin_time_millisecond)
        }
      }, 300)
    }
    // 启动活动进行倒计时
    function countdownBegin(begin_time_millisecond) {
      self.$('.title_pic_info_ready').hide()
      self.$('.title_pic_info_begin').show()
      self.$('.time_lump').removeClass('time_ready').addClass('time_begin')
      self.$('.btn_01').show()
      let old_time = (new Date()).getTime()
      let new_time = old_time
      clear_begin = setInterval(() => {
        new_time = (new Date()).getTime()
        if ((new_time - old_time) >= 1000) {
          begin_time_millisecond -= 1000
          old_time = new_time
        }
        setTime(begin_time_millisecond)
        if (begin_time_millisecond <= 0) {
          clearInterval(clear_begin)
        }
      }, 300)
    }
    // 设置具体时间
    function setTime(detail_time) {
      const all_second = Math.floor(detail_time / 1000)
      const hour = Math.floor(Math.floor(all_second / 60) / 60)
      const minute = Math.floor(all_second / 60) - hour * 60
      const second = all_second - (hour * 60 * 60 + minute * 60)
      if (hour < 10) {
        $hour.text(`0${hour}`)
      } else {
        $hour.text(hour)
      }
      if (minute < 10) {
        $minute.text(`0${minute}`)
      } else {
        $minute.text(minute)
      }
      if (second < 10) {
        $second.text(`0${second}`)
      } else {
        $second.text(second)
      }
    }
    // 开始运行程序
    countdownReady(ready_time_millisecond)
  },

  // event handlers
  acceptHandler() {
    const self = this
    this.showAwardInfoXhr().done((res) => {
      let flag = false
      self.$mainContain.hide()
      if (res && res.result == 0) {
        flag = true
        self.$('.js-win-money').html(res.root.prizeAmount / 10000)
        self.$('.js-ward-money').html(res.root.amount / 10000)
        let lossMoney = res.root.betAmount - res.root.prizeAmount
        lossMoney = lossMoney > 0 ? lossMoney : 0
        self.$('.js-loss-money').html(lossMoney / 10000)
        self.$('.js-bate-money').html(res.root.bonus / 10000)
      }
      if (flag) {
        self.$acceptContain.show()
      } else {
        self.$errorContain.show()
      }
    })
  },

  acceptWinHandler() {
    const self = this
    this.getWinAwardXhr().done((res) => {
      let flag = false
      self.$acceptContain.hide()
      if (res && res.result == 0) {
        if (res.root.amount > 0) {
          flag = true
          var message = `当前中奖金额${self.$('.js-win-money').html()}元，已领取加奖奖金${self.$('.js-ward-money').html()}元。`
          self.$('.js-sucmes').html(message)
        } else {
          flag = false
          var message = '暂无可领取的奖金，请在活动时间内中奖后再来领取。'
          self.$('.js-failmes').html(message)
        }
      }
      if (flag) {
        self.$successContain.show()
      } else {
        self.$failureContain.show()
      }
    })
  },
  acceptLossHandler() {
    const self = this
    this.getLossAwardXhr().done((res) => {
      let flag = false
      self.$acceptContain.hide()
      if (res && res.result == 0) {
        if (res.root.amount > 0) {
          var message = `当前亏损金额${self.$('.js-loss-money').html()}元，已领取补贴奖金${self.$('.js-bate-money').html()}元。`
          self.$('.js-sucmes').html(message)
          flag = true
        } else {
          flag = false
          var message = '暂无可领取的补贴，请在活动时间内亏损后再来领取。'
          self.$('.js-failmes').html(message)
        }
      }
      if (flag) {
        self.$successContain.show()
      } else {
        self.$failureContain.show()
      }
    })
  },

  closeActivityHandler() {
    this.destroy()
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState($target) {
    const self = this
    let isShow = false
    let $dialog = null
    this.getActivityInfoXhr().done((res) => {
      if (res.result === 0) {
        const data = res.root
        // 活动日期内显示入口
        if (data.nowTime > data.fromDate && data.nowTime < data.endDate) {
          $target.css('display', 'block')
        } else {
          $target.remove()
        }
        if (res.root.valid) {
          // $('body').append(self.render().$el);
          isShow = true
          $dialog = self.render().$el
        }
      } else {
        $target.remove()
      }
    })
    return { $dialog, dialogParent: '.js-winloss_mask', isShow }
  },
})
module.exports = WinlossView
