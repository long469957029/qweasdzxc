

const TreeActivity = require('com/treeActivity')

const TreeActivityModule = Base.Module.extend({

  startWithParent: false,

  interval: 600000,

  shaking: false,

  // _skip: false,

  checkXhr() {
    return Global.sync.ajax({
      url: '/info/moneytreeactivity/info.json',
      data: {
        activityId: 9,
      },
    })
  },

  treeInfoXhr() {
    return Global.sync.ajax({
      url: '/info/moneytreeactivity/query.json',
      data: {
        activityId: 9,
      },
    })
  },

  onStart() {
    const self = this

    Global.polling.start('activity:tree', () => {
      self.check()

      Global.polling.next('activity:tree', {
        interval: self.interval,
      })
    })
  },

  check(options) {
    const self = this

    return this.checkXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          self.data = data = res.root || {}
          // 0活动未开始，1活动进行中，2活动已结束 || !data.available
          if (data.status !== 1) {
            return false
          } 
          self.treeInfoXhr()
            .done((res) => {
              if (res && res.result === 0) {
                if (res.root && res.root.timesLeft > 0) {
                  self.startTreeActivity()
                }
              }
            })
        }
      })
  },

  startTreeActivity() {
    const self = this
    let treeActivity
    if (!this.shaking) {
      treeActivity = new TreeActivity({})
        .render()
        .on('destroy', () => {
          self.shaking = false
        })
      this.shaking = true
      $('body').append(treeActivity.$el)
    }
  },

  onStop() {
    Global.polling.stop('activity:tree')
  },
})

module.exports = TreeActivityModule
