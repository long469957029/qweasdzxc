

const betRulesAlgorithm = require('bettingCenter/misc/betRulesAlgorithm')

const BettingCenterPlayAreaInputView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter-playArea-input.html'),

  positionTpl: _.template(require('bettingCenter/templates/bettingCenter-playArea-position.html')),

  events: {
    'change .js-bc-playArea-position-item': 'positionChooseHandler',
    'click .js-bc-numbers-container': 'focusHandler',
    'blur .js-bc-numbers-area': 'blurHandler',
    'keyup .js-bc-numbers-area': 'betChangeHandler',
    'click .js-bc-numbers-del-error': 'delErrorHandler',
    'click .js-bc-numbers-del-repeat': 'delRepeatHandler',
    'click .js-bc-numbers-empty': 'emptyHandler',
  },

  // 回车 逗号 分号 冒号 竖线 空白字符
  splitReg: /[\r\n,\;:\|\s]+/,

  initialize() {
    this.options.selectOptionals = []
    if (this.options.splitReg) {
      this.splitReg = this.options.splitReg
    }
  },

  onRender() {
    const self = this

    if (this.options.optionals && this.options.optionals.list) {
      this.$('.js-bc-position-container').html(this.positionTpl({
        optionals: this.options.optionals.list,
      }))
    }

    this.$fileLoad = this.$('.js-bc-fileLoad')
    this.$fileTip = this.$('.js-bc-file-tip')
    this.$numbersArea = this.$('.js-bc-numbers-area')
    this.$playAreaPosition = this.$('.js-bc-playArea-position')

    this.$fileLoad.fileLoad({
      title: '导入文件',
      btnClass: 'btn-cool bc-lg-btn',
      accept: '.txt',
      done(res) {
        if (res && res.result === 0) {
          self.$numbersArea.val(res.root)
          self.$fileTip.addClass('hidden')
          self.$numbersArea.removeClass('hidden')
          self.statisticsLottery()
        }
      },
      fail() {

      },
    })

    this.calculateCoefficient()
  },

  calculateCoefficient() {
    let coefficient = 1
    const selectOptionals = []

    const $checkedList = this.$playAreaPosition.find('input[name=optional]').filter(':checked')
    const length = $checkedList.length
    if (!_.isEmpty(this.options.optionals)) {
      coefficient = betRulesAlgorithm.optional(
        this.options.optionals.coefficient,
        length,
      )
    }

    $checkedList.each((index, checked) => {
      const $checked = $(checked)
      selectOptionals.push(Number($checked.val()))
    })

    this.options.selectOptionals = selectOptionals
    this.options.coefficient = coefficient
  },

  // common APIs

  getBetting() {
    const repeat = this.checkRepeat(this.split())
    const validate = this.validate(repeat.passNumbers)

    this.trigger('statistic', validate.statistics)

    repeat.repeatNumbers = repeat.repeatNumbers.concat(validate.repeatNumbers)

    return {
      passNumbers: _(validate.passNumbers).map((passNumber) => {
        return passNumber.split(',')
      }),
      selectOptionals: this.options.selectOptionals,
      repeatNumbers: repeat.repeatNumbers,
      errorNumbers: validate.errorNumbers,
    }
  },

  validate(numberList) {
    let result

    if (this.options.coefficient) {
      result = this.options.validate.call(this.options, numberList)

      result.statistics = Math.round(_(this.options.coefficient).mul(result.statistics))
    } else {
      result = {
        statistics: 0,
      }
    }

    return result
  },

  statisticsLottery() {
    const validate = this.validate(this.split())
    this.trigger('statistic', validate && validate.statistics || 0)
  },

  empty() {
    this.$fileTip.removeClass('hidden')
    this.$numbersArea.addClass('hidden').val('')
    this.trigger('statistic', 0)
  },

  split() {
    const contents = _(this.$numbersArea.val()).trim()
    return contents.split(this.splitReg)
  },

  create(createTimes) {
    let results = []

    if (this.options.coefficient) {
      results = _(createTimes).times(this.options.create, this.options)
      _(results).each(function(result) {
        result.statistics = Math.round(_(this.options.coefficient).mul(result.statistics))
        result.selectOptionals = this.options.selectOptionals
      }, this)
    }

    return results
  },

  // event handlers

  positionChooseHandler(e) {
    this.calculateCoefficient()
    this.statisticsLottery()
  },

  focusHandler(e) {
    this.$fileTip.addClass('hidden')
    this.$numbersArea.removeClass('hidden').focus()
  },

  blurHandler(e) {
    const $target = $(e.currentTarget)
    const val = _($target.val()).trim()
    if (!val) {
      this.$numbersArea.val('').addClass('hidden')
      this.$fileTip.removeClass('hidden')
    }
  },

  betChangeHandler(e) {
    this.statisticsLottery()
  },

  delErrorHandler() {
    const validates = this.validate(this.split())

    if (!_.isEmpty(validates.errorNumbers)) {
      Global.ui.notification.show(`以下号码错误，已进行自动过滤<br />${validates.errorNumbers.join(',')}`)
    }

    this.$numbersArea.val(validates.passNumbers.join(','))

    this.trigger('statistic', validates.statistics, validates.passNumbers)
  },

  checkRepeat(numberList) {
    const results = _(numberList).unique()

    return {
      passNumbers: results.unique,
      repeatNumbers: results.repeat,
    }
  },

  delRepeatHandler() {
    const result = this.checkRepeat(this.split())

    this.$numbersArea.val(result.passNumbers.join(','))

    if (!_.isEmpty(result.repeatNumbers)) {
      Global.ui.notification.show(`以下号码重复，已进行自动过滤<br />${result.repeatNumbers.join(',')}`)
    }

    this.statisticsLottery()
  },

  emptyHandler(e) {
    this.empty()
  },

})

module.exports = BettingCenterPlayAreaInputView
