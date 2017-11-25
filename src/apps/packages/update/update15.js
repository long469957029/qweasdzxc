require('./update15.scss')

$.widget('gl.update15', {

  template: require('./update15.html'),

  _create () {
    this.element.html(_(this.template).template()({ date: '07月25日 08:18' || moment().add('day', 1).format('MM月DD日 HH:mm') }))
  },


})

$(document).ready(() => {
  $('.js-package').update15()
})
