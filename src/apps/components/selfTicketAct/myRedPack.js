

const slimscroll = require('jquery-slimscroll')
require('./index.scss')
const TicketDetailInfoView = require('./ticketDetail')
const GameDetailInfoView = require('./gameDetail')

const MyRedPackView = Base.ItemView.extend({
  template: require('./myRedPack.html'),
  events: {
    'click .js-look-red-info': 'lookRedInfoHandler',
    'click .js-go-back': 'goBackHandler',
    'click .js-top-info-btn': 'infoBtnHanlder',
  },

  serializeData () {
    return { data: this.options.data || [] }
  },

  onRender() {
    const self = this
    this.$redPackMain = this.$('.js-my-red-pack-main')
    this.$packMainList = this.$('.js-pack-main-list')
    this.$packDetailInfo = this.$('.js-pack-detail-info')
    this.$detailMain = this.$('.js-detail-main')
    this.$topInfoBtn = this.$('.js-top-info-btn')
    this.$('.js-pack-main-red-list').slimScroll({
      height: 310,
    })
  },
  lookRedInfoHandler () {
    const self = this
    this.$redPackMain.addClass('look-red-pack-info')
    this.$packMainList.addClass('hidden')
    this.$packDetailInfo.removeClass('hidden')
    this.$topInfoBtn.eq(0).trigger('click')
  },
  goBackHandler () {
    this.$redPackMain.removeClass('look-red-pack-info')
    this.$packMainList.removeClass('hidden')
    this.$packDetailInfo.addClass('hidden')
  },
  infoBtnHanlder (e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    $target.addClass('active').siblings().removeClass('active')
    if (Number(type) === 1) {
      this.datailView = new TicketDetailInfoView()
    } else {
      this.datailView = new GameDetailInfoView()
    }
    this.$detailMain.html(this.datailView.render().el)
  },

})

module.exports = MyRedPackView
