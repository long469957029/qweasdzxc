

require('./../misc/common.js')

require('./jquery.mousewheel')

const AdvertiseView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  onRender() {
    const $container = $('.container')
    const $all_li = $container.find('li')
    const $ul = $container.find('ul')
    const $li_con = $('.li_con')
    const li_length = $all_li.length
    const window_width = $(window).innerWidth()
    const window_height = $(window).innerHeight()
    const ul_height = li_length * window_height
    const $btn_ele = $('.btn_ele')
    let current_num = 0

    $container.css({
      width: `${window_width}px`,
      height: `${window_height}px`,
    })
    $ul.css({
      width: `${window_width}px`,
      height: `${ul_height}px`,
    })
    $li_con.css({
      height: `${window_height}px`,
    })
    $all_li.css({
      width: `${window_width}px`,
      height: `${window_height}px`,
    })

    // 分页动画
    function ele_animate(num) {
      switch (num) {
        case 0:
          $('.ele_01_02').animate({
            opacity: '1',
            bottom: '0%',
          }, () => {
            $('.ele_01_01').animate({
              opacity: '1',
              top: '20%',
            })
          })
          break
        case 1:
          $('.ele_02_01').animate({
            opacity: '1',
            left: '0%',
          }, () => {
            $('.ele_02_text').animate({
              opacity: '1',
              top: '30%',
            })
          })
          break
        case 2:
          $('.ele_03_01').animate({
            opacity: '1',
            bottom: '3%',
          }, () => {
            $('.ele_03_text').animate({
              opacity: '1',
              top: '7%',
            })
          })
          break
        case 3:
          $('.ele_04_01').animate({
            opacity: '1',
            bottom: '0%',
          }, () => {
            $('.ele_04_text').animate({
              opacity: '1',
              top: '7%',
            })
          })
          break
        case 4:
          $('.ele_05_01').animate({
            opacity: '1',
            bottom: '0%',
          }, () => {
            $('.ele_05_text').animate({
              opacity: '1',
              top: '5%',
            })
          })
          break
        case 5:
          $('.ele_06_01').animate({
            opacity: '1',
            bottom: '0%',
          }, () => {
            $('.ele_06_text').animate({
              opacity: '1',
              right: '10%',
            })
          })
          break
        case 6:
          $('.ele_07_01').animate({
            opacity: '1',
            top: '25%',
          }, () => {
            $('.ele_07_text').animate({
              opacity: '1',
              top: '32%',
            })
          })
          break
        case 7:
          $('.ele_08_01').animate({
            opacity: '1',
            top: '15%',
          }, () => {
            $('.ele_08_text').animate({
              opacity: '1',
              top: '32%',
            })
          })
          break
        case 8:
          $('.ele_09_01').animate({
            opacity: '1',
            right: '0%',
          }, () => {
            $('.ele_09_text').animate({
              opacity: '1',
              top: '32%',
            })
          })
          break
        case 9:
          $('.ele_10_01').animate({
            opacity: '1',
            left: '0%',
          }, () => {
            $('.ele_10_text').animate({
              opacity: '1',
              top: '10%',
            })
          })
          break
        case 10:
          $('.ele_11_01').animate({
            opacity: '1',
            right: '0%',
          }, () => {
            $('.ele_11_text').animate({
              opacity: '1',
              top: '12%',
            })
          })
          break
        case 11:
          $('.ele_12_01').animate({
            opacity: '1',
            bottom: '0%',
          }, () => {
            $('.ele_12_text').animate({
              opacity: '1',
              top: '5%',
            }, () => {
              $('.btn').animate({
                opacity: '1',
                bottom: '28px',
              })
            })
          })
          break
      }
    }
    ele_animate(0)
    // 滚动函数
    function wheel(event, delta) {
      if (parseInt($ul.css('top')) <= 0 && parseInt($ul.css('top')) >= (-(window_height * 11))) {
        if (delta == -1) {
          if (parseInt($ul.css('top')) >= (-(window_height * 10))) {
            current_num++
            $container.unbind('mousewheel')
            $ul.animate({
              top: `-=${window_height}px`,
            }, 500, () => {
              $container.bind('mousewheel', (event, delta) => { wheel(event, delta) })
              $btn_ele.removeClass('btn_current')
              $btn_ele.eq(current_num).addClass('btn_current')
              ele_animate(current_num)
            })
          }
        }
        if (delta == 1) {
          if (parseInt($ul.css('top')) < 0) {
            current_num--
            $container.unbind('mousewheel')
            $ul.animate({
              top: `+=${window_height}px`,
            }, 500, () => {
              $container.bind('mousewheel', (event, delta) => { wheel(event, delta) })
              $btn_ele.removeClass('btn_current')
              $btn_ele.eq(current_num).addClass('btn_current')
              ele_animate(current_num)
            })
          }
        }
      }
    }

    $container.bind('mousewheel', (event, delta) => { wheel(event, delta) })

    $btn_ele.click(function() {
      const num = $btn_ele.index($(this))
      current_num = num
      const move_duration = num * window_height
      $btn_ele.removeClass('btn_current')
      $btn_ele.eq(num).addClass('btn_current')

      $container.unbind('mousewheel')
      $ul.animate({
        top: `-${move_duration}px`,
      }, 500, () => {
        $container.bind('mousewheel', (event, delta) => { wheel(event, delta) })
        ele_animate(current_num)
      })
    })
  },
})

module.exports = AdvertiseView

new AdvertiseView({
  el: '.js-package',
}).render()
