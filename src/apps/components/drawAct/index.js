

require('./index.scss')
// require('./effect.js');
require('./jQueryRotate.2.2.js')


const drawActView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    // 'click .js-submit': 'submitHandler',
    // 'click .lot-btn span': 'drawPrize',
  },

  initialize () {

  },


  onRender () {
    const self = this
    this.initPage()
    this.getRedbagXhr().done((res) => {
      if (res && res.result === 0) {
        const fromDate = _(res.root.fromDate).toDate('MM月DD日')
        const toDate = _(res.root.endDate).toDate('MM月DD日')
        self.$('.js-activity-date').html(`${fromDate}至${toDate}`)

        const curBet = res.root.curBet / 10000
        let index = 5
        _(res.root.betList).each((info) => {
          self.$(`.js-amount-${index}`).html(info / 10000)
          if (curBet >= (info / 10000)) {
            // 按钮变亮
            self.$(`.js-btn-style-${index}`).show()
            self.$(`.js-btn-gray-${index}`).hide()
          } else {
            // 按钮变灰
            self.$(`.js-btn-style-${index}`).hide()
            self.$(`.js-btn-gray-${index}`).show()
          }
          index--
        })
      } else {
        // 失败提示
      }
    })
  },

  initPage () {
    const self = this

    const $close_btn = this.$('.close_btn')
    $close_btn.click(() => {
      self.$('.mask_mid').hide()
    })


    const $con = this.$('.main_contain')
    const $close_return = this.$('.close_return,.btn_01')
    const $table = $con.eq(1)
    const $td_btn = this.$('.td_btn')

    const $closeRotaryTable = this.$('.close_rotarytable')

    $closeRotaryTable.click(() => {
      $con.eq(0).hide()
      $con.eq(1).show()
    })

    // 是否能够打开轮盘,0=打开，1=很抱歉，当前奖金您已领取  每天各档次限抽奖一次，2=很抱歉，您暂未达到当前投注要求  无法领取抽奖，3=不在活动时间内。
    // 这里的数组变量正好放入5个按钮对应的值
    const state_btn = [0, 0, 0, 0, 0, 0]

    // 轮盘图片
    const $rotaryTable = this.$('.image')

    // 不同轮盘对应奖金值数组
    const rotaryTable_val_0 = [8, 10, 12, 18, 25]
    const rotaryTable_val_1 = [15, 20, 25, 38, 58]
    const rotaryTable_val_2 = [28, 38, 58, 88, 138]
    const rotaryTable_val_3 = [128, 158, 188, 288, 388]
    const rotaryTable_val_4 = [328, 388, 588, 888, 1888]
    const rotaryTable_val_5 = [328, 388, 588, 888, 1888]
    let current_rotaryTable_val = new Array()

    $close_return.click(() => {
      // window.location.reload();
      self.$('.mask_mid').hide()
    })

    let indexTemp = 0
    $td_btn.click(function () {
      $table.hide()

      const index = $(this).data('index')
      indexTemp = index
      switch (state_btn[index]) {
        case 0:
          $rotaryTable.hide().eq(index - 1).show()
          current_rotaryTable_val = eval(`rotaryTable_val_${index}`)
          var giftNum = 1
          setRotaryTableVal(current_rotaryTable_val, giftNum, 0)
          $con.eq(0).show()
          break
        case 1:
          $con.eq(2).show()
          break
        case 2:
          $con.eq(3).show()
          break
        case 3:
          $con.eq(4).show()
          break
      }

      self.getRedbagXhr1(index).done((res) => {})
    })


    // 以下是轮盘效果实现代码
    const temp_width = this.$(window).innerWidth() / 2
    const temp_height = this.$(window).innerHeight() / 2

    const $btn = this.$('.sure_btn')
    const $status_false = this.$('.status_false')
    const $status_get = this.$('.status_get')
    const $status_fullscreen = this.$('.status_fullscreen')
    // var $close_btn = $(".close_btn");

    // 这里有给程序员控制到底还有几次抽奖机会
    const times = 1

    $status_false.css({
      top: `${temp_height - $status_false.height() / 2}px`,
      left: `${temp_width - $status_false.width() / 2}px`,
    })

    // var giftNum = 2;
    let gift
    const $setGiftName = this.$('.icon_smile_text span')

    const $notice = this.$('.status_get')
    const $notice_noTimes = this.$('.status_false')


    function setRotaryTableVal(val, giftNum, amount) {
      switch (giftNum) {
        case 0:
          gift = 1500
          $setGiftName.html(`${amount}元`)
          break
        case 1:
          gift = 1560
          $setGiftName.html(`${amount}元`)
          break
        case 2:
          gift = 1620
          $setGiftName.html(`${amount}元`)
          break
        case 3:
          gift = 1690
          $setGiftName.html(`${amount}元`)
          break
        case 4:
          gift = 1750
          $setGiftName.html(`${amount}元`)
          break
      }
    }

    this.$('.lot-btn').click(() => {
      self.getRedbagXhr11(indexTemp).done((res) => {
        if (res && res.result == 0) {
          const prizeAmount = res.root / 10000
          let index_ = 0
          const amount = prizeAmount

          // amount =  38;

          if (indexTemp == 1) {
            if (amount == 8) {
              index_ = 0
            }
            if (amount == 10) {
              index_ = 1
            }
            if (amount == 12) {
              index_ = 2
            }
            if (amount == 18) {
              index_ = 3
            }
            if (amount == 25) {
              index_ = 4
            }
          }
          if (indexTemp == 2) {
            if (amount == 15) {
              index_ = 0
            }
            if (amount == 20) {
              index_ = 1
            }
            if (amount == 25) {
              index_ = 2
            }
            if (amount == 38) {
              index_ = 3
            }
            if (amount == 58) {
              index_ = 4
            }
          }
          if (indexTemp == 3) {
            if (amount == 28) {
              index_ = 0
            }
            if (amount == 38) {
              index_ = 1
            }
            if (amount == 58) {
              index_ = 2
            }
            if (amount == 88) {
              index_ = 3
            }
            if (amount == 138) {
              index_ = 4
            }
          }
          if (indexTemp == 4) {
            if (amount == 128) {
              index_ = 0
            }
            if (amount == 158) {
              index_ = 1
            }
            if (amount == 188) {
              index_ = 2
            }
            if (amount == 288) {
              index_ = 3
            }
            if (amount == 388) {
              index_ = 4
            }
          }
          if (indexTemp == 5) {
            if (amount == 328) {
              index_ = 0
            }
            if (amount == 388) {
              index_ = 1
            }
            if (amount == 588) {
              index_ = 2
            }
            if (amount == 888) {
              index_ = 3
            }
            if (amount == 1888) {
              index_ = 4
            }
          }


          setRotaryTableVal(current_rotaryTable_val, index_, amount)

          if (times > 0) {
            for (let i = 0; i <= 10000; i++) {
              $('.image').rotate({
                animateTo: i,
                duration: 1000,
              })

              if (i >= gift) {
                break
              }
            }

            setTimeout(() => {
              $('#lottery,.title_bg,.close_btn,.close_rotarytable').hide()
              $notice.css('display', 'block')
              $status_fullscreen.show()
            }, 1500)
          }
        } else {
          self.$('.js-info1').show()
          $con.eq(0).hide()
          $con.eq(1).hide()
          // Global.ui.notification.show( res.msg);
        }
      })
    })
  },


  getRedbagXhr () {
    return Global.sync.ajax({
      url: 'info/betLottery/info0.json',
      data: {
        activityId: '24',
      },
    })
  },

  getRedbagXhr1 (index) {
    return Global.sync.ajax({
      url: 'info/betLottery/info1.json',
      data: {
        activityId: '24',
        level: index,
      },
    })
  },


  getRedbagXhr11 (index) {
    return Global.sync.ajax({
      url: 'info/betLottery/getbonus.json',
      data: {
        activityId: '24',
        level: index,
      },
    })
  },


  closeActivityHandler () {
    this.destroy()
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState ($target) {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (acctInfo.betLotteryStatus) {
      $target.css('display', 'block')
    } else {
      $target.css('display', 'none')
    }
    if (acctInfo.betLotteryStatus && acctInfo.betLottery) {
      $('body').append(self.render().$el)
    }
  },

})

module.exports = drawActView
