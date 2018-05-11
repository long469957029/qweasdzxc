require('./index.scss')

$.widget('gl.noFound', {

  template: require('./index.html'),

  _create() {
    this.element.html(_(this.template).template()())
    this._on({
      'click .js-not-found-a': 'windowHrefHandler',
    })
  },
  windowHrefHandler(){
    window.location.href = '/index.html'
  }
})

$(document).ready(() => {
  $('.js-package').noFound().addClass('main-404-div')
})
