

require('./index.scss')

const VipView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-vip-nav': 'navHandel',
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  navHandel(e) {
    const $target = $(e.currentTarget)
    const $scrollTop = $target.attr('scroll-top')
    $target.addClass('now').siblings().removeClass('now')
    switch (parseInt($scrollTop)) {
      case 0:

        $('html,body').animate({ scrollTop: '860px' }, 400)
        break
      case 1:
        $('html,body').animate({ scrollTop: '1194px' }, 600)
        break
      case 2:
        $('html,body').animate({ scrollTop: '1569px' }, 800)
        break
      case 3:
        $('html,body').animate({ scrollTop: '2479px' }, 900)
        break
    }
  },
})

$('.js-package').html(new VipView().render().$el)
