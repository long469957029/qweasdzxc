

require('./../misc/common.js')

const AdvertiseView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  onRender() {
    // 获奖名单滚动
    const $ul = $('.prompt_content ul')

    function rolling() {
      $ul.animate({
        left: '-210px',
      }, 1000, () => {
        $ul.css('left', '0px')
        $ul.find('li:eq(0)').appendTo($ul)
      })
    }

    $ul.each((index) => {
      setInterval(rolling, 4000)
    })
  },
})

module.exports = AdvertiseView

new AdvertiseView({
  el: '.js-package',
}).render()
