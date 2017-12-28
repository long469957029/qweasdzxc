import './index.scss'

const Countdown = Base.PrefabView.extend({

  template: require('./index.html'),

  className: 'countdown',

  options: {
    labels: ['hours', 'minutes', 'seconds'],
    format: '%H:%M:%S',
    prevClass: 'js-pf',
  },

  initialize() {
    this.tpl = _(this.template).template()
    this.options.color = this.options.color ? (`${this.options.color}-`) : ''
    this.options.size = this.options.size ? (`-${this.options.size}`) : ''
  },

  render(leftTime) {
    //  leftTime = 91310000; // 测试数据
    leftTime = (leftTime + _.now()) || _.now()
    if (_.isUndefined(this.$el.data('countdownInstance'))) {
      this._initCountdown(leftTime)
    } else {
      this.$el.countdown(leftTime)
    }
    return this
  },

  bind(name, callback) {
    this.$el.on(name, callback)
    return this
  },

  _initCountdown(leftTime) {
    const self = this

    let currDate = _(self.options.labels).map(() => {
      return '00'
    }).join(':')

    let nextDate = currDate
    const parser = /([0-9]{2})/gi

    // Parse countdown string to an object
    function strfobj(str) {
      let parsed = str.match(parser),
        obj = {}
      _(self.options.labels).each((label, i) => {
        obj[label] = parsed[i]
      })
      return obj
    }

    // Return the time components that diffs
    function diff(obj1, obj2) {
      const _diff = []
      _(self.options.labels).each((key) => {
        if (obj1[key] !== obj2[key]) {
          _diff.push(key)
        }
      })
      return _diff
    }

    // Build the layout
    const initData = strfobj(currDate)
    _(self.options.labels).each((label, i) => {
      self.$el.append(self.tpl({
        curr: _(initData[label].split('')).map((item) => {
          return self.options.color + item
        }),
        label,
        isLast: self.options.labels.length - 1 === i,
        color: self.options.color,
        size: self.options.size,
      }))
    })

    // Starts the countdown
    this.$el.countdown(leftTime, (event) => {
      // 将天数化为小时数
      let totalHours = event.offset.totalDays * 24 + event.offset.hours
      totalHours = totalHours < 10 ? (`0${totalHours}`) : totalHours
      const newDate = event.strftime(`${totalHours}:%M:%S`)
      //  var newDate = event.strftime(self.options.format);
      let data

      if (newDate !== nextDate) {
        currDate = nextDate
        nextDate = newDate
        // Setup the data
        data = {
          curr: strfobj(currDate),
          next: strfobj(nextDate),
        }

        // Apply the new values to each node that changed
        _(diff(data.curr, data.next)).each((label) => {
          const selector = '.%s'.replace(/%s/, label)
          const $node = self.$el.find(selector)
          const nums = data.next[label].split('')

          $node.html([
            `<span class="sfa sfa-cd-${self.options.color}${nums[0]} countdown-item${self.options.size}"></span>`,
            `<span class="sfa sfa-cd-${self.options.color}${nums[1]} countdown-item${self.options.size}"></span>`,
          ].join(''))
        })

        self.trigger('change:leftTime', event)
      }
    })
      .on('finish.countdown', (options) => {
        self.trigger('finish.countdown', options)
      })
  },
})

module.exports = Countdown
