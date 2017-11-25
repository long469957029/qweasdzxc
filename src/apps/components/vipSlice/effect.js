$(() => {
  const $main_contain = $('.main_contain')
  const window_width = $(window).innerWidth()
  const window_height = $(window).innerHeight()

  $main_contain.css({
    left: `${window_width / 2 - $main_contain.width() / 2}px`,
    top: `${window_height / 2 - $main_contain.height() / 2 - 130}px`,
  })


  const $sword_left = $('.sword_left')
  const $sword_right = $('.sword_right')
  const $knight = $('.knight')
  const $fire_01 = $('.fire_01')
  const $fire_02 = $('.fire_02')
  const $text_01 = $('.text_01')
  const $text_02 = $('.text_02')
  const $btn = $('.btn')
  console.log(123)
  $sword_left.one('animationEnd', function () {
    console.log(123)
    $(this).removeClass('sword_left_ani')
    $(this).addClass('sword_left_end_ani')
  })
  $sword_right.one('animationEnd', function () {
    $(this).removeClass('sword_right_ani')
    $(this).addClass('sword_right_end_ani')
  })
  $knight.one('animationEnd', () => {
    $fire_01.addClass('fire_01_ani')
    $fire_02.addClass('fire_02_ani')
  })
  $fire_02.one('animationEnd', () => {
    $text_01.addClass('text_01_ani')
    $text_02.addClass('text_02_ani')
  })
  $text_02.one('animationEnd', () => {
    $btn.addClass('btn_ani')
  })
})
