require('./rebateDescription.scss')

$.widget('gl.rebateDescription', {

  template: require('./rebateDescription.html'),

  _create () {
    this.element.html(_(this.template).template()({ date: '07月25日 08:18' }))
  },


})

$(document).ready(() => {
  $('.js-package').rebateDescription()
})
