

require('./index.scss')

let redbags

const RainActivity = Base.ItemView.extend({
  template: '<div class="modal-backdrop fade in"></div><div class="js-rain rain"></div>' +
  '<i class="js-rain-close rain-close fa fa-times-circle"></i>',

  className: '',

  itemTpl: _(require('./item.html')).template(),

  events: {
    'mousedown .js-co-raindrop': 'getRedbagHandler',
    'click. .js-rain-close': 'rainCloseHandler',
  },

  getRedbagXhr() {
    return Global.sync.ajax({
      url: '/info/rainactivity/doget.json',
      data: {
        activityId: 3,
      },
    })
  },

  onRender() {
    const self = this
    this.$rain = this.$('.js-rain')

    // if (moment().isBetween('2015/12/31 18:00:00', '2016/1/1 23:59:00')) {
    //  redbags = [
    //    //require('./redbag-1.png'),
    //    //require('./redbag-2.png'),
    //    //require('./redbag-3.png')
    //    require('./redbag-4.png')
    //  ];
    // } else {
    redbags = [
      require('./redbag.png'),
    ]
    // }

    const $redbags = _(redbags).map((png) => {
      return $(self.itemTpl({
        redbag: png,
      }))
    })

    this.timer = setInterval(() => {
      const $redbag = _($redbags).sample()
      const $clone = $redbag.clone()
      self.$rain.append($clone)

      setTimeout(() => {
        const top = _.random(120, 180)
        const left = _.random(-20, 140)
        const angle = -Math.atan((left - 40) / (top + 50)) * 180 / Math.PI
        $clone.css({
          top: `${top}%`,
          left: `${left}%`,
          transform: `rotate(${angle}deg)`,
        })
      }, 10)

      setTimeout(() => {
        $clone.remove()
      }, 8010)
    }, 1000 / 10)

    this.countdownStop()

    Global.ui.notification.setPrevent(true)
  },

  countdownStop() {
    const self = this
    _.delay(() => {
      self.destroy()
    }, this.options.duration * 1000)
  },

  rainBack() {
    this.$rain.addClass('rain-back')
  },

  rainContinue() {
    this.$rain.removeClass('rain-back')
  },

  // event handlers

  getRedbagHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    this.rainBack()
    this.getRedbagXhr()
      .done((res) => {
        let type = 'info'
        let data
        let msg
        if (res && res.result === 0) {
          data = res.root[0]

          if (data.resultType === 0) {
            msg = '亲，您的红包被别人抢走啦'
          } else if (data.resultType === 1) {
            msg = `恭喜您，获得${_(data.result).convert2yuan()}元红包！`
            type = 'success'
          }
          Global.ui.notification.show(msg, {
            id: 'rain',
            force: true,
            type,
            event() {
              self.rainContinue()
            },
          })
        } else {
          let notice = '您与其他伙伴共享同一个IP，且TA也领过了。'
          if (res.msg.indexOf('用户消费额度不足1000') >= 0) {
            notice = res.msg
          }
          Global.ui.notification.show(`${'<div class="text-left"><p>红包飞走了，下次再接再厉。</p>' +
            '<div>红包飞走的原因可能是：<div class="m-left-sm text-pleasant m-left-sm font-sm">'}${notice}</div>` +
            '</div></div>', {
            id: 'rain',
            force: true,
            type,
            event() {
              Global.m.rainActivity.skip()
              self.destroy()
            },
          })
        }
      })
  },

  rainCloseHandler(e) {
    const self = this

    this.rainBack()
    Global.ui.notification.show('您跳过了本次抢红包（下一轮还可以继续参与）', {
      id: 'rain',
      force: true,
      event() {
        Global.m.rainActivity.skip()
        self.destroy()
      },
    })
  },

  onDestroy() {
    clearInterval(this.timer)
    Global.ui.notification.setPrevent(false)
  },
})

module.exports = RainActivity
