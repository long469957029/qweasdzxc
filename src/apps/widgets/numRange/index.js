

require('./index.scss')

$.widget('gl.numRange', {

  template: require('./index.html'),

  options: {
    namespace: 'numRange',
    name: 'num',
    defaultValue: 1,
    min: 1,
    max: 100,
    onChange: _.noop,
    onOverMax: _.noop,
    size: 'lg',
  },

  _create() {
    this.element.html(_(this.template).template()(_(this.options).pick('defaultValue', 'name')))

    this.$number = this.element.find('.js-wt-number')
    this.$btnMinus = this.element.find('.js-wt-num-range-btn.num-range-left')
    this.$btnAdd = this.element.find('.js-wt-num-range-btn.num-range-right')
    this.$rangeMain = this.element.find('.js-num-range-main')
    this.$rangeMain.addClass(`num-range-${this.options.size}`)
    this._bindEvents()
  },

  _bindEvents() {
    this._on({
      'blur .js-wt-number': 'numberInputHandler',
      'mousedown .js-wt-num-range-btn': 'btnDownHandler',
    })
  },

  btnChange($target) {
    const type = $target.data('type')
    const currentNumber = Number(this.$number.val())

    this.numChange(type === 'minus' ? currentNumber - 1 : currentNumber + 1)
  },

  numChange(currentNumber) {
    this.$btnMinus.removeClass('disabled')
    this.$btnAdd.removeClass('disabled')

    if (currentNumber <= this.options.min) {
      currentNumber = this.options.min
      this.$btnMinus.addClass('disabled')
    } else if (currentNumber > this.options.max) {
      currentNumber = this.options.max
      this.$btnAdd.addClass('disabled')
      this.options.onOverMax(currentNumber)
    }

    this.$number.val(currentNumber)
  },

  // common APIs

  setRange(min, max) {
    min = Number(min) || 0
    max = Number(max) || 0

    if (min > max) {
      min = max
    }

    this.options.min = min
    this.options.max = max

    this.numChange(Number(this.$number.val()) || 0)
    this.options.onChange(Number(this.$number.val()))
  },

  // event handlers

  numberInputHandler() {
    this.numChange(Math.floor(this.$number.val()) || 0)

    this.options.onChange(Number(this.$number.val()))
  },

  btnDownHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    let timer

    this.btnChange($target)

    const timeout = _.delay(() => {
      timer = setInterval(() => {
        self.btnChange($target)
      }, 50)
    }, 300)

    $(document).on('mouseup', () => {
      clearTimeout(timeout)
      clearInterval(timer)
      self.options.onChange(self.$number.val())
    })
  },
})

module.exports = $.gl.numRange
