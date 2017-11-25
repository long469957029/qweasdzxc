

require('./style.scss')

const novicePackView = Base.ItemView.extend({
  template: require('./index.html'),
  events: {
    'click .js-novice-pack-off, .js-np-go-to-draw': 'offHandler',
    'click .js-np-dialog-btn': 'toggleContentHandler',
    'click .js-novice-check': 'checkPackHandler',
  },
  level: null,
  onRender() {
    const self = this

    // this.$sidebarBtn = this.$('.js-np-dialog-btn');
    this.$explain = this.$('.js-np-dialog-explain')
    this.$present = this.$('.js-np-dialog-present')

    if (this.options.hasReceivePack) {
      self.$('.js-novice-pack-content').addClass('hidden')
      self.$('.js-novice-pack-expand').removeClass('hidden')
    } else {
      self.$('.js-novice-pack-content').removeClass('hidden')
      self.$('.js-novice-pack-expand').addClass('hidden')
    }
  },

  checkPackHandler() {
    const self = this
    self.getPackXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root
        } else {
          
        }
      })
    self.$('.js-novice-pack-content').addClass('hidden')
    self.$('.js-novice-pack-expand').removeClass('hidden')
  },

  serializeData() {
    return this.options
  },

  getPackXhr() {
    return Global.sync.ajax({
      url: '/info/newpack/get.json',
    })
  },
  
  //  变换我的礼包/使用说明
  toggleContentHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    $(document).find('.js-np-dialog-btn').removeClass('active')
    $target.addClass('active')
    $(document).find('.js-np-dialog-btn').each((dom, i) => {
      $(dom).addClass('opacity-0')
    })
    if ($(document).find('.js-np-dialog-btn.active').html() === '我的礼包') {
      self.$explain.addClass('opacity-0')
      self.$present.removeClass('opacity-0')
    } else {
      self.$explain.removeClass('opacity-0')
      self.$present.addClass('opacity-0')
    }
  },
  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState ($target) {
    const acctInfo = Global.memoryCache.get('acctInfo')
    const self = this
    let isShow = false
    let $dialog = null
    this.getActivityInfoXhr().done((res) => {
      if (res.result === 0) {
        $target.removeClass('hidden')
        if (acctInfo.isFirstLoginToday) {
          $dialog = self.render().$el
          isShow = true
        }
      }
    })

    return { $dialog, dialogParent: '.js-millionBreakthrough', isShow }
  },

  getPackInfoXhr (data) {
    return Global.sync.ajax({
      url: '/info/newpack/mypack.json',
    })
  },
  
  getActivityInfoXhr (data) {
    return Global.sync.ajax({
      async: false,
      url: '/info/overMillion/info.json',
      data,
    })
  },
  joinActivityInfoXhr (data) {
    return Global.sync.ajax({
      url: '/info/overMillion/join.json',
      data,
    })
  },
  checkBonusXhr (data) {
    return Global.sync.ajax({
      url: '/info/overMillion/checkBonus.json',
      data,
    })
  },
  getBonusXhr (data) {
    return Global.sync.ajax({
      url: '/info/overMillion/getBonus.json',
    })
  },
  formateData (data) {
    const self = this
    _(data).map((item, index) => {
      self.$('.js-bonus').eq(index).html(`奖${item.bonusAmount}元`)
      self.$('.js-challengeAmount').eq(index).html(item.challengeAmount)
      self.$('.js-challengePercentage').eq(index).html(item.challengePercentage)
    })
  },
  offHandler () {
    const callbacks = $.Callbacks()
    this.$('.js-novice-pack > .content').addClass('novice-pack-off-box')
    setTimeout(() => {
      $('.js-novice-pack').parent().remove()
    }, 600)
  },
})

module.exports = novicePackView
