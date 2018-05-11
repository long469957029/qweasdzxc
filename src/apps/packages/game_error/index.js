require('./index.scss')

$.widget('gl.noFound', {

  template: require('./index.html'),

  _create() {
    this.element.html(_(this.template).template()())
    this.element.find('.js-not-found-a').attr('href',document.location.protocol + '//' + window.location.host + '/index.html')
  },
})

$(document).ready(() => {
  $('.js-package').noFound().addClass('main-404-div')
})
