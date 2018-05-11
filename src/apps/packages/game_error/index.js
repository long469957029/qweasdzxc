require('./index.scss')

$.widget('gl.noFound', {

  template: require('./index.html'),

  _create() {
    this._on({
      'click .js-not-found-a': 'windowHrefHandler',
    })
    this.element.html(_(this.template).template()())
  },
  windowHrefHandler(){
    if(window != top){
      top.location.href = '/index.html'
    }else{
      window.location.href = '/index.html'
    }
  }
})

$(document).ready(() => {
  $('.js-package').noFound().addClass('main-404-div')
})
