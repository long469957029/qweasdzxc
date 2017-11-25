$(() => {
  // initialization
  const window_width = $(window).innerWidth()
  const window_height = $(window).innerHeight()
  const $main_contain = $('.main_contain')
  const $con_lump = $('.con_lump')
  const $loading = $('.loading')
  const $PCDownloadBtn = $('.js-dc-pc-download')
  const url = _('/wx.exe').toLink()
  $PCDownloadBtn.attr('href', url)
  let clear_page_01
  let clear_page_02
  let clear_page_03

  $loading.css({
    top: `${window_height / 2 - 74}px`,
    left: `${window_width / 2 - 74}px`,
  })
  $main_contain.css({
    width: `${window_width}px`,
    height: `${window_height}px`,
  })
  // $con_lump.css({
  //    "left": (window_width / 2 - $con_lump.width() / 2) + "px"
  // });

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
        }, 500, () => {
          $loading.hide()
          $main_contain.animate({
            opacity: '1',
          }, 500, () => {
            // 先启动第一页动画
            clear_page_01 = setInterval(effectPage01, 4000)
          })
        })
      }
    })
  }

  loading()

  // 页面1效果
  const $page_01_pic = $('.pc_lump > ul')

  function effectPage01() {
    $page_01_pic.find('li:eq(2)').animate({
      opacity: '0',
    }, 2000, function () {
      $(this).prependTo($page_01_pic)
      $(this).css('opacity', '1')
    })
  }

  // 页面2效果
  const $page_02_pic = $('.ios_banner_contain > ul')
  const speed = 2
  let page_02_pic_left = 0

  function effectPage02() {
    page_02_pic_left -= speed
    $page_02_pic.css('left', `${page_02_pic_left}px`)
    if (page_02_pic_left <= -1860) {
      page_02_pic_left = 0
      $page_02_pic.css('left', '0px')
      $page_02_pic.find('li:eq(0)').appendTo($page_02_pic)
    }
  }

  // 页面3效果
  function effectPage03() {
    $('.android_pic li:last').animate({
      opacity: '0',
    }, 500, function () {
      $(this).prependTo($('.android_pic ul'))
      $(this).css('opacity', '1')
    })
  }

  // 页面4效果
  const $address_01 = $('.address_01')
  const $address_02 = $('.address_02')
  const $address_03 = $('.address_03')
  const $address_04 = $('.address_04')
  const $address_05 = $('.address_05')
  const $address_06 = $('.address_06')

  const addressMovingArr = [function () {
    $address_01.animate({
      top: '303px',
      left: '300px',
      opacity: '1',
    }, 500, setAddressMoving)
  }, function () {
    $address_02.animate({
      top: '420px',
      left: '185px',
      opacity: '1',
    }, 500, setAddressMoving)
  }, function () {
    $address_03.animate({
      top: '485px',
      left: '298px',
      opacity: '1',
    }, 500, setAddressMoving)
  }, function () {
    $address_04.animate({
      top: '303px',
      left: '1108px',
      opacity: '1',
    }, 500, setAddressMoving)
  }, function () {
    $address_05.animate({
      top: '420px',
      left: '1135px',
      opacity: '1',
    }, 500, setAddressMoving)
  }, function () {
    $address_06.animate({
      top: '485px',
      left: '1108px',
      opacity: '1',
    }, 500)
  },
  ]

  // 队列计数
  function setAddressMoving() {
    $('.wap_pic').dequeue('addressQueue')
  }

  $('.wap_pic').queue('addressQueue', addressMovingArr)

  // 菜单按钮
  const $ele_con_contain = $('.ele_con_contain')
  const $ele_con_lump = $('.ele_con_lump')
  const $menu = $('.menu li')
  $menu.click(function () {
    clearInterval(clear_page_01)
    clearInterval(clear_page_02)
    clearInterval(clear_page_03)

    const btn_index = $menu.index($(this))
    $menu.removeClass('current')
    $(this).addClass('current')
    $ele_con_lump.eq(btn_index).prependTo($ele_con_contain)
    $ele_con_lump.css('opacity', '0')
    $ele_con_lump.css('display', 'none')
    $ele_con_lump.eq(btn_index).css('display', 'block')
    $ele_con_lump.eq(btn_index).animate({
      opacity: '1',
    }, 500, () => {
      switch (btn_index) {
        case 0:
          clear_page_01 = setInterval(effectPage01, 4000)
          break
        case 1:
          clear_page_02 = setInterval(effectPage02, 50)
          break
        case 2:
          clear_page_03 = setInterval(effectPage03, 2000)
          break
        case 3:
          setAddressMoving()
          break
      }
    })
  })
})
