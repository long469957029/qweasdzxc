$(() => {
  // initialization
  const $main_contain = $('.main_contain')
  const $btn_ele = $('.btn_ele')
  const $ul = $main_contain.find('.elements')
  let current_num = 0
  const window_width = $(window).innerWidth()
  const window_height = $(window).innerHeight()
  // 元素本身实际高度是1024px
  const ele_height = 1024
  const $con_lump = $('.con_lump')
  const $loading = $('.loading')

  $loading.css({
    top: `${window_height / 2 - 74}px`,
    left: `${window_width / 2 - 74}px`,
  })
  $main_contain.css({
    width: `${window_width}px`,
    height: `${window_height}px`,
  })
  $con_lump.css({
    left: `${window_width / 2 - $con_lump.width() / 2}px`,
  })
  // 单独处理第三页
  $('.con_bg_03').css({
    width: `${window_width}px`,
    height: `${window_height}px`,
    left: '0px',
  })
  // 单独处理第三页_over

  // loading
  const $all_img = $('img')
  const all_img_length = $all_img.length
  let loading_count = 0

  function loading() {
    $all_img.load(() => {
      loading_count++
      if (loading_count >= all_img_length) {
        $loading.animate({
          opacity: '0',
        }, 200, () => {
          $loading.hide()
          $main_contain.animate({
            opacity: '1',
          }, 500, () => {
            // 加载完成后直接启动第一页动画
            page_animate_01()
          })
        })
      }
    })
  }

  loading()

  // 滚轮函数
  function wheel(event, delta) {
    if (parseInt($ul.css('top')) <= 0 && parseInt($ul.css('top')) >= (-(ele_height * 5))) {
      if (delta == -1) {
        if (parseInt($ul.css('top')) >= (-(ele_height * 4))) {
          current_num++
          $main_contain.unbind('mousewheel')
          $ul.animate({
            top: `-=${ele_height}px`,
          }, 500, () => {
            $main_contain.bind('mousewheel', (event, delta) => {
              wheel(event, delta)
            })
            $btn_ele.removeClass('btn_current')
            $btn_ele.eq(current_num).addClass('btn_current')
            ele_animate(current_num)
          })
        }
      }
      if (delta == 1) {
        if (parseInt($ul.css('top')) < 0) {
          current_num--
          $main_contain.unbind('mousewheel')
          $ul.animate({
            top: `+=${ele_height}px`,
          }, 500, () => {
            $main_contain.bind('mousewheel', (event, delta) => {
              wheel(event, delta)
            })
            $btn_ele.removeClass('btn_current')
            $btn_ele.eq(current_num).addClass('btn_current')
            ele_animate(current_num)
          })
        }
      }
    }
  }

  $main_contain.bind('mousewheel', (event, delta) => {
    wheel(event, delta)
  })

  // 滚轮函数_over

  // 分页动画
  let page_01_flag = true
  let page_02_flag = true
  let page_03_flag = true
  let page_04_flag = true
  let page_05_flag = true
  let page_06_flag = true

  // 页面3背景动画
  const $page03Bg = $('.con_bg_03 img')
  let p03bg_speed = 1
  let p03bg_num = 0.001
  let clear_page_03_bg

  function page03Bg() {
    if (parseInt(p03bg_speed * 10) > 12) {
      p03bg_num *= -1
    }
    if (parseInt(p03bg_speed * 10) < 10) {
      p03bg_num *= -1
    }
    p03bg_speed += p03bg_num
    $page03Bg.css('transform', `scale(${p03bg_speed})`)
  }

  // 启动
  clear_page_03_bg = setInterval(page03Bg, 50)

  // 页面3背景动画_over

  // 页面4背景动画
  const $page04Bg = $('.city_pic')
  let p04bg_speed = 1
  let p04num = 0
  let clear_page_04_bg

  function page04Bg() {
    if (parseInt($page04Bg.css('left')) < -300) {
      p04bg_speed *= -1
    }
    if (parseInt($page04Bg.css('left')) > 0) {
      p04bg_speed *= -1
    }
    p04num += p04bg_speed
    $page04Bg.css('left', `${p04num}px`)
  }

  // 启动
  clear_page_04_bg = setInterval(page04Bg, 70)

  // 页面4背景动画_over

  // 页面05手机动画
  const $page_05_phone = $('.page_05_phone')

  function page05Phone() {
    setInterval(() => {
      if ($page_05_phone.css('opacity') == 1) {
        $page_05_phone.animate({
          opacity: '0',
        }, 500)
      } else {
        $page_05_phone.animate({
          opacity: '1',
        }, 500)
      }
    }, 3000)
  }

  // 页面05手机动画_over

  // 页面06卷轴动画
  const $page_06_left_pic = $('.page_06_left_pic')
  const $page_06_right_pic = $('.page_06_right_pic')

  function page06Left() {
    $page_06_left_pic.animate({
      left: '0px',
    }, 2000)
  }

  function page06Right() {
    $page_06_right_pic.animate({
      left: '0px',
    }, 2000, () => {
      // 显示图片链接
      $('.page_06_link').show()
    })
  }

  // 页面06卷轴动画_over

  function ele_animate(num) {
    switch (num) {
      case 0:
        if (page_01_flag) {
          page_01_flag = false
          // page_animate_01();
        }
        break
      case 1:
        if (page_02_flag) {
          page_02_flag = false
          page_animate_02()
        }
        break
      case 2:
        if (page_03_flag) {
          page_03_flag = false
          $('.page_03_title').animate({
            opacity: '1',
          }, 1000, () => {
            $('.page_03_des').animate({
              opacity: '1',
            }, 1000, () => {
              $('.p_03_e_01').animate({
                opacity: '1',
                top: '0px',
                left: '0px',
              }, 500, () => {
                $('.p_03_e_02').animate({
                  opacity: '1',
                  top: '0px',
                  left: '380px',
                }, 500, () => {
                  $('.p_03_e_03').animate({
                    opacity: '1',
                    top: '0px',
                    left: '760px',
                  }, 500, () => {
                    $('.p_03_e_04').animate({
                      opacity: '1',
                      top: '190px',
                      left: '0px',
                    }, 500, () => {
                      $('.p_03_e_05').animate({
                        opacity: '1',
                        top: '190px',
                        left: '380px',
                      }, 500, () => {
                        $('.p_03_e_06').animate({
                          'opacity': '1',
                          'top': '190px',
                          'left': '760px',
                        }, 500, () => {
                          $('.page_03_pic').animate({
                            "opacity": '1',
                            "right": '0px',
                            "bottom": '0px'
                          }, 1000)
                                                    });
                      })
                    })
                  })
                })
              })
            })
          })
        }
        break
      case 3:
        if (page_04_flag) {
          page_04_flag = false
          $('.page_04_title').animate({
            opacity: '1',
          }, 1000, () => {
            $('.page_04_des').animate({
              opacity: '1',
            }, 1000, () => {
              $('.page_04_pic').animate({
                opacity: '1',
                right: '0px',
                bottom: '0px',
              }, 1000, () => {
                $('.page_04_media').animate({
                  opacity: '1',
                })
              })
            })
          })
        }
        break
      case 4:
        if (page_05_flag) {
          page_05_flag = false
          $('.page_05_title').animate({
            opacity: '1',
          }, 1000, () => {
            $('.page_05_des').animate({
              opacity: '1',
            }, 1000, () => {
              $('.page_05_pic').animate({
                opacity: '1',
              }, 1000, () => {
                page05Phone()
                $('.page_05_btn').animate({
                  opacity: '1',
                }, () => {
                  $('.page_05_btn li').mouseover(function () {
                    $(this).find('div').show()
                  }).mouseout(function () {
                    $(this).find('div').hide()
                  })
                })
              })
            })
          })
        }
        break
      case 5:
        if (page_06_flag) {
          page_06_flag = false
          $('.page_06_title').animate({
            opacity: '1',
          }, 1000, () => {
            $('.page_06_con').animate({
              opacity: '1',
            }, () => {
              page06Left()
              page06Right()
            })
          })
        }
        break
    }
  }

  // 直接启动第一页动画,这里是用来单独运行每页动画做测试使用
  // page_animate_01();
  // 分页动画_over

  // 点击按钮触动动画
  $btn_ele.click(function () {
    const num = $btn_ele.index($(this))
    current_num = num
    const move_duration = num * ele_height
    $btn_ele.removeClass('btn_current')
    $btn_ele.eq(num).addClass('btn_current')

    $main_contain.unbind('mousewheel')
    $ul.animate({
      top: `-${move_duration}px`,
    }, 500, () => {
      $main_contain.bind('mousewheel', (event, delta) => {
        wheel(event, delta)
      })
      ele_animate(current_num)
    })
  })
})
