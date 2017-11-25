

require('./jquery-1.10.2')
require('./index.scss')
const mp3 = require('./sound/cjbdy/sound.mp3')

const SliceView = Base.ItemView.extend({

  template: require('./index.html'),

  // initialize: function() {
       
  // },

  checkState() {
    const cookie = new Base.Storage({
      name: 'appstorage',
      type: 'cookie',
    })
    const springFestivalNoClosingActivity = cookie.get('SpringFestivalNoClosingActivity')
    const today = moment().format('YYYY-MM-DD')
    const yuanxiao = moment().set('month', 0)
    yuanxiao.set('date', 31)
    if (today !== springFestivalNoClosingActivity && moment().valueOf() < yuanxiao.valueOf()) {
      /** valid 是否首次登录,首次登录会自动弹出活动界面 */
      cookie.set('SpringFestivalNoClosingActivity', today)
      $('body').append(this.render().$el)
      $('.js-sfnc-sound').attr('src', mp3)
      const $mask = $('.mask')
      const $con = $('.con')
      const window_width = $(window).innerWidth()
      const window_height = $(window).innerHeight()
      const $sound = $('audio')
      const $close_btn = $('.close_btn')
      const $animal = $('.animal')
      const $animal_btn = $animal.next()

      $con.css({
        left: `${window_width / 2 - $con.width() / 2 - 70}px`,
        top: `${window_height / 2 - $con.height() / 2 - 20}px`,
      })

      let index = 0
      var clear = setInterval(() => {
        if (index == 3) {
          $animal.eq(index).animate({
            opacity: '1',
            bottom: '130px',
          })
        } else {
          $animal.eq(index).animate({
            opacity: '1',
            bottom: '45px',
          })
        }
        index++
        if (index > 11) {
          clearInterval(clear)
        }
      }, 300)

      $close_btn.click(() => {
        $mask.hide()
        $mask.remove()
        $sound.remove()
      })
    }
  },
})

module.exports = SliceView
