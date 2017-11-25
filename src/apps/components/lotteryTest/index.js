

require('./style.scss')

const answerConfig = require('./config.js')

const lotteryTestView = Base.ItemView.extend({
  template: require('./index.html'),
  events: {
    'click .js-lotteryTest-next': 'nextHandel',
    'click .js-lottery-choice': 'choiceHandel',
    'click .js-go-lottery': 'goHandel',
    'click .js-lottery-off': 'offHandel',
  },
  num: 0,
  next: false,
  option01: '',
  option02: '',
  url: '',
  nextHandel (e) {
    if (this.next) {
      this.$('.js-lotteryTest-Step').eq(this.num + 1).removeClass('hidden').siblings('.js-lotteryTest-Step')
        .addClass('hidden')
      this.num += 1
      this.next = false
    }
		
    if (this.num == 2) {
      this.$('.js-lotteryTest-next').html('完成')
      this.next = false
    } else if (this.num == 3) {
      this.$('.js-lotteryTest-Step').addClass('hidden')
      this.$('.js-lotteryTest-next').html('去体验').removeClass('js-lotteryTest-next').addClass('js-go-lottery')
      this.$('.js-lottery-answer').removeClass('hidden')
      this.answer()
    }
  },
  choiceHandel (e) {
    const $target = $(e.currentTarget)
    $target.addClass('lottery-choice').siblings().removeClass('lottery-choice')
    if (this.num == 0) {
      this.option01 = $target.attr('user-option')
    } else if (this.num == 1) {
      this.option02 = $target.attr('user-option')
    }
		
    this.next = true
  },
  answer () {
    let list = ''
    const answer = _(answerConfig).findWhere({ combination: this.option01 + this.option02 })
    _(answer.lottery).map((item, index) => {
      list += `<li>${item}</li>`
    })
    this.url = answer.url
    this.$('.js-lottery-icon').html(list)
  },
  goHandel () {
    location.href = this.url
    this.$('.js-lotteryTest').parent().remove()
  },
  offHandel () {
    this.$('.js-lotteryTest').parent().remove()
  },
})

module.exports = lotteryTestView
