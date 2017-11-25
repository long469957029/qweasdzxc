$(() => {
  const $mask = $('.mask')
  const $con = $('.con')
  const $pop_lump = $('.pop_status_01')
  const $pop_lump2 = $('.pop_status_02')
  const window_width = $(window).innerWidth()
  const window_height = $(window).innerHeight()
  const $close_btn = $('.close_btn,.pop_close_btn,.btn')
  const $animal = $('.game_lump li>img')
  const $btn = $('.game_lump li>div')
  const $btn_get = $('.btn_get')

  $con.css({
    left: `${window_width / 2 - $con.width() / 2}px`,
    top: `${window_height / 2 - $con.height() / 2}px`,
  })
  $pop_lump.css({
    left: `${window_width / 2 - $pop_lump.width() / 2}px`,
    top: `${window_height / 2 - $pop_lump.height() / 2}px`,
  })
  $pop_lump2.css({
    left: `${window_width / 2 - $pop_lump2.width() / 2}px`,
    top: `${window_height / 2 - $pop_lump2.height() / 2}px`,
  })

  $btn.hover(function() {
    const num = $btn.index($(this))
    if ($animal.eq(num).is(':animated')) {
      $animal.eq(num).stop()
    }
    if (num == 3) {
      $animal.eq(num).animate({
        opacity: '1',
        top: '-135px',
      })
    } else {
      $animal.eq(num).animate({
        opacity: '1',
        top: '-60px',
      })
    }
  }, function() {
    const num = $btn.index($(this))
    if ($animal.eq(num).is(':animated')) {
      $animal.eq(num).stop()
    }
    if (num == 3) {
      $animal.eq(num).animate({
        opacity: '0',
        top: '-50px',
      })
    } else {
      $animal.eq(num).animate({
        opacity: '0',
        top: '60px',
      })
    }
  })


  $close_btn.click(() => {
    $mask.hide()
  })
  $btn_get.click(function() {
    $(this).parent().hide()
    $pop_lump2.show()
  })
})
