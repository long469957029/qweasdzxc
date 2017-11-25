

require('./jquery-1.10.2')
require('./index.scss')

const MMCView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },
})

$('.js-package').html(new MMCView().render().$el)

