

require('./index.scss')


const FundManageView = Base.ItemView.extend({

  className: '',
  template: require('fundCenter/fundManage/index.html'),

  events: {
    'click .js-fc-fm-re-btn': 'rechargeHandler',
    'click .js-fc-fm-wd-btn': 'withdrawHandler',
    'click .js-fc-fm-operation-btn': 'goToTransferHandler', // js-fc-fm-operation-btn
    'click .js-fc-fm-refresh': 'refreshHandler',
  },

  refreshHandler(e) {
    e.stopPropagation()
    e.preventDefault()
    const $target = $(e.currentTarget)

    const id = $target.data('id')
    const time = $target.data('time')
    if (!time || time && (moment().valueOf() - Number(time)) > 30000) {
      $target.addClass('fa-spin')
      $target.data('time', moment().valueOf())
      this.refreshChannelAmountXhr({ channelId: id })
        .always(() => {
          $target.removeClass('fa-spin')
        }).done((res) => {
          if (res.result == 0) {
            $target.closest('.js-fc-fm-mb-item').find('.js-fc-fm-channel-amount').html(_(res.root).convert2yuan())
          }
        })
    } else {
      Global.ui.notification.show('请稍后再试!')
    }
  },
  rechargeHandler(e) {
    $('.js-gl-hd-re').trigger('click')
  },
  withdrawHandler(e) {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')

    if (!acctInfo || acctInfo.userStatus === 100) {
      Global.ui.notification.show('用户已被冻结，无法进行提现操作。')
      return false
    }
    if (Global.memoryCache.get('acctInfo').foundsLock) {
      Global.ui.notification.show('资金已锁定，请先' + '<a href="javascript:void(0);" ' +
        'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
        'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>' + '。')
      return false
    }

    Global.appRouter.navigate('#fc/wd', { trigger: true, replace: false })
  },
  goToTransferHandler(e) {
    const $target = $(e.currentTarget)
    const channelId = $target.closest('.js-fc-fm-channel-operation').data('channelid')
    const type = $target.data('type')
    if (type == 0) {
      Global.router.goTo(`fc/tr?fromId=${channelId}`)
    } else {
      Global.router.goTo(`fc/tr?toId=${channelId}`)
    }
  },

  getChannelAmountXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/gamebalance.json',
      data,
    })
  },

  refreshChannelAmountXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/balance.json',
      data,
    })
  },

  initialize() {
    const acctInfo = Global.memoryCache.get('acctInfo')
    this.AccountXhr = this.getChannelAmountXhr({ userId: acctInfo.userId })
  },
  onRender() {
    this.renderAccountInfo()
  },
  renderAccountInfo() {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (acctInfo.userRebate <= 128) {
      this.$('.js-fc-fm-channel-operation').removeClass('hidden')
    }
    // 配置锁定
    if (acctInfo.foundsLock) {
      this.$('.js-fc-fm-lock').html('资金解锁').data('status', '1')// sfa-h-locked
    } else {
      this.$('.js-fc-fm-lock').html('资金锁定').data('status', '0')// sfa-h-unlocked
    }
    $.when(this.AccountXhr).done((res) => {
      if (res.result == 0) {
        self.$('.js-fc-fm-to-mb').html(_(res.root.total).convert2yuan())// 总余额
        self.$('.js-fc-fm-wv-mb').html(_(res.root.validBalance).convert2yuan())// 总余额
        _(res.root.gameBalance).each((game) => {
          const channelId = game.channelId
          switch (channelId) {
            case 0:
              var $channel = self.$('.js-fc-fm-mb-ce')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
            case 1:
              var $channel = self.$('.js-fc-fm-mb-ag')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
            case 2:
              var $channel = self.$('.js-fc-fm-mb-ebet')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
            case 3:
              var $channel = self.$('.js-fc-fm-mb-bbin')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
            case 4:
              var $channel = self.$('.js-fc-fm-mb-pt')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
            case 5:
              var $channel = self.$('.js-fc-fm-mb-mg')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
            case 6:
              var $channel = self.$('.js-fc-fm-mb-gg')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
            case 7:
              var $channel = self.$('.js-fc-fm-mb-188')
              $channel.find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan())// 总余额
              break
          }
        })
      }
    })
  },
 
  
})

module.exports = FundManageView
