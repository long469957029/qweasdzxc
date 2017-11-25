

const bannerConfig = require('dynamicCenter/misc/bannerConfig')

const PlatformNewsDetailView = Base.ItemView.extend({

  template: require('newsCenter/templates/platformNewsDetail.html'),

  bannerTpl: _(require('dashboard/templates/banner.html')).template(),

  startOnLoading: true,

  className: 'nc-noticeDetail',

  events: {},

  // 发送信件
  getAdXhr() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getletteradvertise.json',
      data: {
        pageSize: 1,
      },
    })
  },

  initialize () {
  },

  onRender() {
    const self = this

    this.$ad = this.$('.js-nc-ad')
    this.$ol = this.$('.js-nc-ol')

    this.getNewDetailXhr({
      noticeId: this.options.noticeId,
    })
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res.result === 0) {
          self.$('.js-nc-pnTitle').html(res.root.title)
          self.$('.js-nc-pnFrom').html(res.root.sendName)
          self.$('.js-nc-pnDate').html(_(res.root.sendTime).toTime())
          self.$('.js-nc-pnContext').html(res.root.context)
        } else {
          Global.ui.notification.show(`获取系统通知详情失败：${res.msg}`)
        }
      })

    this.getAdXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root ? res.root : bannerConfig

          self.$ad.html(self.bannerTpl({
            data,
          }))

          self.$ol.html(_(data).map((info, index) => {
            return `<li data-target="#jsCarousel" data-slide-to="${index}" ${ 
              index ? '' : 'class="active"'}></li>`
          }).join(''))
        }
      })
  },

  getNewDetailXhr(data) {
    return Global.sync.ajax({
      url: '/acct/usernotice/getusernoticedetail.json',
      data,
    })
  },

})

module.exports = PlatformNewsDetailView
