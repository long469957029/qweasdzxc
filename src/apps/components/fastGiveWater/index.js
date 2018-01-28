require('./index.scss')

/** 限时返水活动组件 */
const FastGiveWaterView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-submit': 'submitHandler',
    'click .js-close': 'closeAll',
  },

  closeAll () {
    this.destroy()
  },

  // 活动领奖接口
  getAgentInfoXhr() {
    return Global.sync.ajax({
      url: '/info/ticketrebateactivity/doget.json',
      data: {
        activityId: 22,
      },
    })
  },


  // 获取加奖活动配置
  getPrizeConfigInfoXhr() {
    return Global.sync.ajax({
      url: '/info/ticketrebateactivity/info.json',
      data: {
        activityId: 22,
      },
      async: false,
    })
  },


  initialize() {

  },

  updateInfo(res) {
    const self = this

    if (res && res.result === 0) {
      const data = self.data = res.root
      const beginTime = data.diFromTime
      const endTime = data.diEndTime
      const rebateScale = data.rebateScale / 100

      const ticketId = data.ticketId

      const ticketName = ticketConfig.getComplete(ticketId).info.zhName

      self.$('.js-ticket-name').html(ticketName)
      self.$('.js-rebate').html(rebateScale)

      // var beginTime = 2000;
      // var endTime = 115000;

      const content = `${'活动规则：<br>' +
      '1、每天'}${data.fromTime}到${data.endTime}，参与${ticketName}的投注，都可享受流水${data.rebateScale / 100}%的返水奖励。<br>` +
      '2、活动仅计算活动开始后和结束前开奖的订单，每天限领一次。<br>' +
      '3、奖金需手动在此领取，当天返水奖励当天领取，逾期作废。<br>' +
      '4、相同IP仅限一个账号参与，活动期间发现任何对冲刷奖金的账号，将直接冻结。<br>' +
      '5、无限娱乐拥有活动的最终解释权。'

      self.$('.js-content').html(content)

      if (data.validUser) {
        self.$('#subID').show()
      } else {
        self.$('#subID').hide()
      }

      self.timerHandler(beginTime, endTime)
    }
  },

  timerHandler(beginTime, endTime) {
    if (beginTime < 0) {
      beginTime = 0
    }

    if (endTime < 0) {
      endTime = 0
    }

    const self = this
    const $hour = this.$('.hour')
    const $minute = this.$('.minute')
    const $second = this.$('.second')

    // TODO 发送请求获取还有多少时间开始
    /* 时，分，秒 */
    // var ready_time = [9, 5, 5];
    //      var ready_time = [0, 0, 2];
    const ready_time_millisecond = beginTime// (ready_time[0] * 60 * 60 + ready_time[1] * 60 + ready_time[2]) * 1000;

    // //TODO 发送请求获取还有多少时间结束
    /* 时，分，秒 */
    //      var begin_time = [0, 5, 0];
    const begin_time_millisecond = endTime// (begin_time[0] * 60 * 60 + begin_time[1] * 60 + begin_time[2]) * 1000;

    let clear_ready
    let clear_begin

    // 启动预计开始倒计时
    function countdownReady(ready_time_millisecond) {
      self.$('.title_pic_info_begin').show()
      self.$('.title_pic_info_ready').hide()
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
      self.$('.title_pic_info_begin').hide()
      self.$('.title_pic_info_ready').show()
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
          self.destroy()
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

  onRender() {
    this.initPage()
    // this.updateInfo();
  },

  initPage() {
    const self = this
    const $main_contain = this.$('.main_contain')
    const $pop_contain = this.$('.pop_contain')
    // var window_width = $(window).innerWidth();
    // var window_height = $(window).innerHeight();
    //
    // $main_contain.css({
    //  "left": (window_width / 2 - $main_contain.width() / 2) + "px",
    //  "top": (window_height / 2 - $main_contain.height() / 2) + "px"
    // });
    // $pop_contain.css({
    //  "left": (window_width / 2 - $pop_contain.width() / 2) + "px",
    //  "top": (window_height / 2 - $pop_contain.height() / 2) + "px"
    // });

    const $close_btn = this.$('.close_btn,.btn_02')
    $close_btn.click(() => {
      self.$('.mask1a').hide()
    })

    const $luster = this.$('.luster')
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
  },

  // event handlers

  submitHandler() {
    const self = this
    this.getAgentInfoXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root
          if ((data.receiveMoney / 10000) <= 0) {
            let msg = ''
            if (data.rebateStatus == 1) {
              msg = '每天限领一次，当天奖金已经领取。'
            } else {
              msg = '暂无可领取的奖金，请在活动时间内投注且开奖后再来领取。'
            }
            self.$('.js-fail-info').html(msg)
            $('.js-info2').show()
            $('.js-main').hide()
          } else {
            $('.js-info1-div').html(`领取成功！<br>当前投注金额${data.betTotalAmount / 10000}元，已领取返水奖金${data.receiveMoney / 10000}元！`)
            $('.js-info1').show()
            $('.js-main').hide()
          }
        } else if (res && res.result === 1) {
          $('.js-info3').show()
          $('.js-main').hide()
        } else if (res && res.result === -1) {
          $('.js-info2').show()
          $('.js-main').hide()
        } else {
          Global.ui.notification.show(`您的帐户不符合领取条件，有可能是：<br>${res.msg}`)
        }
      })
  },

  closeActivityHandler() {
    this.destroy()
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState() {
    const self = this
    this.getPrizeConfigInfoXhr().done((res) => {
      if (res && res.result === 0) {
        if (res.root.avaliable) {
          $('body').append(self.render().$el)
        }
        self.updateInfo(res)
      }
    })
  },

  /** 检查入口是否显示
   * 检查是否首次登录，是则弹出活动窗口 */
  checkState1($target) {
    const self = this
    let isShow = false
    let $dialog = null
    this.getPrizeConfigInfoXhr().done((res) => {
      if (res && res.result === 0) {
        /** avaliable 是否显示入口 */
        if (res.root.avaliable) {
          $target.css('display', 'block')
          /** valid 是否首次登录,首次登录会自动弹出活动界面 */
          if (res.root.valid) {
            // $('body').append(self.render().$el);
            self.updateInfo(res)
            isShow = true
            $dialog = self.render().$el
          }
        } else {
          $target.remove()
        }
      } else {
        $target.remove()
      }
    })
    return { $dialog, dialogParent: '.js-activity_water', isShow }
  },

  openPrizeWindow() {
    const self = this
    self.getPrizeConfigInfoXhr().done((res) => {
      const self1 = self
      if (res && res.result === 0) {
        const data = self.data = res.root
        const nextTime = data.nextWindowTime
        if (nextTime > 0) {
          setTimeout(() => {
            $('body').append(self.render().$el)
            self1.openPrizeWindow()
          }, nextTime)
        }
      }
    })
  },
})

module.exports = FastGiveWaterView
