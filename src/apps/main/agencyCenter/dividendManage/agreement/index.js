

const Countdown = require('com/countdown')

const SignUserView = require('agencyCenter/dividendManage/signUser')

const AgreementView = Base.ItemView.extend({

  template: require('./index.html'),

  agreementContentTpl: _(require('./../agreement-content.html')).template(),

  agreeConfirmTpl: _(require('./agreeConfirm.html')).template(),

  startOnLoading: true,

  events: {
    'click .js-as-approve': 'approveHandler',
  },
  serializeData(){
    return {
      dividendStatus : Global.memoryCache.get('acctInfo').dividendStatus
    }
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

    const $dialog = Global.ui.dialog.show({
      closeBtn: false,
      body: '<div class="js-ac-agree-main"></div>',
      bodyClass: 'no-border no-padding no-bg',
      anySize: '480',
    })
    $dialog.find('.js-ac-agree-main').html(this.agreeConfirmTpl({
      title: status === 1 ? '签约确认' : '拒绝签约',
      type: status,
      time: _(moment().startOf('day').add(1, 'days')).toTime(),
    }))

    $dialog.on('hidden.modal', function() {
      $(this).remove()
    })
    const data = {
      status,
    }
    $dialog.off('click.confirm').on('click.confirm', '.js-ac-agree-btn', () => {
      if (status === 2) {
        const remark = _($dialog.find('.js-agreement-textarea').val()).trim()
        if (remark === '') {
          $dialog.find('.js-ac-agree-error').html(`<div class="tooltip parsley-errors-list tooltip-error">
      <span class="sfa sfa-error-icon vertical-sub pull-left"></span>
      <div class="tooltip-inner">请输入拒绝签约的理由</div>
      </div>`)
          return false
        }
        _(data).extend({
          remark,
        })
      }
      this.approveXhr(data)
        .always(() => {
        })
        .done((res) => {
          if (res && res.result === 0) {
            $dialog.modal('hide')
            Global.m.oauth.check()
              .done((_res) => {
                if (_res && _res.result === 0) {
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
                        const acctInfo = Global.memoryCache.get('acctInfo')
                        if(acctInfo.dividendStatus === 0 || acctInfo.dividendStatus === 1){
                          Global.router.goTo('ac/to')
                        }else{
                          Global.router.goTo('ac/dm')
                        }
                      },
                    })
                  }
                }
              })
          } else {
            Global.ui.notification.show(res.msg || '')
          }
        })
    })

    // this.$btnApprove.button('loading')
    //
    // this.approveXhr({
    //   status,
    // })
    //   .always(() => {
    //     self.$btnApprove.button('reset')
    //   })
    //   .done((res) => {
    //     if (res && res.result === 0) {
    //       Global.m.oauth.check()
    //         .done((res) => {
    //           if (res && res.result === 0) {
    //             if (status === 1) {
    //               Global.ui.notification.show('签署分红协议成功。', {
    //                 event() {
    //                   Global.m.oauth.check()
    //                   Global.router.goTo('ac/dm')
    //                 },
    //               })
    //             } else {
    //               Global.ui.notification.show('拒绝分红协议成功。', {
    //                 event() {
    //                   Global.m.oauth.check()
    //                   Global.router.goTo('')
    //                 },
    //               })
    //             }
    //           }
    //         })
    //     } else {
    //       Global.ui.notification.show(res.msg || '')
    //     }
    //   })
  },

})

module.exports = AgreementView
