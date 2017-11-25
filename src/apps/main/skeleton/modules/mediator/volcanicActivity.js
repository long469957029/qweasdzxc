

const VolcanicActivity = require('com/volcanicActivity')

const VolcanicActivityModule = Base.Module.extend({

  startWithParent: false,

  interval: 10000,

  raining: false,
  _skip: false,

  checkXhr() {
    return Global.sync.ajax({
      url: '/info/volcano/info.json',
      data: {
        activityId: 27,
      },
    })
  },

  onStart() {
    const self = this

    Global.polling.start('activity:volcanic', () => {
      self.check()
        .always(() => {
          Global.polling.next('activity:volcanic', {
            interval: self.interval,
          })
        })
    })
  },

  check() {
    const self = this
    return this.checkXhr()
      .done((res) => {
        let data
        if (self._skip) {
          return false
        }
        if (res && res.result === 0) {
          self.$entry = $('.js-alertVolcanic')
          data = res.root || {}
          // 0活动未开始，1活动进行中，2活动已结束 || !data.available
          self.$entry.toggleClass('hidden', data.status !== 1)
          self.initializeActivity(data)

          if (data.nextTime >= 0) {
            if (data.raining) {
              self.startRaining(data.duration)
            } else {
              self.countdownRaining(data.nextTime, data.duration)
            }
          }
        }
      })
  },

  initializeActivity(data) {
    const self = this

    if (!this.volcanicActivity) {
      this.volcanicActivity = new VolcanicActivity({
        data,
      })
        .render()
      $('body').append(this.volcanicActivity.el)
    } else {
      this.volcanicActivity.updateData(data)
    }

    self.$entry.off('click').on('click', () => {
      self.volcanicActivity.show()
    })
  },

  countdownRaining(nextTime, duration) {
    const self = this

    clearTimeout(this.countdownTimer)

    this.countdownTimer = _.delay(() => {
      self.startRaining(duration)
    }, nextTime * 1000)
  },

  startRaining(duration) {
    if (!this.raining) {
      this.volcanicActivity.show()
      this.volcanicActivity.startBurst(duration)
      this.raining = true
    }
  },

  onStop() {
    Global.polling.stop('activity:volcanic')
  },
})

module.exports = VolcanicActivityModule
