$.widget('gl.statistics', {

  options: {
    type: 'text',
    targetEl: null,
    triggerEvent: 'input propertychange',
    max: 50,
    onChange: _.noop,
    filter: '',
    countFilter: '',
  },

  _create() {
    _.bindAll(this, 'changeHandler')

    this.element.html(`<span class="js-wt-statistics-curt">0</span>/<span class="js-wt-statistics-max">${ 
      this.options.max}</span>`)

    this.$targetEl = $(this.options.targetEl)

    this.$curtCount = this.element.find('.js-wt-statistics-curt')

    this._bindEvents()
  },

  _bindEvents() {
    const self = this

    if (this.options.type === 'text') {
      $(this.options.targetEl).on(this.options.triggerEvent, this.changeHandler)
    } else if (this.options.type === 'dom') {
      $(this.options.targetEl).on(this.options.triggerEvent, this.options.filter, this.changeHandler)
    }
  },

  setMax(max) {
    this.options.max = max
    this.element.find('.js-wt-statistics-max').text(this.options.max)
  },

  count() {
    if (this.options.type === 'text') {
      return this.$targetEl.val().length
    } else if (this.options.type === 'dom') {
      return this.$targetEl.find(this.options.countFilter).length
    }
  },

  reCount() {
    const count = this.count()

    this.$curtCount.text(count)
  },

  test() {

  },

  // event handlers

  changeHandler(e) {
    const count = this.count()
    const flag = count > this.options.max
    if (flag) {
      this.$curtCount.addClass('text-danger')
    } else {
      this.$curtCount.removeClass('text-danger')
    }

    this.$curtCount.text(count)

    this.options.onChange(this.count(), flag)
  },
})

module.exports = $.gl.statistics
