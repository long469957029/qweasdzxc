

require('./index.scss')

const GetRedPackView = Base.ItemView.extend({
  template: require('./getRedPack.html'),
  events: {
    'click .js-open-now': 'openRenPackHandler',
    'click .js-look-red-pack': 'lookMyRedPackHandler',
  },

  giveRedPackXhr (data) {
    return Global.sync.ajax({
      url: '/info/redpack/get.json',
      data,
    })
  },
  serializeData () {
    console.log(this.options.data)
    return { data: this.options.data || [] }
  },
  onRender() {
    const self = this
    this.$redPackMain = this.$('.js-red-pack-main')
    this.$redPackDef = this.$('.js-red-pack-def')
    this.$redPackOpen = this.$('.js-red-pack-open')
  },
  openRenPackHandler () {
    const self = this
    if (this.options.data.ticketId) {
      var data = {
        type: 1,
        ticketId: this.options.data.ticketId,
      }
    } else {
      var data = {
        type: 2,
      }
    }
    this.giveRedPackXhr(data)
      .done((res) => {
        if (res.result === 0) {
          self.$redPackMain.addClass('bg-open').removeClass('bg-def')
          self.$redPackDef.addClass('hidden')
          self.$redPackOpen.removeClass('hidden')
          self.options.parentView.trigger('showMyRed:true')
          self.trigger('update:redNum')
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '红包领取失败' : res.msg)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '红包领取失败' : res.msg)
      })
  },
  lookMyRedPackHandler () {
    this.trigger('show:mypack')
  },

})

module.exports = GetRedPackView
