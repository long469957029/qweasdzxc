require('./../misc/common-init.js')
require('./index.scss')
$.widget('gl.gameInfo', {

  template: require('./index.html'),

  _create() {
    this.element.html(_(this.template).template()())
    $('.js-package').css('height', '100%')
    const titleArr = ['AG视讯', 'eBET视讯', 'BBIN视讯', 'PT老虎机', 'AG捕鱼', 'GG捕鱼', 'MG老虎机']
    this.$gameInfo = this.element.find('.js-game-info')
    const url = window.location.search
    const type = url.slice(6, 7)
    const src = url.slice(12, url.length)
    $(document).attr('title', `无限-${titleArr[type]}`)
    this.$gameInfo.attr('src', src)
  },
})

$(document).ready(() => {
  $('.js-package').gameInfo()
})
