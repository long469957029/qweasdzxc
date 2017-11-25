

require('./index.scss')
const Snap = require('snap')

const Clock = Base.ItemView.extend({
  template: require('./index.html'),

  options: {
    centerAxisX: 75,
    centerAxisY: 75,
    radius: 75,
    color: '#eef9f7',
    bigLineWidth: 7,
    bigLineHeight: 17,
    smallLineWidth: 3,
    times: 12,
  },

  render() {
    const self = this
    this.$el.html(_(this.template).template()())

    this.$hour = this.$('.js-pf-hour')
    this.$minute = this.$('.js-pf-minute')
    this.$second = this.$('.js-pf-second')

    // this.$digitTime = this.$('.js-pf-digit');

    const s = new Snap(this.$('.js-pf-clock')[0])

    const center = s.circle(this.options.centerAxisX, this.options.centerAxisY, 7)
    center.attr({
      fill: this.options.color,
    })

    const date = new Date()
    const hoursAngle = 360 * date.getHours() / 12 + date.getMinutes() / 2
    const minuteAngle = 360 * date.getMinutes() / 60
    const secAngle = 360 * date.getSeconds() / 60

    this.$hour.css({
      transform: `rotate(${hoursAngle}deg)`,
    })
    this.$minute.css({
      transform: `rotate(${minuteAngle}deg)`,
    })
    this.$second.css({
      transform: `rotate(${secAngle}deg)`,
    })

    // this.$digitTime.html(_(new Date()).formatTime('HH:mm:ss'));
    // setInterval(function() {
    //  self.$digitTime.html(_(new Date()).formatTime('HH:mm:ss'));
    // }, 1000);

    const bigLines = s.group()
    const smallLines = s.group()

    let wrapperX
    let wrapperY
    let innerX
    let innerY
    let r
    for (let i = 0; i < this.options.times; ++i) {
      r = 2 * Math.PI / this.options.times * i
      wrapperX = Math.sin(r) * this.options.radius
      wrapperY = Math.cos(r) * this.options.radius
      innerX = Math.sin(r) * (this.options.radius - this.options.bigLineHeight)
      innerY = Math.cos(r) * (this.options.radius - this.options.bigLineHeight)

      if (i % 3) {
        smallLines.add(s.line(
          this.options.centerAxisX + wrapperX, this.options.centerAxisY - wrapperY,
          this.options.centerAxisX + innerX, this.options.centerAxisY - innerY,
        ))
      } else {
        bigLines.add(s.line(
          this.options.centerAxisX + wrapperX, this.options.centerAxisY - wrapperY,
          this.options.centerAxisX + innerX, this.options.centerAxisY - innerY,
        ))
      }
    }

    bigLines.attr({
      stroke: this.options.color,
      strokeWidth: this.options.bigLineWidth,
    })

    smallLines.attr({
      stroke: this.options.color,
      strokeWidth: this.options.smallLineWidth,
    })

    return this
  },
})

module.exports = Clock
