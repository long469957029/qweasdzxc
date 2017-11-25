

require('imports?this=>window!./js/jQueryRotate.2.2.js')
require('imports?this=>window!./js/createjs-2015.11.26.min.js')
require('./index.scss')
const effect = require('imports?this=>window!./js/effect.js')

const PirateShipActivity = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-Spec': 'specHandler', // 活动说明
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

  getDrawXhr (isAll) {
    return Global.sync.ajax({
      url: '/info/pirate/doget.json',
      data: {
        resultType: isAll,
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
        if (data) {
          if ((res.root.endDate < t) || res.root.fromDate > t) {
            $alert.addClass('hidden')
            self.remove()
          } else {
            self.$mask.removeClass('hidden')
            $alert.removeClass('hidden')
            self.$total.text(data.count)
            self.$rest.text(data.gotCount)
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

  specHandler () {
    const self = this

    self.getPirateShipInfoXhr()
      .done((res) => {
        const data = res.root
        if (data) {
          self.$notice.find('.js-ta-active-time').text(`${_(data.fromDate).formatDate('YYYY-MM-DD HH:mm:ss')}--${_(data.endDate).formatDate('YYYY-MM-DD HH:mm:ss')}`)
          self.$notice.find('.js-ps-draw-condition').text(_(data.limit).formatDiv(10000))
          self.$notice.find('.js-ps-prize-limit').text(_(data.useLimit).formatDiv(10000))
          self.$notice.find('.js-ps-prize-condition').text(_(data.useAmount).formatDiv(10000))

          self.$ship.hide()
          self.$notice.show()
          self.$notice.css({
            top: `${self.window_height / 2 - self.$notice.height() / 2}px`,
            left: `${self.window_width / 2 - self.$notice.width() / 2}px`,
          })
        }
      })
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
    self.$ship.show()
  },


  onRender () {
    const self = this

    let lib = effect.lib, 
      images = effect.images, 
      ss = effect.ss, 
      AdobeAn = effect.AdobeAn
    let canvas, 
      stage, 
      exportRoot, 
      anim_container, 
      dom_overlay_container, 
      fnStartAnimation

    function init() {
      canvas = self.$('#canvas')[0]
      anim_container = self.$('#animation_container')[0]
      dom_overlay_container = self.$('#dom_overlay_container')[0]
      images = images || {}
      ss = ss || {}
      const loader = new createjs.LoadQueue(false)
      loader.addEventListener('fileload', handleFileLoad)
      loader.addEventListener('complete', handleComplete)
      loader.loadManifest(lib.properties.manifest)
    }

    function handleFileLoad(evt) {
      if (evt.item.type == 'image') {
        images[evt.item.id] = evt.result
      }
    }

    function handleComplete(evt) {
      // This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
      const queue = evt.target
      const ssMetadata = lib.ssMetadata
      for (let i = 0; i < ssMetadata.length; i++) {
        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
          images: [queue.getResult(ssMetadata[i].name)],
          frames: ssMetadata[i].frames,
        })
      }
      exportRoot = new lib.effect()
      stage = new createjs.Stage(canvas)
      stage.addChild(exportRoot)
      // Registers the "tick" event listener.
      fnStartAnimation = function () {
        createjs.Ticker.setFPS(lib.properties.fps)
        createjs.Ticker.addEventListener('tick', stage)
      }
      // Code to support hidpi screens and responsive scaling.
      function makeResponsive(isResp, respDim, isScale, scaleType) {
        let lastW, 
          lastH, 
          lastS = 1
        window.addEventListener('resize', resizeCanvas)
        resizeCanvas()
        function resizeCanvas() {
          let w = lib.properties.width, 
            h = lib.properties.height
          let iw = window.innerWidth, 
            ih = window.innerHeight
          let pRatio = window.devicePixelRatio || 1, 
            xRatio = iw / w, 
            yRatio = ih / h, 
            sRatio = 1
          if (isResp) {
            if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
              sRatio = lastS
            } else if (!isScale) {
              if (iw < w || ih < h) { sRatio = Math.min(xRatio, yRatio) }
            } else if (scaleType == 1) {
              sRatio = Math.min(xRatio, yRatio)
            } else if (scaleType == 2) {
              sRatio = Math.max(xRatio, yRatio)
            }
          }
          canvas.width = w * pRatio * sRatio
          canvas.height = h * pRatio * sRatio
          canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = `${w * sRatio}px`
          canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = `${h * sRatio}px`
          stage.scaleX = pRatio * sRatio
          stage.scaleY = pRatio * sRatio
          lastW = iw
          lastH = ih
          lastS = sRatio
        }
      }

      makeResponsive(false, 'both', false, 1)
      fnStartAnimation()
    }

    init()


    this.$mask = this.$('.js-pirateship-mask')
    this.window_width = $(window).innerWidth()
    this.window_height = $(window).innerHeight()
    this.$pop = this.$('.js-pop')
    this.$pop.css({
      top: `${(self.window_height - 650) / 2}px`,
      left: `${(self.window_width - 550) / 2}px`,
    })

    this.$ship = this.$('#animation_container,.btn_lump,.info_01,.info_02,.close_btn')

    this.$close_btn = $('.close_btn')
    this.$ul = this.$('.prompt_content_ps ul')

    this.$spec = this.$('.js-Spec')

    this.$total = this.$('.js-total')
    this.$rest = this.$('.js-rest')

    this.$notice1 = this.$('.notice_circle1')
    this.$notice2 = this.$('.notice_circle2')
    this.$notice3 = this.$('.notice_circle3')
    this.$notice4 = this.$('.notice_circle4')
    this.$notice5 = this.$('.notice_circle5')
    this.$notice6 = this.$('.notice_circle6')
    this.$notice7 = this.$('.notice_circle7')
    this.$notice7_text7 = this.$('.notice_infor_text7')
    this.$notice = this.$('.js-ps-notice')
    this.$btn_one_1 = this.$('.notice_circle3 .js-start-draw')
    this.$btn_one_2 = this.$('.notice_circle4 .js-start-draw')
    this.$btn_all = this.$('.js-start-draw-all')
    this.$lottery = this.$('#lottery_wheel')
    this.$imgs = this.$('#imgs')
    this.$lot_btn = this.$('.lot-btn')
  },

  grab () {
    const self = this
    this.getPirateShipInfoXhr()
      .done(function (res) {
        let data
        if (res && res.result === 0) {
          data = res.root || []
          this.hasDrawRight = parseInt(data.validBet / data.limit)
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
              self.$notice3.find('span').text(_(data.validBet).formatDiv(10000))
              self.$notice3.show()
              self.$notice3.css({
                top: `${self.window_height / 2 - self.$notice3.height() / 2}px`,
                left: `${self.window_width / 2 - self.$notice3.width() / 2}px`,
              })
            }
          } else {
            self.$ship.hide()
            self.$notice2.find('span').text(_(data.limit).formatDiv(10000))
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
      })
  },

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
                  // 判断是否可以兑奖
                  if (data[0].result > 0) {
                    self.$ship.hide()
                    self.$notice6.show()
                    self.$notice6.css({
                      top: `${self.window_height / 2 - self.$notice6.height() / 2}px`,
                      left: `${self.window_width / 2 - self.$notice6.width() / 2}px`,
                    })
                  } else {
                    self.$ship.hide()
                    self.$notice7_text7.html('奖品已经被抢完了，敬请留意下次活动时间！')
                    self.$notice7.show()
                    self.$notice7.css({
                      top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
                      left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
                    })
                  }
                } else {
                  self.$ship.hide()
                  self.$notice5.find('span').text(_(infodata.validUseBet).formatDiv(10000))
                  self.$notice5.show()
                  self.$notice5.css({
                    top: `${self.window_height / 2 - self.$notice5.height() / 2}px`,
                    left: `${self.window_width / 2 - self.$notice5.width() / 2}px`,
                  })
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

  drawStart (e) {
    const self = this
    const str1 = [0, 2, 4]
    const str2 = [1, 3]
    let random

    const $target = $(e.currentTarget)
    // 0单次，1全抽
    let drawTimes
    if ($target.is(self.$btn_one_1) || $target.is(self.$btn_one_2)) {
      drawTimes = 0
    } else if ($target.is(self.$btn_all)) {
      drawTimes = 1
    } else {
      return
    }

    self.$notice3.hide()
    self.$notice4.hide()
    self.$lottery.show()
    self.$lot_btn.trigger('click')

    this.getDrawXhr(drawTimes)
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || []
          let giftNum
          if (data[0].result > 0) {
            random = Math.floor(Math.random() * str1.length)
            giftNum = str1[random]
          } else {
            random = Math.floor(Math.random() * str2.length)
            giftNum = str2[random]
          }

          // 动画开始
          self.startAnimate(drawTimes, giftNum)
        }
      })
  },

  startAnimate (all, giftNum) {
    const self = this
    let gift = 0

    switch (giftNum) {
      case 0:
        gift = 3200
        self.$notice7_text7.html('真幸运，iPhone 7是你的了！<br>这台iPhone 7就当作是小小心意送你了！')
        break
      case 1:
        gift = 3130
        self.$notice7_text7.html('真可惜，没抢到！<br>这一箱的iPhone只能掉到海里喂鱼了！')
        break
      case 2:
        gift = 3060
        self.$notice7_text7.html('真幸运，iPhone 7是你的了！<br>这台iPhone 7就当作是小小心意送你了！')
        break
      case 3:
        gift = 2990
        self.$notice7_text7.html('真可惜，没抢到！<br>这一箱的iPhone只能掉到海里喂鱼了！')
        break
      case 4:
        gift = 2700
        self.$notice7_text7.html('真幸运，iPhone 7是你的了！<br>这台iPhone 7就当作是小小心意送你了！')
        break
    }
    if (self.gift === undefined) {
      self.gift = 0
    }
    self.gift += gift
    // 0单次，1全抽

    if (all == 1) {
      self.$imgs.rotate({
        animateTo: self.gift,
        duration: 6000,
      })

      setTimeout(() => {
        self.$lottery.hide()
        self.$notice7.show()
        self.$notice7.css({
          top: `${self.window_height / 2 - self.$notice7.height() / 2}px`,
          left: `${self.window_width / 2 - self.$notice7.width() / 2}px`,
        })
      }, 6500)
    } else {
      console.log(`debug:${self.gift}`)
      self.$imgs.rotate({
        animateTo: self.gift,
        duration: 3000,
      })

      setTimeout(() => {
        self.$lottery.hide()
        self.$notice7.show()
        self.$notice7.css({
          top: `${self.window_height / 2 - self.$notice7.height() / 2}px`,
          left: `${self.window_width / 2 - self.$notice7.width() / 2}px`,
        })
      }, 3500)
    }
  },

})

// $('.js-package').html(new PirateShipActivity().render().$el);
// $('body').css('background-color','#fff');
module.exports = PirateShipActivity
