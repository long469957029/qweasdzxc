

require('./index.scss')

// 提前加载图片
const img_arr = [new Image(), new Image(), new Image(), new Image(), new Image()]

img_arr[0].src = require('./images/mountain.png')
img_arr[1].src = require('./images/mountain_1.png')
img_arr[2].src = require('./images/mountain_2.png')
img_arr[3].src = require('./images/mountain_3.png')
img_arr[4].src = require('./images/mountain_4.png')

const VolcanicActivity = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-getPrize': 'getPrizeHandler',
    'click .js-red-bag': 'getRedBagHandler',
    'click .js-btn-return': 'returnHandler',
    'click .js-btn-red-bag-return': 'getRedBagReturnHandler',
    'click .js-close': 'closeHandler',
  },

  getRedGabXhr() {
    return Global.sync.ajax({
      url: '/info/volcano/doget.json',
      data: {
        activityId: 27,
      },
    })
  },

  getPrizeXhr() {
    return Global.sync.ajax({
      url: '/info/volcano/douse.json',
      data: {
        activityId: 27,
      },
    })
  },

  getRedBagReturnHandler() {
    this.$pop_contain_02.hide()
    this.$pop_contain_02.eq(0).hide()
    this.$pop_contain_02.eq(1).hide()
    this.$pop_contain_02.eq(2).hide()
    if (Global.m.volcanicActivity.raining) {
      this.$mountain_lump.show()
    } else {
      this.$text_info_lump.show()
    }
  },

  serializeData() {
    return {
      mountain: require('./images/mountain_1.png'),
      closeBtn: require('./images/close_btn.png'),
    }
  },

  onRender() {
    this.$container = this.$('.js-volcanic-mask')
    this.$getPrizeErr = this.$('.js-get-prize-err')
    this.$getPrizeSuccess = this.$('.js-get-prize-success')
    this.$getBagSuccess = this.$('.js-get-bag-success')
    this.$mountain_lump = this.$('.mountain_lump')
    this.$hour = this.$('.hour')
    this.$minute = this.$('.minute')
    this.$second = this.$('.second')
    this.$mountain_shake = this.$('.mountain_shake img')
    this.$pop_contain_02 = this.$('.pop_contain_02')
    this.$getRedBagErr = this.$('.js-get-red-bag-err')

    // 火山效果
    this.$mountain_pic = this.$('.mountain_pic')
    this.$gas = this.$('.gas')

    // 红包效果
    this.$red_bag_01 = this.$('.red_bag_01')
    this.$red_bag_02 = this.$('.red_bag_02')
    this.$red_bag_03 = this.$('.red_bag_03')
    this.$red_bag_04 = this.$('.red_bag_04')
    this.$red_bag_05 = this.$('.red_bag_05')

    this.$text_info_lump = this.$('.text_info_lump')
    this.$pop_contain = this.$('.pop_contain')

    this.updateData(this.options.data)
  },

  redBagAnimate_01() {
    const self = this
    this.$red_bag_01.show()
    let deg = 0
    const high_top = 240
    const end_top = 180
    const init_left = parseInt(this.$red_bag_01.css('left'))
    const init_top = parseInt(this.$red_bag_01.css('top'))
    let cur_left = init_left
    let cur_top = init_top
    let changePath = false
    let clear_rotate
    let clear_animate
    clear_rotate = setInterval(() => {
      if (deg >= 360) {
        deg = 0
        self.$red_bag_01.css('transform', 'rotate(0deg)')
      } else {
        deg++
        self.$red_bag_01.css('transform', `rotate(${deg}0deg)`)
      }
    }, 30)
    clear_animate = setInterval(() => {
      cur_left += 3
      self.$red_bag_01.css('left', `${cur_left}px`)
      if (changePath) {
        if (cur_top <= end_top) {
          cur_top += 3
          self.$red_bag_01.css('top', `${cur_top}px`)
        } else {
          changePath = false
          cur_top = init_top
          cur_left = init_left
          self.$red_bag_01.css('top', `${init_top}px`)
          self.$red_bag_01.css('left', `${init_left}px`)
          clearInterval(clear_rotate)
          clearInterval(clear_animate)
          self.$red_bag_01.hide()
          self.clear_red_bag_01 = setTimeout(() => {
            self.redBagAnimate_01()
          }, 5000)
        }
      } else if (cur_top >= high_top) {
        cur_top -= 2
        self.$red_bag_01.css('top', `${cur_top}px`)
      } else {
        changePath = true
      }
    }, 30)
  },

  redBagAnimate_02() {
    const self = this
    this.$red_bag_02.show()
    let deg = 0
    const high_top = 240
    const end_top = 180
    const init_left = parseInt(self.$red_bag_02.css('left'))
    const init_top = parseInt(self.$red_bag_02.css('top'))
    let cur_left = init_left
    let cur_top = init_top
    let changePath = false
    let clear_rotate
    let clear_animate
    clear_rotate = setInterval(() => {
      if (deg <= -360) {
        deg = 0
        self.$red_bag_02.css('transform', 'rotate(0deg)')
      } else {
        deg--
        self.$red_bag_02.css('transform', `rotate(${deg}0deg)`)
      }
    }, 30)
    clear_animate = setInterval(() => {
      cur_left -= 4
      self.$red_bag_02.css('left', `${cur_left}px`)
      if (changePath) {
        if (cur_top <= end_top) {
          cur_top += 3
          self.$red_bag_02.css('top', `${cur_top}px`)
        } else {
          changePath = false
          cur_top = init_top
          cur_left = init_left
          self.$red_bag_02.css('top', `${init_top}px`)
          self.$red_bag_02.css('left', `${init_left}px`)
          clearInterval(clear_rotate)
          clearInterval(clear_animate)
          self.$red_bag_02.hide()
          self.clear_red_bag_02 = setTimeout(() => {
            self.redBagAnimate_02()
          }, 3000)
        }
      } else if (cur_top >= high_top) {
        cur_top -= 2
        self.$red_bag_02.css('top', `${cur_top}px`)
      } else {
        changePath = true
      }
    }, 30)
  },

  redBagAnimate_03() {
    const self = this
    this.$red_bag_03.show()
    let deg = 0
    const high_top = 180
    const end_top = 180
    const init_left = parseInt(self.$red_bag_03.css('left'))
    const init_top = parseInt(self.$red_bag_03.css('top'))
    let cur_left = init_left
    let cur_top = init_top
    let changePath = false
    let clear_rotate
    let clear_animate
    clear_rotate = setInterval(() => {
      if (deg <= -360) {
        deg = 0
        self.$red_bag_03.css('transform', 'rotate(0deg)')
      } else {
        deg--
        self.$red_bag_03.css('transform', `rotate(${deg}0deg)`)
      }
    }, 30)
    clear_animate = setInterval(() => {
      cur_left -= 3
      self.$red_bag_03.css('left', `${cur_left}px`)
      if (changePath) {
        if (cur_top <= end_top) {
          cur_top += 3
          self.$red_bag_03.css('top', `${cur_top}px`)
        } else {
          changePath = false
          cur_top = init_top
          cur_left = init_left
          self.$red_bag_03.css('top', `${init_top}px`)
          self.$red_bag_03.css('left', `${init_left}px`)
          clearInterval(clear_rotate)
          clearInterval(clear_animate)
          self.$red_bag_03.hide()
          self.clear_red_bag_03 = setTimeout(() => {
            self.redBagAnimate_03()
          }, 7000)
        }
      } else if (cur_top >= high_top) {
        cur_top -= 2
        self.$red_bag_03.css('top', `${cur_top}px`)
      } else {
        changePath = true
      }
    }, 30)
  },

  redBagAnimate_04() {
    const self = this
    this.$red_bag_04.show()
    let deg = 0
    const high_top = 240
    const end_top = 180
    const init_left = parseInt(self.$red_bag_04.css('left'))
    const init_top = parseInt(self.$red_bag_04.css('top'))
    let cur_left = init_left
    let cur_top = init_top
    let changePath = false
    let clear_rotate
    let clear_animate
    clear_rotate = setInterval(() => {
      if (deg >= 360) {
        deg = 0
        self.$red_bag_04.css('transform', 'rotate(0deg)')
      } else {
        deg++
        self.$red_bag_04.css('transform', `rotate(${deg}0deg)`)
      }
    }, 30)
    clear_animate = setInterval(() => {
      cur_left += 1
      self.$red_bag_04.css('left', `${cur_left}px`)
      if (changePath) {
        if (cur_top <= end_top) {
          cur_top += 3
          self.$red_bag_04.css('top', `${cur_top}px`)
        } else {
          changePath = false
          cur_top = init_top
          cur_left = init_left
          self.$red_bag_04.css('top', `${init_top}px`)
          self.$red_bag_04.css('left', `${init_left}px`)
          clearInterval(clear_rotate)
          clearInterval(clear_animate)
          self.$red_bag_04.hide()
          self.clear_red_bag_04 = setTimeout(() => {
            self.redBagAnimate_04()
          }, 4000)
        }
      } else if (cur_top >= high_top) {
        cur_top -= 2
        self.$red_bag_04.css('top', `${cur_top}px`)
      } else {
        changePath = true
      }
    }, 30)
  },

  redBagAnimate_05() {
    const self = this
    this.$red_bag_05.show()
    let deg = 0
    const high_top = 180
    const end_top = 180
    const init_left = parseInt(self.$red_bag_05.css('left'))
    const init_top = parseInt(self.$red_bag_05.css('top'))
    let cur_left = init_left
    let cur_top = init_top
    let changePath = false
    let clear_rotate
    let clear_animate
    clear_rotate = setInterval(() => {
      if (deg <= -360) {
        deg = 0
        self.$red_bag_05.css('transform', 'rotate(0deg)')
      } else {
        deg--
        self.$red_bag_05.css('transform', `rotate(${deg}0deg)`)
      }
    }, 30)
    clear_animate = setInterval(() => {
      cur_left -= 1
      self.$red_bag_05.css('left', `${cur_left}px`)
      if (changePath) {
        if (cur_top <= end_top) {
          cur_top += 3
          self.$red_bag_05.css('top', `${cur_top}px`)
        } else {
          changePath = false
          cur_top = init_top
          cur_left = init_left
          self.$red_bag_05.css('top', `${init_top}px`)
          self.$red_bag_05.css('left', `${init_left}px`)
          clearInterval(clear_rotate)
          clearInterval(clear_animate)
          self.$red_bag_05.hide()
          self.clear_red_bag_05 = setTimeout(() => {
            self.redBagAnimate_05()
          }, 8000)
        }
      } else if (cur_top >= high_top) {
        cur_top -= 2
        self.$red_bag_05.css('top', `${cur_top}px`)
      } else {
        changePath = true
      }
    }, 30)
  },

  gasAniamte() {
    const self = this
    this.$gas.animate({
      top: '-=50px',
      opacity: '0',
    }, 300, () => {
      self.$gas.css({
        left: '-=30px',
        top: '+=10px',
        opacity: '1',
      })
      self.$gas.animate({
        top: '-=50px',
        opacity: '0',
      }, 300, () => {
        self.$gas.css({
          left: '+=40px',
          top: '+=40px',
          opacity: '1',
        })
        self.$gas.animate({
          top: '-=50px',
          opacity: '0',
        }, () => {
          self.openAllRedBagAnimate()
        })
      })
    })
  },

  // 火山动画从火山抖动开始
  mountainShake() {
    const self = this
    // var duration = 20;
    // var num = 0;
    // var img_num = 1;
    //
    // var clear_shake = setInterval(function() {
    //   img_num++;
    //   self.$mountain_shake.attr("src", img_arr[img_num].src);
    //
    //   if(img_num > 3) {
    //     img_num = 1;
    //   }
    //   num++;
    //   if(num >= duration) {
    //     clearInterval(clear_shake);
    //     self.$(".mountain_shake").remove();
    //     self.$mountain_pic.show();
    //     self.$gas.show();
    //     self.gasAniamte();
    //   }
    // }, 100);
    this.$('.mountain_shake').addClass('shake-horizontal shake-constant')
    setTimeout(() => {
      self.$('.mountain_shake').remove()
      self.$mountain_pic.show()
      self.$gas.show()
      self.gasAniamte()
    }, 1000)
  },

  // 启动所有红包动画
  openAllRedBagAnimate() {
    const self = this
    this.clearAllRedBagAnimate()
    this.$gas.css('top', '-70px')
    this.$gas.css('left', '418px')
    this.redBagAnimate_01()
    setTimeout(() => {
      self.redBagAnimate_02()
    }, 2000)
    setTimeout(() => {
      self.redBagAnimate_03()
    }, 4000)
    setTimeout(() => {
      self.redBagAnimate_04()
    }, 3000)
    setTimeout(() => {
      self.redBagAnimate_05()
    }, 1000)
  },

  // 启动预计开始倒计时
  countdownReady(second) {
    const self = this
    // var old_time = (new Date()).getTime();
    // var new_time = old_time;
    clearInterval(this.clear_ready)
    --second
    this.clear_ready = setInterval(() => {
      // new_time = (new Date()).getTime();
      // if((new_time - old_time) >= 1000) {
      //   ready_time_millisecond -= 1000;
      //   old_time = new_time;
      // }
      second--

      if (second < 0) {
        second = 0
      }
      self.setTime(second)
    }, 1000)
  },

  startBurst(duration) {
    const self = this
    setTimeout(() => {
      Global.m.volcanicActivity.raining = false
      self.clearAllRedBagAnimate()
      self.$pop_contain_02.hide()
      self.$mountain_lump.hide()
      self.show()
    }, duration * 1000)

    this.clearAllRedBagAnimate()
    // 倒计时完毕，领取奖金规则表隐藏并显示火山
    this.$mountain_lump.css({
      left: `${this.getHalfWindow().width - this.$mountain_lump.width() / 2}px`,
      bottom: '0px',
    })
    this.$mountain_lump.show()
    this.mountainShake()
    this.$text_info_lump.hide()
    // 将所有可能打开的弹窗隐藏
    this.$pop_contain.hide()
    this.$pop_contain_02.hide()
  },

  // 设置具体时间
  setTime(detail_time) {
    const all_second = Math.floor(detail_time)
    const hour = Math.floor(Math.floor(all_second / 60) / 60)
    const minute = Math.floor(all_second / 60) - hour * 60
    const second = all_second - (hour * 60 * 60 + minute * 60)

    if (hour < 10) {
      this.$hour.text(`0${hour}`)
    } else {
      this.$hour.text(hour)
    }
    if (minute < 10) {
      this.$minute.text(`0${minute}`)
    } else {
      this.$minute.text(minute)
    }
    if (second < 10) {
      this.$second.text(`0${second}`)
    } else {
      this.$second.text(second)
    }
  },

  updateData(data) {
    this.options.data = data

    let condition
    switch (data.conditionType) {
      case -1:
        condition = '无条件'
        break
      case 0:
        condition = '投注'
        break
      case 1:
        condition = '充值'
        break
      case 2:
        condition = '提现'
        break
    }
    if (data.conditionType !== -1) {
      this.$('.js-condition').text(`需在平台${condition}满${_(data.conditionLimit).convert2yuan()}元以上。`)
    } else {
      this.$('.js-condition').text('无条件。')
    }
    this.$('.js-amountTotal').text(`${_(data.amountTotal).convert2yuan()}元`)
    this.$('.js-useDate').html(`${_(data.useFromDate).toDate('MM月DD日')}<br>${_(data.useFromDate).toTime('HH:mm')}-${_(data.useEndDate).toTime('HH:mm')}`)
    this.$('.js-useDate-brief').html(`${_(data.useFromDate).toDate('MM月DD日') + _(data.useFromDate).toTime('HH:mm')}-${_(data.useEndDate).toTime('HH:mm')}`)

    this.countdownReady(data.nextTime)
  },

  show() {
    this.$container.removeClass('hidden')

    this.$pop_contain.eq(0).hide()
    this.$pop_contain.eq(1).hide()
    this.$text_info_lump.show()
    this.$text_info_lump.css({
      left: `${this.getHalfWindow().width - this.$text_info_lump.width() / 2}px`,
      top: `${this.getHalfWindow().height - this.$text_info_lump.height() / 2 + 50}px`,
    })
  },

  getHalfWindow() {
    return {
      width: $(window).innerWidth() / 2,
      height: $(window).innerHeight() / 2,
    }
  },


  clearAllRedBagAnimate() {
    clearTimeout(this.clear_red_bag_01)
    clearTimeout(this.clear_red_bag_02)
    clearTimeout(this.clear_red_bag_03)
    clearTimeout(this.clear_red_bag_04)
    clearTimeout(this.clear_red_bag_05)
  },

  // eventHandlers

  getPrizeHandler() {
    const self = this
    this.getPrizeXhr()
      .done((res) => {
        let data
        let prize
        data = res.root || []
        data = data[0]

        self.$pop_contain.css({
          left: `${self.getHalfWindow().width - self.$pop_contain.width() / 2}px`,
          top: `${self.getHalfWindow().height - self.$pop_contain.height() / 2 + 70}px`,
        })

        if (res.result === 0 && data.result != 0) {
          prize = _(data.result).convert2yuan()
          self.$getPrizeSuccess.text(prize)
          self.$pop_contain.hide()
          self.$pop_contain.eq(0).show()
          self.$text_info_lump.hide()
          Global.m.volcanicActivity.check()
        } else {
          self.$getPrizeErr.text(res.msg === 'ok' ? '当前红包奖励还没有，或者已被您领取过了。' : res.msg)
          self.$pop_contain.hide()
          self.$pop_contain.eq(1).show()
          self.$text_info_lump.hide()
        }
      })
  },

  getRedBagHandler() {
    const self = this
    this.getRedGabXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || []
          data = data[0]
          if (Number(data.result) > 0) {
            self.$getBagSuccess.text(_(data.result).convert2yuan())
            self.$pop_contain_02.hide()
            self.$pop_contain_02.eq(1).hide()
            self.$pop_contain_02.eq(2).hide()
            self.$pop_contain_02.eq(0).show()
            self.$mountain_lump.hide()
            Global.m.volcanicActivity.check()
          } else {
            self.$pop_contain_02.hide()
            self.$pop_contain_02.eq(0).hide()
            self.$pop_contain_02.eq(1).show()
            self.$pop_contain_02.eq(2).hide()
            self.$mountain_lump.hide()
          }
        } else {
          self.$getRedBagErr.text(res.msg)
          self.$pop_contain_02.hide()
          self.$pop_contain_02.eq(0).hide()
          self.$pop_contain_02.eq(1).hide()
          self.$pop_contain_02.eq(2).show()
          self.$mountain_lump.hide()
        }
      })

    this.$pop_contain_02.css({
      left: `${this.getHalfWindow().width - this.$pop_contain_02.width() / 2}px`,
      top: `${this.getHalfWindow().height - this.$pop_contain_02.height() / 2 + 70}px`,
    })
  },

  returnHandler() {
    this.$pop_contain.eq(0).hide()
    this.$pop_contain.eq(1).hide()
    this.$text_info_lump.show()
    this.$text_info_lump.css({
      left: `${this.getHalfWindow().width - this.$text_info_lump.width() / 2}px`,
      top: `${this.getHalfWindow().height - this.$text_info_lump.height() / 2 + 50}px`,
    })
  },

  closeHandler() {
    this.$container.addClass('hidden')

    this.$mountain_lump.hide()
    this.$pop_contain.eq(0).hide()
    this.$pop_contain.eq(1).hide()
    this.$text_info_lump.show()
    this.$text_info_lump.css({
      left: `${this.getHalfWindow().width - this.$text_info_lump.width() / 2}px`,
      top: `${this.getHalfWindow().height - this.$text_info_lump.height() / 2 + 50}px`,
    })

    this.clearAllRedBagAnimate()
  },

  onDestroy() {
    Global.ui.notification.setPrevent(false)
  },
})

module.exports = VolcanicActivity
