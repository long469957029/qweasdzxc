require('./index.scss')

$.widget('gl.noFound', {

  template: require('./index.html'),

  _create() {
    this.element.html(_(this.template).template()())
  },
})

$(document).ready(() => {
  $('.js-package').noFound().addClass('main-404-div')
})
