$(() => {
  const $sign_lump = $('.sign_lump')
  const $close = $('.sign_lump span b')

  $close.click(() => {
    $sign_lump.hide()
  })
})
