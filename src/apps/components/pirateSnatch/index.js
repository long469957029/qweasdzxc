

require('imports?this=>window!./js/jQueryRotate.2.2.js')
require('imports?this=>window!./js/createjs-2015.11.26.min.js')
require('./index.scss')

const PirateShipActivity = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-btn-play': 'specHandler', // 玩法
    'click .js-btn-role': 'roleHandler', // 规则
    'click .js-return': 'returnHandler', // 返回活动主页面
    'click .js-grab': 'grab', // 抽奖判断
    'click .js-cash': 'cash', // 领奖判断
    'click .js-start-draw': 'drawStart', // 开始抽奖
    'click .js-start-draw-all': 'drawStart', // 开始抽奖
    'click .js-result': 'receiveResult', // 领取结果
    'click .js-sure': 'makeSure', // 确认领取
    'click .js-close': 'closeHandler', // 所有关闭按钮
  },

  getPirateShipInfoXhr () {
    return Global.sync.ajax({
      url: '/info/pirate/info.json',
    })
  },

  getDrawXhr (a) {
    return Global.sync.ajax({
      url: '/info/pirate/doget.json',
      data: {
        resultType: a,
      },
    })
  },

  getCashXhr () {
    return Global.sync.ajax({
      url: '/info/pirate/douse.json',
    })
  },
  checkState1 ($alert) {
    const self = this
    const t = new Date().getTime()

    this.getPirateShipInfoXhr()
      .done((res) => {
        self.GameInfo = res
        const data = res.root
        const acctInfo = Global.memoryCache.get('acctInfo')
        const _v = acctInfo.memberLevel
        let limit 
        if (_v == 0) {
          limit = data.limit[0]
        } else if (_v == 1 || _v == 2) {
          limit = data.limit[1]
        } else if (_v == 3 || _v == 4) {
          limit = data.limit[2]
        } else {
          limit = data.limit[3]
        }
        if (data) {
          if ((res.root.endDate < t) || res.root.fromDate > t) {
            $alert.addClass('hidden')
            self.remove()
          } else {
            self.$mask.removeClass('hidden')
            $alert.removeClass('hidden')
            self.$total.text(data.gotCount)
            self.$rest.text(data.count)
            self.$('.js-user-limit').text(_(limit).formatDiv(10000))
            self.$('.js-user-limit1').text(_(limit).formatDiv(10000))
            self.$('.js-user-limit2').text(_(data.limit[1]).formatDiv(10000))
            self.$('.js-user-limit3').text(_(data.limit[2]).formatDiv(10000))
            self.$('.js-user-limit4').text(_(data.limit[3]).formatDiv(10000))
            self.$('.useLimit').text(_(data.useLimit).formatDiv(10000))
            self.$('.useAmount').text(_(data.useAmount).formatDiv(10000))
            self.$('.useAmount1').text(_(data.useAmount).formatDiv(10000))
            self.$('.js-pop-mun').text(data.count)
            // self.rollTimer = setInterval(self.rolling.bind(self), 3000);
            self.rolling()
          }
        }
      })
  },

  initialize () {
    const self = this
    $('body').append(self.render().$el)
  },

  closeHandler () {
    this.$mask.addClass('hidden')
  },
  specHandler (_n) {
    const self = this
    const $play = self.$('.js-play-box')
    const $role = self.$('.js-role-box')
    $play.removeClass('hidden')
    $role.addClass('hidden')
  },
  roleHandler () {
    const self = this
    const $play = self.$('.js-play-box')
    const $role = self.$('.js-role-box')
    $play.addClass('hidden')
    $role.removeClass('hidden')
  },
  rolling () {
    const self = this
    self.renderRollInfo()
    setInterval(() => {
      self.$ul.animate({
        top: '-30px',
      }, 1000, () => {
        const $items = self.$ul.find('li')
        self.$ul.css('top', '0px')
        $items.eq(0).appendTo(self.$ul)
      })
    }, 3000)
  },

  renderRollInfo () {
    const liHtml = []
    _(this.GameInfo.root.dataList).each((item) => {
      liHtml.push(`<li>恭喜<span>${item.username}${item.result}</span></li>`)
    })
    this.$ul.html(liHtml.join(''))
  },
  // 是否可以抽奖
  grab () {
    const self = this
    this.getPirateShipInfoXhr()
      .done(function (res) {
        if (res && res.result === 0) {
          let data
          if (res && res.result === 0) {
            data = res.root || []
            const acctInfo = Global.memoryCache.get('acctInfo')
            const _v = acctInfo.memberLevel
            let limit 
            if (_v == 0) {
              limit = data.limit[0]
            } else if (_v == 1 || _v == 2) {
              limit = data.limit[1]
            } else if (_v == 3 || _v == 4) {
              limit = data.limit[2]
            } else {
              limit = data.limit[3]
            }
            if (data.validBet > limit) {
              this.hasDrawRight = parseInt(data.validBet / limit)
              // 判断是否可以抽奖
              if (this.hasDrawRight > 0) {
                // 能抢几次
                self.$ship.hide()
                if (this.hasDrawRight > 1) {
                  $(self.$notice4.find('span')[0]).text(_(data.validBet).formatDiv(10000))
                  $(self.$notice4.find('span')[1]).text(this.hasDrawRight)
                  self.$notice4.show()
                  self.$notice4.css({
                    top: `${self.window_height / 2 - self.$notice4.height() / 2}px`,
                    left: `${self.window_width / 2 - self.$notice4.width() / 2}px`,
                  })
                } else {
                  $(self.$notice3.find('span')[0]).text(_(data.validBet).formatDiv(10000))
                  self.$notice3.show()
                  self.$notice3.css({
                    top: `${self.window_height / 2 - self.$notice3.height() / 2}px`,
                    left: `${self.window_width / 2 - self.$notice3.width() / 2}px`,
                  })
                }
              } else {
                self.$ship.hide()
                self.$notice2.find('span').text(_(limit).formatDiv(10000))
                self.$notice2.show()
                self.$notice2.css({
                  top: `${self.window_height / 2 - self.$notice2.height() / 2}px`,
                  left: `${self.window_width / 2 - self.$notice2.width() / 2}px`,
                })
              }
            } else {
              self.$ship.hide()
              self.$notice2.find('span').text(_(limit).formatDiv(10000))
              self.$notice2.show()
              self.$notice2.css({
                top: `${self.window_height / 2 - self.$notice2.height() / 2}px`,
                left: `${self.window_width / 2 - self.$notice2.width() / 2}px`,
              })
            }
          } else {
            self.$ship.hide()
            self.$notice1.show()
            self.$notice1.css({
              top: `${self.window_height / 2 - self.$notice1.height() / 2}px`,
              left: `${self.window_width / 2 - self.$notice1.width() / 2}px`,
            })
          } 
        }
      })
  },
  // 直接兑换
  cash () {
    const self = this
    this.getPirateShipInfoXhr()
      .done((res) => {
        let infodata
        if (res && res.result === 0) {
          infodata = res.root || []
          // 判断是否可以兑奖
          if (infodata.validUseBet > infodata.useLimit) {
            self.getCashXhr()
              .done((res) => {
                let data
                if (res && res.result === 0) {
                  data = res.root || []
                  if (data[0].result > 0) {
                    self.$ship.hide()
                    self.$notice6.show()
                    self.$('.js-result').text(_(data[0].result).formatDiv(10000))
                    self.$notice6.css({
                      top: `${self.window_height / 2 - self.$notice6.height() / 2}px`,
                      left: `${self.window_width / 2 - self.$notice6.width() / 2}px`,
                    })
                    self.$notice6.addClass('zoomIn animated')
                  } else {
                    self.$ship.hide()
                    self.$notice7_text7.html('奖品已经被抢完了，<br>敬请留意下次活动时间！')
                    self.$notice7.show()
                    self.$notice7.css({
                      top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
                      left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
                    })
                    self.$notice7.addClass('zoomIn animated')
                  }
                } else {
                  self.$ship.hide()
                  self.$notice5.find('span').text(_(infodata.validUseBet).formatDiv(10000))
                  self.$notice5.show()
                  self.$notice5.css({
                    top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
                    left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
                  })
                  self.$notice5.addClass('zoomIn animated')
                }
              })
          } else {
            self.$ship.hide()
            self.$notice5.find('span').text(_(infodata.validUseBet).formatDiv(10000))
            self.$notice5.show()
            self.$notice5.css({
              top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
              left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
            })
          }
        }
      })
  },
  // 开始抽奖
  drawStart (e) {
    const self = this
    const $target = $(e.currentTarget)
    // 0单次，1全抽
    let drawTimes
    if ($target.is(self.$btn_one_1)) {
      drawTimes = 0
    } else if ($target.is(self.$btn_all)) {
      drawTimes = 1
    } else {
      return
    }
    self.getDrawXhr(drawTimes)
      .done((res) => {
        self.$notice11.hide()
        let data
        if (res && res.result === 0) {
          data = res.root || []
          if (data[0].result > 0) {
            const resultType = data[0].resultType
            if (resultType == 0 || resultType == 200) {
              // 抢到现金
              self.$ship.hide()
              self.$notice3.hide()
              self.$notice4.hide()
              self.$notice10.show()
              self.$('.js-result-num').text(_(data[0].result).formatDiv(10000))
              self.$notice10.css({
                top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
                left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
              })
              self.$notice10.addClass('zoomIn animated')
            } else if (resultType == 201) {
              // 再来一次
              self.$ship.hide()
              self.$notice3.hide()
              self.$notice4.hide()
              self.$notice11.show()
              self.$notice11.css({
                top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
                left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
              })
              self.$notice11.addClass('zoomIn animated')
            } else {
              // 抢到红包
              self.$ship.hide()
              self.$notice3.hide()
              self.$notice4.hide()
              self.$notice9.show()
              self.$('.js-ticket-name').text(data[0].resultName)
              self.$('.js-red-bag').text(_(data[0].result).formatDiv(10000))
              self.$notice9.css({
                top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
                left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
              })
              self.$notice9.addClass('zoomIn animated')
            }
          } else {
            // 没抢到
            self.$ship.hide()
            self.$notice11.hide()
            self.$notice3.hide()
            self.$notice4.hide()
            self.$notice8_text8.html("真可惜，没抢到！<br><br><span style='font-size: 16px;'>这一箱的的宝贝只能掉到海里喂鱼了</span>")
            self.$notice8.show()
            self.$notice8.css({
              top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
              left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
            })
            self.$notice8.addClass('zoomIn animated')
          }
        }
      })


    // 没抢到
    /* self.$ship.hide();
    self.$notice3.hide();
    self.$notice4.hide();
    self.$notice8_text8.html("真可惜，没抢到！<br><br><span style='font-size: 16px;'>这一箱的的宝贝只能掉到海里喂鱼了</span>");
    self.$notice8.show();
    self.$notice8.css({
      "top": (self.window_height / 2 - self.$notice5.height() / 2) + "px",
      "left": (self.window_width / 2 - self.$notice5.width() / 2) + "px"
    }); */


    // 抢到红包
    /* self.$ship.hide();
    self.$notice3.hide();
    self.$notice4.hide();
    self.$notice9.show();
    self.$notice9.css({
      "top": (self.window_height / 2 - self.$notice5.height() / 2) + "px",
      "left": (self.window_width / 2 - self.$notice5.width() / 2) + "px"
    }); */
    // 抢到现金
    /* self.$ship.hide();
    self.$notice3.hide();
    self.$notice4.hide();
    self.$notice10.show();
    self.$notice10.css({
      "top": (self.window_height / 2 - self.$notice5.height() / 2) + "px",
      "left": (self.window_width / 2 - self.$notice5.width() / 2) + "px"
    }); */
  },
  returnHandler () {
    const self = this
    self.$notice.hide()
    self.$notice1.hide()
    self.$notice2.hide()
    self.$notice3.hide()
    self.$notice4.hide()
    self.$notice5.hide()
    self.$notice6.hide()
    self.$notice7.hide()
    self.$notice8.hide()
    self.$notice9.hide()
    self.$notice10.hide()
    self.$notice11.hide()
    self.$ship.show()
  },


  onRender () {
    const self = this
    this.$mask = this.$('.js-pirateship-mask')
    this.window_width = $(window).innerWidth()
    this.window_height = $(window).innerHeight()
    this.$pop = this.$('.js-pop')
    this.$pop.css({
      top: `${(self.window_height - 650) / 2}px`,
      left: `${(self.window_width - 850) / 2}px`,
    })
    this.$ship = this.$('#animation_container,.close_btn')
    this.$close_btn = $('.close_btn')
    this.$ul = this.$('.prompt_content_ps ul')
    this.$spec = this.$('.js-Spec')
    this.$total = this.$('.js-total')
    this.$rest = this.$('.js-rest')
    this.$notice1 = this.$('.notice_circle1')
    this.$notice2 = this.$('.notice2')
    this.$notice3 = this.$('.notice3')
    this.$notice4 = this.$('.notice4')
    this.$notice5 = this.$('.notice5')
    this.$notice6 = this.$('.notice6')
    this.$notice7 = this.$('.notice7')
    this.$notice7_text7 = this.$('.notice_infor_text7')
    this.$notice8 = this.$('.notice8')
    this.$notice8_text8 = this.$('.notice_infor_text8')
    this.$notice9 = this.$('.notice9')
    this.$notice10 = this.$('.notice10')
    this.$notice11 = this.$('.notice11')
    this.$notice = this.$('.js-ps-notice')
    this.$btn_one_1 = this.$('.js-start-draw')
    // this.$btn_one_2 = this.$(".notice_circle4 .js-start-draw");
    this.$btn_all = this.$('.js-start-draw-all')
    this.$lottery = this.$('#lottery_wheel')
    this.$imgs = this.$('#imgs')
    this.$lot_btn = this.$('.lot-btn')
  },
})
module.exports = PirateShipActivity
