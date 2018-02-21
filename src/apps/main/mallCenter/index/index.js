

require('./index.scss')

const footerView = require('skeleton/bases/footer')

const couponCenterView = require('mallCenter/couponCenter')
const giftExchangeView = require('mallCenter/giftExchange')
const taskRewardView = require('mallCenter/taskReward')
const myIntegralView = require('mallCenter/myIntegral')
const treasureView = require('mallCenter/treasureCenter')

const signInView = require('mallCenter/modules/signIn')
const bannerConfig = require('../misc/bannerConfig')

const MallCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  bannerTpl: _(require('./banner.html')).template(),

  useGuideTpl: _(require('./use-guide.html')).template(),

  startOnLoading: true,

  events: {
    'click .js-tab-info': 'tabInfoHandler',
    'click .js-user-check-in': 'showSignInHandler',
    'click .js-user-guide': 'userGuideHandler',
  },
  serializeData () {
    return {
      loading: Global.ui.loader.get(),
    }
  },
  getMallBannerADXhr () {
    return Global.sync.ajax({
      url: '/acct/usernotice/getMallAdvertise.json',
    })
  },
  getUserInfoXhr () {
    return Global.sync.ajax({
      url: '/mall/integral/info.json',
    })
  },
  onRender () {
    const self = this
    this.$footer = this.$('.js-mall-footer')
    this.$mallContainer = this.$('.js-mall-container')
    this.$tabInfo = this.$('.js-tab-info')
    this.$navigationLiList = this.$('.js-mall-mb-na')
    this.$imgList = this.$('.js-mall-mb-item')
    this.$userName = this.$('.js-user-name')
    this.$levelInfo = this.$('.js-level-info')
    this.$nowIntegral = this.$('.js-now-integral')
    this.$needintegral = this.$('.js-need-integral')
    this.$userlevelMain = this.$('.js-user-level-main')
    this.$nextLevel = this.$('.js-next-level')
    this.$nextDis = this.$('.js-next-dis')
    this.$userHeadIcon = this.$('.js-user-head-icon')
    this.$nextNeed = this.$('.js-next-need')
    this.$nextText = this.$('.js-next-text')
    this.$nextTextZero = this.$('.js-next-text-zero')
    this.$tabInfoLast = this.$('.js-tab-info-last')
    this.$tabInfoTreasure = this.$('.js-tab-info-treasure')
    this.$userIntegralMain = this.$('.js-user-integral-main')
    this.triggerTab = 'jsMyTicket'
    this.$('#jsMallDbCarousel').carousel({
      interval: 5000,
    })
    this.formatUser()
    this.loadingFinish()
    this.renderMallMainBannerAD()
    this.$footer.html(new footerView().render().el)
    let type = _.getUrlParam('type') || 0
    type = type > 4 ? 0 : type
    this.$tabInfo.eq(type).trigger('click')
  },
  formatUser () {
    const self = this
    this.getUserInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          const data = res.root
          self.$userName.html(data.userName)
          self.$levelInfo.addClass(`mall-level-${data.levelId}`)
          self.$nowIntegral.html(parseInt(_(data.integral).convert2yuan()))
          self.$needintegral.html(parseInt(_((data.nexTLevelintegral - data.totalIntegral) < 0 ? 0 : (data.nexTLevelintegral - data.totalIntegral)).convert2yuan()))
          let w = _(_(data.currentLevelintegral).div(data.nexTLevelintegral)).mul(100)
          if (_.isNull(data.nextLevelId)) {
            self.$nextLevel.html(`Lv.${data.levelId}`)
            w = 100
            self.$nextNeed.addClass('hidden')
            self.$nextText.addClass('hidden')
          } else {
            self.$nextLevel.html(`Lv.${data.nextLevelId}`)
            _(data.nextDiscount).div(1000) === 10 ? self.$nextText.addClass('hidden') : self.$nextDis.html(_(data.nextDiscount).div(1000))
          }
          if (data.levelId === 0) {
            self.$nextTextZero.removeClass('hidden')
          } else {
            self.$nextTextZero.addClass('hidden')
          }
          w = w > 100 ? 100 : w
          self.$userlevelMain.animate({ width: `${w}%` }, 1000)
          self.$userHeadIcon.attr('src', data.headIcon)
          // if(data.nexTLevelintegral > 0){
          //   self.$userIntegralMain.html(_(data.totalIntegral).convert2yuan() + '/' + _(data.nexTLevelintegral).convert2yuan());
          // }
          Global.cookieCache.set(`${data.userId}integral`, data.totalIntegral)
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '获取积分详情失败！请刷新页面重试！' : res.msg)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '获取积分详情失败！请刷新页面重试！' : res.msg)
      })
  },
  renderMallMainBannerAD () {
    const self = this
    this.getMallBannerADXhr().done((res) => {
      if (res.result === 0) {
        self.generateMallBannerAD(res.root)
      }
    })
  },
  generateMallBannerAD (data) {
    const liList = []

    if (_(data).isEmpty()) {
      data = bannerConfig
    }

    _(data).each((item, index) => {
      liList.push(`<li data-target="#jsMallDbCarousel" data-slide-to="${index}${index === 0 ? '" class="active"' : '"'}></li>`)
    })

    if (_(liList).size() > 1) {
      this.$navigationLiList.html(liList.join(''))
    }

    this.$imgList.html(this.bannerTpl({
      data,
    }))
  },
  tabInfoHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    const type = $target.data('type')
    switch (type) {
      case 1: // 领券中心
        this.$mallContainer.html(new couponCenterView().off('update:userInfo').on('update:userInfo', () => {
          self.formatUser()
        }).off('show:myCouponList')
          .on('show:myCouponList', () => {
            self.triggerTab = 'jsMyTicket'
            self.$tabInfoLast.trigger('click')
          })
          .render().el)
        break
      case 2: // 领券中心
        this.$mallContainer.html(new giftExchangeView().off('update:userInfo').on('update:userInfo', () => {
          self.formatUser()
        }).off('show:myGiftTab')
          .on('show:myGiftTab', () => {
            self.triggerTab = 'jsGiftExchange'
            self.$tabInfoLast.trigger('click')
          })
          .render().el)
        break
      case 3: // 幸运夺宝
        this.$mallContainer.html(new treasureView().off('update:userInfo').on('update:userInfo', () => {
          self.formatUser()
          // self.$tabInfoTreasure.trigger('click');
        }).off('show:myGiftTab')
          .on('show:myGiftTab', () => {
            self.triggerTab = 'jsGiftExchange'
            self.$tabInfoLast.trigger('click')
          })
          .render().el)
        break
      case 4: // 任务奖励
        this.$mallContainer.html(new taskRewardView().off('update:userInfo').on('update:userInfo', () => {
          self.formatUser()
        }).render().el)
        break
      case 5: // 我的积分与兑换
        this.$mallContainer.html(new myIntegralView({ triggerTab: this.triggerTab }).render().el)
        break
    }
  },
  // 签到
  showSignInHandler () {
    const self = this
    const $signInDialog = Global.ui.dialog.show({
      anySize: '660',
      body: '<div class="js-sign-in-box"></div>',
      bodyClass: 'mc-sign-modal-body',
    })
    const $signInBox = $signInDialog.find('.js-sign-in-box')
    $signInBox.html(new signInView().off('update:userInfo').on('update:userInfo', () => {
      self.formatUser()
    }).render().el)
    $signInDialog.on('hidden.modal', function (e) {
      $(this).remove()
    })
  },
  userGuideHandler () {
    const self = this

    const $dialog = Global.ui.dialog.show({
      bodyClass: 'no-border no-bg no-padding',
      body: self.useGuideTpl(),
      anySize: 676,
      anyPosition: 100,
    })
    $dialog.on('hidden.modal', function() {
      $(this).remove()
    })
  },
})

module.exports = MallCenterView
