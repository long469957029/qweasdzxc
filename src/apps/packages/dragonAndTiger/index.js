

require('./jquery-1.10.2')
require('./effect')

const ClientView111 = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  onRender() {

  },
})

$('.js-package').html(new ClientView111().render().$el)
