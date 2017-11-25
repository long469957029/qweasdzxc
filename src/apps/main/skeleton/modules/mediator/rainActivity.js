

const RainActivity = require('com/rainActivity')

const RainActivityModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  raining: false,

  _skip: false,

  checkXhr() {
    return Global.sync.ajax({
      url: '/info/rainactivity/info.json',
      data: {
        activityId: 3,
      },
    })
  },

  onStart() {
    const self = this

    Global.polling.start('activity:rain', () => {
      self.check()
        .always(() => {
          Global.polling.next('activity:rain', {
            interval: self.interval,
          })
        })
    })
  },

  check(options) {
    const self = this
    return this.checkXhr()
      .done((res) => {
        let data
        if (self._skip) {
          return false
        }
        if (res && res.result === 0) {
          self.data = data = res.root || {}
          // 0活动未开始，1活动进行中，2活动已结束 || !data.available
          if (data.status === 2) {
            return
          }

          if (data.raining) {
            self.startRaining(data.duration)
          } else {
            self.countdownRaining(data.nextTime, data.duration)
          }
        }
      })
  },

  skip() {
    const self = this
    this._skip = true
    _.delay(() => {
      self._skip = false
    }, self.data.duration * 1000)
  },

  countdownRaining(nextTime, duration) {
    const self = this

    clearTimeout(this.countdownTimer)

    this.countdownTimer = _.delay(() => {
      self.startRaining(duration)
    }, nextTime * 1000)
  },

  startRaining(duration) {
    const self = this
    let rainActivity
    if (!this.raining) {
      rainActivity = new RainActivity({
        duration,
      })
        .render()
        .on('destroy', () => {
          self.raining = false
        })
      this.raining = true
      $('body').append(rainActivity.$el)
    }
  },

  onStop() {
    Global.polling.stop('activity:rain')
  },
})

module.exports = RainActivityModule
