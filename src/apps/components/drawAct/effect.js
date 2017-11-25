$(() => {
  const $main_contain = $('.main_contain')
  const window_width = $(window).innerWidth()
  const window_height = $(window).innerHeight()

  $main_contain.css({
    left: `${window_width / 2 - $main_contain.width() / 2}px`,
    top: `${window_height / 2 - $main_contain.height() / 2 - 120}px`,
  })

  const $close_btn = $('.close_btn')
  $close_btn.click(() => {
    $('.mask').hide()
  })
})
