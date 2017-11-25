
const posterImg = require('./images/header-bg.png')
const closeImg = require('./images/close.png')
const hiddenImg = require('./images/hidden.png')

$(document).ready(() => {
  $('.js-header-bg').css('background-image', `url(${posterImg})`)
  $('.js-close').css('background-image', `url(${closeImg})`)
  $('.js-hidden').css('background-image', `url(${hiddenImg})`)
})
