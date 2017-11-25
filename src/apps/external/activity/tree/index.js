

const TreeView = Base.ItemView.extend({

  template: require('./index.html'),

  options: {
    itemTemplate: '<li>恭喜<span>%username</span>获得<span>%money',
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  onRender() {
    this.$ul = this.$('.prompt_content2 ul')
    this.updateInfo()
  },

  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.$('.js-from-date').text(_(data.fromDate).toDate('YYYY年MM月DD日'))
          self.$('.js-end-date').text(_(data.endDate).toDate('YYYY年MM月DD日'))
          self.roll(data.dataList)
        }
      })
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/moneytreeactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  // 获奖名单滚动
  roll(dataList) {
    const self = this

    this.$ul.append(_(dataList).map((info) => {
      if (info.result != ' 0') {
        if (info.resultType == 0) {
          return `${self.options.itemTemplate.replace(/%username(.*)%money/, `${info.username}$1${_(info.result).convert2yuan()}`)}元</span></li>`
        } else if (info.resultType == 1) {
          return `${self.options.itemTemplate.replace(/%username(.*)%money/, `${info.username}$1` + '')}50g金砖</span></li>`
        } else if (info.resultType == 2) {
          return `${self.options.itemTemplate.replace(/%username(.*)%money/, `${info.username}$1` + '')}20g金元宝</span></li>`
        } 
        return `${self.options.itemTemplate.replace(/%username(.*)%money/, `${info.username}$1` + '')}10g黄金条</span></li>`
      }
    }).join(''))

    clearInterval(this.rollTimer)
    this.rollTimer = setInterval(() => {
      self.rolling()
    }, 2500)
  },

  rolling() {
    const self = this
    this.$ul.animate({
      left: '-200px',
    }, 1000, () => {
      self.$ul.css('left', '0px')
      self.$ul.find('li:eq(0)').appendTo(self.$ul)
    })
  },

})

module.exports = TreeView
