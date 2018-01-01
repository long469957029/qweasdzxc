/**
 * 选择按钮Prefab
 */


const BtnGroup = Base.PrefabView.extend({
  template: require('./index.html'),

  className: 'btn-group',

  events() {
    const events = {}

    events[`click .${this.options.prevClass}-btn-group`] = 'btnClickHandler'

    return events
  },

  initialize() {
    _.defaults(this.options, {
      inputName: 'dateOffset',
      btnGroup: [
        {
          title: '今日',
          value: 0,
          active: true,
        },
        {
          title: '昨日',
          value: -1,
        },
        {
          title: '最近7天',
          value: -7,
        },
        {
          title: '最近30天',
          value: -30,
        },
      ],
      onBtnClick: _.noop,
    })
  },

  render(options) {
    options = options || this.options

    this.$el.html(_(this.template).template()(_(options).pick(
      'prevClass',
      'inputName',
      'btnGroup',
    )))

    this.$hiddenInput = this.$(`.${options.prevClass}-hidden-input`)

    this._init(options)

    return this
  },

  // common APIs

  val() {
    return this.$(`.${this.options.prevClass}-btn-group`).filter('.active').attr(`data-${this.options.inputName}`)
  },

  select(id) {
    this.$(`.${this.options.prevClass}-btn-group`).filter(`[data-${this.options.inputName}=${id}]`).trigger('click')
  },

  clearSelect() {
    this.$hiddenInput.val('')
    this.$(`.${this.options.prevClass}-btn-group`).removeClass('active')
  },

  _init(options) {
    const activeBtn = _(options.btnGroup).findWhere({ active: true })

    if (activeBtn) {
      this.$(`[data-${this.options.inputName.toLowerCase()}=${activeBtn.value}]`).trigger('click')
    }
  },

  btnClickHandler(e) {
    const $target = $(e.currentTarget)
    const value = $target.data(this.options.inputName.toLowerCase())

    this.$hiddenInput.val(value)

    this.options.onBtnClick(value)

    $target.addClass('active').siblings().removeClass('active')

    this.trigger('onBtnClick', value)
  },
})

module.exports = BtnGroup
