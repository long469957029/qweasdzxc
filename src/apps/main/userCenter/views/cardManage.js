

const bindBankConfig = require('../misc/bankConfig')
const lockPng = require('../misc/lock.png')
const deletePng = require('../misc/delete.png')

const CardManageView = Base.ItemView.extend({

  template: require('userCenter/templates/cardManage.html'),
  startOnLoading: true,
  itemTpl: _(require('userCenter/templates/cardManage-item.html')).template(),

  validateTpl: _(require('userCenter/templates/cardManage-validate.html')).template(),

  className: 'uc-cardManage-view',

  events: {
    'click .js-uc-cmBindCard-btn': 'goToBingBankCardHandler', // 绑定按钮
    'click .js-uc-cmLockCard-btn': 'lockBankCardHandler', // 锁定按钮
    // 'click .js-uc-cmUpdateSingCard': 'updateSingCardHandler',//修改按钮
    'click .js-uc-cmDeleteSingCard': 'deleteSingCardHandler', // 删除按钮
    // 'click .js-uc-validatePayPwd': 'validatePayPwdHandler'//验证资金密码
    'click .js-uc-cmValidatePayPwd': 'validatePayPwd',
  },

  initialize() {
  },

  getBankCardListXhr() {
    return Global.sync.ajax({
      url: '/fund/bankcard/cardlist.json',
    })
  },

  verifyPayPwdXhr(data) {
    return Global.sync.ajax({
      url: '/fund/moneypd/verify.json',
      data,
    })
  },
  checkPayPwdXhr() {
    return Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json',
    })
  },

  lockBankCardXhr() {
    return Global.sync.ajax({
      url: '/fund/bankcard/lockcard.json',
    })
  },

  deleteBankCardXhr(data) {
    return Global.sync.ajax({
      url: '/fund/bankcard/delcard.json',
      data,
    })
  },

  verifyCardInfoXhr(data) {
    return Global.sync.ajax({
      url: '/fund/bankcard/verifycard.json',
      data,
    })
  },

  onRender() {
    // const self = this

    this.$validateError = this.$('.js-uc-cmValPayPwdNotice')
    this.hasBeenVerified = Global.memoryCache.get('hasBeenVerified')

    // if (!this.hasBeenVerified) {
    //   // 判断是否设置资金密码
    //   this.checkPayPwdXhr()
    //     .always(() => {
    //       self.loadingFinish()
    //     })
    //     .done((res) => {
    //       if (res && res.result === 0) {
    //         // 设置了则弹出验证框
    //         // self.$('.js-uc-cm-fundPwdInput').removeClass('hidden')
    //         Global.memoryCache.clear('hasBeenVerified')
    //         self.initializeCardManagePage()
    //         self.loadingFinish()
    //       } else if (res && res.result === 1) {
    //         Global.ui.notification.show('您还未设置资金密码，')
    //       }
    //     })
    // } else {
    //   Global.memoryCache.clear('hasBeenVerified')
    //   this.initializeCardManagePage()
    //   this.loadingFinish()
    // }
    // this.initializeCardManagePage()
    this.loadingFinish()
  },

  // 验证完毕后初始化管理页面
  initializeCardManagePage() {
    const self = this
    // 获取已有银行卡信息列表
    this.getBankCardListXhr()
      .done((res) => {
        if (res.result === 0) {
          self.locked = res.root.locked
          const cardHtml = self.generateCardInfoHtml(res.root.cardList, res.root.locked)
          self.$('.js-uc-cmCardManage-container').html(cardHtml || '')
          self.$('.js-uc-cmBtnContainer').removeClass('hidden')
          if (self.locked) {
            self.$('.js-uc-cmBindCard-btn').prop('disabled', true)
            self.$('.js-uc-cmLockCard-btn').prop('disabled', true)
            _(self.$('.js-uc-cmDeleteSingCard')).each((delBtn) => {
              $(delBtn).prop('disabled', true)
            })
          }
        } else {
          Global.ui.notification.show(`获取银行卡列表失败，${res.msg}`)
        }
      })
  },


  deleteSingCardHandler(e) {
    if (this.locked) {
      Global.ui.notification.show('银行卡已锁定，不能删除银行卡')

      return
    }
    const pwdToken = this.$('.js-uc-pwdToken').val()
    const cardId = $(e.currentTarget).data('type')
    if (pwdToken && !(_(pwdToken).isEmpty())) {
      this.propConfirmModel(cardId, pwdToken)
    } else {
      const type = 'delBankCard'
      this.popValidateCardInfoModal(type, cardId)
    }
  },

  propConfirmModel(cardId, pwdToken) {
    // 弹出窗口
    const self = this
    const html = '<p>是否确认删除该银行卡？</p>'
    $(document).confirm({
      content: html,
      agreeCallback () {
        const data = {
          cardId,
          pwdToken,
        }
        self.deleteBankCardXhr(data)
          .done((res) => {
            if (res.result === 0) {
              self.initializeCardManagePage()
              Global.ui.notification.show('删除银行卡成功。', {
                type: 'success',
              })
            } else {
              Global.ui.notification.show('删除银行卡失败。')
            }
          })
      },
    })
  },

  lockBankCardHandler(e) {
    const self = this
    const $target = $(e.currentTarget)

    $(document).confirm({
      title: '安全提示',
      content: '请注意：银行卡锁定以后不能再增加和删除银行卡，解锁需要联系在线客服并提交资料审核',
      agreeCallback() {
        $target.button('loading')
        self.lockBankCardXhr()
          .always(() => {
            $target.button('reset')
          })
          .done((res) => {
            if (res.result === 0) {
              self.initializeCardManagePage()
              Global.ui.notification.show('锁定银行卡成功。', {
                type: 'success',
              })
            } else if (res.msg !== 'fail') {
              Global.ui.notification.show(`锁定银行卡失败。${res.msg}`)
            } else {
              Global.ui.notification.show('锁定银行卡失败。')
            }
          })
      },
    })
  },

  //
  generateCardInfoHtml(cardList, locked) {
    const size = _(cardList).size()

    this.$('.js-uc-cmCardNum').val(size)

    if (size === 0) {
      return
    }

    const cardInfoHtmlArr = _(cardList).map(function(card) {
      const bankInfo = bindBankConfig.get(card.bankId)

      if (bankInfo) {
        card.pic = bankInfo.pic
        card.lockPic = bankInfo.lockPic
      } else {
        card.pic = ''
        card.lockPic = ''
      }

      return this.itemTpl({
        card,
        locked,
        lockPng,
        deletePng,
      })
    }, this)


    return cardInfoHtmlArr.join('')
  },

  // "#uc/cm/bind"
  // 绑定按钮
  goToBingBankCardHandler() {
    // const $target = $(e.currentTarget)
    const size = this.$('.js-uc-cmCardNum').val()
    if (this.locked) {
      Global.ui.notification.show('银行卡已锁定，不能增加银行卡。')

      return
    }
    if (size && Number(size) === 0) {
      // 直接跳转
      Global.appRouter.navigate(_('#uc/cm/bind').addHrefArgs('_t', _.now()), { trigger: true, replace: false })
    } else {
      // 弹出验证窗口
      const type = 'addBankCard'
      const token = this.$('.js-uc-pwdToken').val()
      // 如果token存在
      if (token && !(_(token).isEmpty())) {
        Global.appRouter.navigate(_('#uc/cm/bind').addHrefArgs({
          _t: _.now(),
          pwdToken: token,
        }), { trigger: true, replace: false })
      } else {
        this.popValidateCardInfoModal(type)
      }
    }
  },

  popValidateCardInfoModal(type, cardId) {
    const self = this

    const $dialog = Global.ui.dialog.show({
      title: '安全提示',
      body: this.validateTpl(),
      footer: `<button class="js-uc-cmValidateCardInfo btn btn-cool" type="button" data-type="${type}">确定</button>`,
    })
    $dialog.on('hidden.modal', function () {
      $(this).remove()
    })

    $dialog.off('click.validateCardInfo')
      .on('click.validateCardInfo', '.js-uc-cmValidateCardInfo', (ev) => {
        const $valTarget = $(ev.currentTarget)
        const valType = $valTarget.data('type')

        // 验证密码;
        const accountName = $dialog.find('.js-uc-cmAccountName').val()
        const cardNo = $dialog.find('.js-uc-cmCardNo').val()
        if (!accountName || accountName === '') {
          $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('姓名不能为空'))
          return
        }
        if (!cardNo || cardNo === '') {
          $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('卡号不能为空'))
          return
        }
        const data = { name: accountName, cardNo }
        self.verifyCardInfoXhr(data)
          .done((res) => {
            if (res.result === 0) {
              $dialog.modal('hide')
              const token = res.root
              self.$('.js-uc-pwdToken').val(token)
              // 如果类型是绑定银行卡
              if (valType === 'addBankCard') {
                Global.appRouter.navigate(_('#uc/cm/bind').addHrefArgs({
                  _t: _.now(),
                  pwdToken: token,
                }), { trigger: true, replace: false })
              } else if (valType === 'delBankCard') {
                self.propConfirmModel(cardId, token)
              }
            } else if (_(res.root).isNull()) {
              $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl(`验证失败,${res.msg}`))
            } else if (res.root != null && _(res.root).isNumber()) {
              if (res.root > 0) {
                $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl(`验证失败,剩余${res.root}次机会。`))
              } else {
                $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('验证失败,请一个小时后再验证！'))
              }
            } else {
              $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl(`验证失败,${res.msg}`))
            }
          })
      })
  },

  renderError(text) {
    this.$validateError.closest('.control-group').removeClass('hidden')
    this.$validateError.html(text)
  },

  validatePayPwd () {
    // 验证密码
    const self = this
    const payPwd = this.$('.js-uc-cmPayPwd').val()
    if (!payPwd || payPwd === '') {
      this.$validateError.html('资金密码不能为空')
      return
    }

    const data = {
      payPwd,
      type: '1',
    }

    self.verifyPayPwdXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // $dialog.modal('hide');
          // self.$('.js-uc-pwdToken').val(res.root);
          self.$('.js-uc-cm-fundPwdInput').addClass('hidden')
          self.initializeCardManagePage()
        } else if (_(res.root).isNull()) {
          self.renderError(`验证失败，${res.msg}`)
        } else if (res.root > 0) {
          self.renderError(`验证失败，剩余${res.root}次机会`)
        } else {
          self.renderError('验证失败，请一个小时后在验证！')
        }
      })
  },
  _getErrorEl (text) {
    return `${'<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> '}${text 
    }</div>`
  },

})

module.exports = CardManageView
