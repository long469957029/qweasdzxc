

require('./index.scss')

const AdvertiseView = Base.ItemView.extend({

  template: require('./index.html'),

  onRender() {
    /* 首页幻灯片 */
    // 计算用户当前显示器的大小重新定位幻灯片的尺寸
    // 原始尺寸比例，因为图片默认尺寸为1900*400
    const pic_ratio = 1900 / 580
    const width_temp = parseInt($(window).innerWidth())
    const height_temp = parseInt(width_temp / pic_ratio)

    function initWidthHeight() {
      $('.home_slide_pic_lump').height(height_temp)
      $('.home_slide_pic_lump li').height(height_temp)
      $('.home_slide_pic_lump li img').height(height_temp)
    }

    initWidthHeight($('.home_slide_pic_lump').width())

    const $homeSlidePic = $('.home_slide_pic_lump ul li')
    const $homeSlideBtn = $('.home_slide_pic_btn span')

    $homeSlideBtn.eq(0).addClass('blue')

    $homeSlidePic.css({
      opacity: 0,
      'z-index': 0,
    })
    $homeSlidePic.eq(0).css({
      opacity: 1,
      'z-index': 1,
    })

    function setHomeSlidePic() {
      $homeSlidePic.each(function () {
        if ($(this).css('z-index') == 1) {
          const num = $homeSlidePic.index($(this))
          let nextPic
          if (num == $homeSlidePic.length - 1) {
            $homeSlideBtn.removeClass('blue')
            $homeSlideBtn.eq(0).addClass('blue')
            nextPic = $homeSlidePic.eq(0)
            nextPic.css('opacity', 1)
          } else {
            $homeSlideBtn.removeClass('blue')
            $homeSlideBtn.eq(num + 1).addClass('blue')
            nextPic = $homeSlidePic.eq(num + 1)
            nextPic.css('opacity', 1)
          }
          $(this).animate({
            opacity: '0',
          }, 1000, () => {
            $homeSlidePic.css('z-index', 0)
            nextPic.css('z-index', 1)
          })
        }
      })
    }

    function btnMouseOver(num) {
      $homeSlideBtn.removeClass('blue')
      $homeSlideBtn.eq(num).addClass('blue')
      $homeSlidePic.each(function () {
        if ($(this).css('z-index') == 1) {
          const curPic = $homeSlidePic.eq(num)
          curPic.css('opacity', 1)
          if ($homeSlidePic.is(':animated')) {
            console.log(1)
            $homeSlidePic.stop()
          }
          if (num != $homeSlidePic.index($(this))) {
            $(this).animate({
              opacity: '0',
            }, 200, () => {
              $homeSlidePic.css('z-index', 0)
              curPic.css('z-index', 1)
            })
          }
        }
      })
    }

    let clear_btnMouseOver
    let clear_slidePic = setInterval(setHomeSlidePic, 5000)

    $homeSlideBtn.mouseover(function () {
      clearInterval(clear_slidePic)
      const num = $homeSlideBtn.index($(this))
      clear_btnMouseOver = setTimeout(() => {
        btnMouseOver(num)
      }, 200)
    }).mouseout(() => {
      clear_slidePic = setInterval(setHomeSlidePic, 5000)
      clearTimeout(clear_btnMouseOver)
    })
    $homeSlidePic.mouseover(() => {
      clearInterval(clear_slidePic)
    }).mouseout(() => {
      clear_slidePic = setInterval(setHomeSlidePic, 5000)
    })
    /* 首页幻灯片_ove */
  },
})

module.exports = AdvertiseView

new AdvertiseView({
  el: '.js-package',
}).render()
