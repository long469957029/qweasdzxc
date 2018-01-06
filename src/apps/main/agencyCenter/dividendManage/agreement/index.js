

const Countdown = require('com/countdown')

const SignUserView = require('agencyCenter/dividendManage/signUser')

const AgreementView = Base.ItemView.extend({

  template: require('./index.html'),

  agreementContentTpl: _(require('./../agreement-content.html')).template(),

  startOnLoading: true,

  events: {
    'click .js-as-approve': 'approveHandler',
  },

  getAgreementXhr() {
    return Global.sync.ajax({
      url: '/fund/divid/reqinfo.json',
    })
  },

  approveXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/approve.json',
      data,
    })
  },

  onRender() {
    const self = this

    this.$rate = this.$('.js-ac-rate')
    this.$countdown = this.$('.js-ac-dm-fg-countdown')
    this.$btnApprove = this.$('.js-as-approve')

    this.getAgreementXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          self._render(res.root)
        }
      })
  },

  _render(data) {
    new SignUserView({
      el: this.$('.js-ac-agreement-content'),
      dividBetCfgList: data.dividBetCfgList,
      otherGameDividCfgList: data.otherGameDividCfgList,
      userData: { agreement: data.agreement },
    }).render()

    // this.$('.js-ac-agreement-content').html(this.agreementContentTpl({
    //   agreement: data.agreement
    // }));

    // this.$rate.text(_(data.divid).formatDiv(100) + '%');

    this.countdown = new Countdown({
      el: this.$countdown,
      color: 'red',
      size: 'sm',
      needBg: true,
    })
      .render(data.leftSeconds * 1000)
      .on('finish.countdown', () => {
        Global.ui.notification.show('您未在协议有效期内签署，当前协议已失效。', {
          event() {
            Global.m.oauth.check()
            Global.router.goTo('')
          },
        })
      })
  },

  approveHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const status = $target.data('status')

    this.$btnApprove.button('loading')

    this.approveXhr({
      status,
    })
      .always(() => {
        self.$btnApprove.button('reset')
      })
      .done((res) => {
        if (res && res.result === 0) {
          Global.m.oauth.check()
            .done((res) => {
              if (res && res.result === 0) {
                if (status === 1) {
                  Global.ui.notification.show('签署分红协议成功。', {
                    event() {
                      Global.m.oauth.check()
                      Global.router.goTo('ac/dm')
                    },
                  })
                } else {
                  Global.ui.notification.show('拒绝分红协议成功。', {
                    event() {
                      Global.m.oauth.check()
                      Global.router.goTo('')
                    },
                  })
                }
              }
            })
        } else {
          Global.ui.notification.show(res.msg || '')
        }
      })
  },
})

module.exports = AgreementView
