

const Roll = require('../roll')

const RainView = Base.ItemView.extend({

  template: require('./index.html'),

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/rainactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.$('.js-from-date').text(_(data.fromDate).toDate('YYYY年MM月DD日'))
          self.$('.js-end-date').text(_(data.endDate).toDate('YYYY年MM月DD日'))
          self.roll.roll(data.dataList)
        }
      })
  },

  onRender() {
    const self = this

    this.updateInfo()
    setInterval(() => {
      self.updateInfo()
    }, 30000)

    this.roll = new Roll({
      el: '.js-roll',
    }).render()

    const temp_width = $(window).innerWidth() / 2
    const temp_height = $(window).innerHeight() / 2

    // 红包状态
    const status_num = 1

    const $temp_red = $('#temp_red')
    const $status_false = $('.status_false')
    const $status_false_02 = $('.status_false_02')
    const $status_get = $('.status_get')
    const $status_fullscreen = $('.status_fullscreen')
    const $close_btn = $('.close_btn')

    $status_false.css({
      top: `${temp_height - $status_false.height() / 2}px`,
      left: `${temp_width - $status_false.width() / 2}px`,
    })
    $status_false_02.css({
      top: `${temp_height - $status_false_02.height() / 2}px`,
      left: `${temp_width - $status_false_02.width() / 2}px`,
    })
    $status_get.css({
      top: `${temp_height - $status_get.height() / 2}px`,
      left: `${temp_width - $status_get.width() / 2}px`,
    })

    // $close_btn.click(function(){
    //  $(this).parent().hide();
    //  $status_fullscreen.hide();
    // });

    // $temp_red.click(function(){
    //  $status_fullscreen.show();
    //  switch(status_num){
    //    case 0:
    //      $status_false.show();
    //      break;
    //    case 1:
    //      $status_false_02.show();
    //      break;
    //    case 2:
    //      $status_get.show();
    //      break;
    //  }
    // });
  },
})

module.exports = RainView
