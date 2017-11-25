

const RollView = Base.ItemView.extend({

  template: require('./index.html'),

  options: {
    itemTemplate: '<li>恭喜<span>%username</span>获得<span>%money元</span></li>',
  },

  roll(dataList) {
    const self = this

    this.$ul.append(_(dataList).map((info) => {
      return self.options.itemTemplate.replace(/%username(.*)%money/, `${info.username}$1${_(info.result).convert2yuan()}`)
    }).join(''))

    clearInterval(this.rollTimer)
    this.rollTimer = setInterval(() => {
      self.rolling()
    }, 2500)
  },


  rolling() {
    const self = this
    this.$ul.animate({
      left: -200,
    }, 1000, () => {
      self.$ul.css('left', 0)
      self.$ul.find('li').eq(0).remove()
    })
  },

  onRender() {
    this.$ul = this.$('.prompt_content2 ul')
  },
})

module.exports = RollView
