

require('imports?this=>window!./js/jQueryRotate.2.2.js')
require('imports?this=>window!./js/createjs-2015.11.26.min.js')
// require('imports?this=>window!./js/preloadjs-0.6.2.combined.js');
const effect = require('imports?this=>window!./js/effect.js')

const HomeView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
    })
  },

  onRender() {
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
      canvas = document.getElementById('canvas')
      anim_container = document.getElementById('animation_container')
      dom_overlay_container = document.getElementById('dom_overlay_container')
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

    $(() => {
      init()
      const window_width = $(window).innerWidth()
      const window_height = $(window).innerHeight()

      const $mask = $('.mask')
      const $pop = $('.pop')

      $pop.css({
        top: `${window_height / 2 - $pop.height() / 2 - 20}px`,
        left: `${window_width / 2 - $pop.width() / 2}px`,
      })

      const $close_btn = $('.close_btn')

      $close_btn.click(() => {
        $mask.remove()
      })

      // 获奖名单滚动
      const $ul = $('.prompt_content ul')

      function rolling() {
        $ul.animate({
          top: '-30px',
        }, 1000, () => {
          $ul.css('top', '0px')
          $ul.find('li:eq(0)').appendTo($ul)
        })
      }

      $ul.each(() => {
        setInterval(rolling, 3000)
      })
      // 获奖名单滚动_over

      // 抽奖轮盘

      // 海盗船主题区
      const $ship = $('#animation_container,.btn_lump,.info_01,.info_02,.close_btn')
      // 抽奖轮盘区
      const $lottery = $('#lottery')
      // 这里判断抽奖要不要一次性撸完
      /*
             all = 0 的时候，就是一次次来
             */
      let all = 1
      // 这里判断抽奖几等奖
      const giftNum = 3
      let gift
      const $setInfor = $('.notice_infor_text')

      const $notice = $('.notice_circle')
      const $notice2 = $('.notice_circle2')
      const $notice3 = $('.notice_circle3')
      const $notice4 = $('.notice_circle4')
      const $notice5 = $('.notice_circle5')
      const $notice6 = $('.notice_circle6')
      const $notice_info = $('.notice')

      $notice.css({
        top: `${window_height / 2 - $notice.height() / 2}px`,
        left: `${window_width / 2 - $notice.width() / 2}px`,
      })
      $notice2.css({
        top: `${window_height / 2 - $notice2.height() / 2}px`,
        left: `${window_width / 2 - $notice2.width() / 2}px`,
      })
      $notice3.css({
        top: `${window_height / 2 - $notice3.height() / 2}px`,
        left: `${window_width / 2 - $notice3.width() / 2}px`,
      })
      $notice4.css({
        top: `${window_height / 2 - $notice4.height() / 2}px`,
        left: `${window_width / 2 - $notice4.width() / 2}px`,
      })
      $notice5.css({
        top: `${window_height / 2 - $notice5.height() / 2}px`,
        left: `${window_width / 2 - $notice5.width() / 2}px`,
      })
      $notice6.css({
        top: `${window_height / 2 - $notice6.height() / 2}px`,
        left: `${window_width / 2 - $notice6.width() / 2}px`,
      })
      $notice_info.css({
        top: `${window_height / 2 - $notice_info.height() / 2}px`,
        left: `${window_width / 2 - $notice_info.width() / 2}px`,
      })

      const $closeBtn = $('.pop_close_btn')

      switch (giftNum) {
        case 0:
          gift = 3200
          $setInfor.html('真幸运，iPhone 7是你的了！<br>这台iPhone 7就当作是小小心意送你了！')
          break
        case 1:
          gift = 3130
          $setInfor.html('真可惜，没抢到！<br>这一箱的iPhone只能掉到海里喂鱼了！')
          break
        case 2:
          gift = 3060
          $setInfor.html('真幸运，iPhone 7是你的了！<br>这台iPhone 7就当作是小小心意送你了！')
          break
        case 3:
          gift = 2990
          $setInfor.html('真可惜，没抢到！<br>这一箱的iPhone只能掉到海里喂鱼了！')
          break
        case 4:
          gift = 2700
          $setInfor.html('真幸运，iPhone 7是你的了！<br>这台iPhone 7就当作是小小心意送你了！')
          break
      }

      $('.lot-btn').click(() => {
        if (all) {
          for (var i = 0; i <= 30000; i++) {
            $('#imgs').rotate({
              animateTo: i,
              duration: 5000,
            })
            if (i >= gift) {
              break
            }
          }
          setTimeout(() => {
            $lottery.hide()
            $notice.css('display', 'block')
          }, 5500)
        } else {
          for (var i = 0; i <= 30000; i++) {
            $('#imgs').rotate({
              animateTo: i,
              duration: 3000,
            })
            if (i >= gift) {
              break
            }
          }
          setTimeout(() => {
            $lottery.hide()
            $notice.css('display', 'block')
          }, 3500)
        }
      })


      // 返回及关闭按钮
      const $return = $('.btn_03,.btn_05')
      $return.click(() => {
        window.location.reload()
      })
      $closeBtn.click(() => {
        window.location.reload()
      })

      // 抽奖轮盘_over


      // 抢按钮
      const $btn_01 = $('.btn_01')
      // 兑按钮
      const $btn_02 = $('.btn_02')
      // 撸一发按钮
      const $btn_one = $('.btn_04')
      // 撸完按钮
      const $btn_all = $('.btn_06')
      // 这里判断抽奖能不能抽奖
      /*
             flag = 0 的时候，就是您的消费额还不足1000，暂无法抽奖
             flag = 1 的时候，可以撸一发
             flag = 2 的时候，可以撸连发
             */
      const flag = 2
      // 这里判断能不能兑换
      /*
             can = false 的时候，不能兑换
             can = true 的时候，可以兑换
             */
      const can = true

      $btn_02.click(() => {
        if (can) {
          $ship.hide()
          $notice6.show()
        } else {
          $ship.hide()
          $notice5.show()
        }
      })

      $btn_01.click(() => {
        switch (flag) {
          case 0:
            $ship.hide()
            $notice2.show()
            break
          case 1:
            $ship.hide()
            $notice3.show()
            break
          case 2:
            $ship.hide()
            $notice4.show()
            break
        }
      })

      $btn_one.click(() => {
        all = 0
        $notice3.hide()
        $notice4.hide()
        $lottery.show()
        $('.lot-btn').trigger('click')
      })
      $btn_all.click(() => {
        all = 1
        $notice3.hide()
        $notice4.hide()
        $lottery.show()
        $('.lot-btn').trigger('click')
      })

      // 玩法说明及海盗船游戏按钮
      const $btn_game = $('.btn_game')
      const $btn_notice = $('.btn_notice')


      $btn_game.click(() => {
        $notice_info.hide()
        $ship.show()
      })
      $btn_notice.click(() => {
        $notice_info.show()
        $ship.hide()
      })
    })
  },


})

// $('.js-package').html(new HomeView().render().$el);
// $('body').css('background-color','#fff');
