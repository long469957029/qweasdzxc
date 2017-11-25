

require('./jquery-1.10.2')
require('./effect')

const ClientView = Base.ItemView.extend({

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

$('.js-package').html(new ClientView().render().$el)
$('body').css('background-color', '#fff')
