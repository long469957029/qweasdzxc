

const bindBankConfig = require('../misc/bankConfig')
const CardBind = require('./cardBinding')

const CardManageView = Base.ItemView.extend({

  template: require('userCenter/templates/cardManage.html'),
  startOnLoading: true,
  itemTpl: _(require('userCenter/templates/cardManage-item.html')).template(),

  validateTpl: _(require('userCenter/templates/cardManage-validate.html')).template(),

  className: 'uc-cardManage-view',

  events: {
    'click .js-uc-cmBindCard-btn': 'bingBankCardHandler', // 绑定按钮
    'click .js-uc-cmLockCard-btn': 'lockBankCardHandler', // 锁定按钮
    // 'click .js-uc-cmUpdateSingCard': 'updateSingCardHandler',//修改按钮
    'click .js-uc-cmDeleteSingCard': 'deleteSingCardHandler', // 删除按钮
    // 'click .js-uc-validatePayPwd': 'validatePayPwdHandler'//验证资金密码
    'click .js-uc-cmValidatePayPwd': 'validatePayPwd',
    'click .js-add-card-close': 'addCloseHandler',
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
    this.$addCardContainer = this.$('.js-uc-cmContainer-add-card')
    this.$addCardMain = this.$('.js-uc-add-card-main')

    this.userBindInfo = Global.cookieCache.get('userBindInfo')

    this.initializeCardManagePage()
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
          if (self.locked) {
            self.$('.js-uc-cmLockCard-btn').prop('disabled', true)
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
    // const pwdToken = this.$('.js-uc-pwdToken').val()
    const cardId = $(e.currentTarget).data('type')
    // if (pwdToken && !(_(pwdToken).isEmpty())) {
    //   this.propConfirmModel(cardId, pwdToken)
    // } else {
    // const type = 'delBankCard'
    this.popValidateCardInfoModal(cardId)
    // }
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
      content: '银行卡锁定以后不能再增加和删除银行卡，解锁需要联系在线客服并提交资料审核',
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

    let rewardHtml = ''
    if(this.userBindInfo && this.userBindInfo.cardStatus === 0){
      rewardHtml = `<span class="reward">（<span class="text-prominent">+${_(this.userBindInfo.bindBankCardBonus).convert2yuan()}</span>元奖励）</span>`
    }
    const cardAdd = `<li class="js-uc-cmBindCard-btn uc-cmCard-add" data-type="addBankCard"><span class="add-icon"></span>添加银行卡${rewardHtml}</li>`

    if (size === 0) {
      return cardAdd
    }

    const cardInfoHtmlArr = _(cardList).map(function(card) {
      const bankInfo = bindBankConfig.get(card.bankId)
      return this.itemTpl({
        card,
        locked,
        bankInfo,
      })
    }, this)
    this.$('.js-uc-cmLockCard-btn').removeClass('hidden')
    if (size < 5) {
      cardInfoHtmlArr.push(cardAdd)
    }
    return cardInfoHtmlArr.join('')
  },

  // "#uc/cm/bind"
  // 绑定按钮
  bingBankCardHandler() {
    const self = this
    const size = this.$('.js-uc-cmCardNum').val()
    if (size !== '' && Number(size) === 0) {
      if (!this.hasBeenVerified) {
        // 判断是否设置资金密码
        this.checkPayPwdXhr()
          .done((res) => {
            if (res && res.result === 0) {
              // 设置了则弹出验证框
              Global.memoryCache.clear('hasBeenVerified')
              self.showAddCard({ firstBind: true })
            } else if (res && res.result === 1) {
              $(document).confirm({
                title: '温馨提示',
                content: '为了您的账户安全，请先设置资金密码后再来绑定银行卡',
                agreeCallback() {
                  // Global.appRouter.navigate(_('#as/pl').addHrefArgs('_t', _.now()), { trigger: true, replace: false })
                  Global.router.goTo('uc/pl')
                },
              })
            }
          })
      } else {
        Global.memoryCache.clear('hasBeenVerified')
        self.showAddCard({ firstBind: true })
      }
    } else if (this.locked) {
      Global.ui.notification.show('银行卡已锁定，不能增加银行卡。')
    } else {
      this.showAddCard({ firstBind: false })
    }
  },
  showAddCard(data) { // data判断是否为第一次绑定银行卡
    this.$addCardContainer.removeClass('hidden')
    this.cardBindView = new CardBind(data).off('bind:success').on('bind:success', () => {
      if(this.userBindInfo && this.userBindInfo.cardStatus === 0){
        this.userBindInfo.cardStatus = 1
        Global.cookieCache.set('userBindInfo',this.userBindInfo)
      }
      this.render()
    })
    this.$addCardMain.html(this.cardBindView.render().el)
  },

  popValidateCardInfoModal(cardId) {
    const self = this

    const $dialog = Global.ui.dialog.show({
      anySize: '480',
      body: this.validateTpl(),
      bodyClass: 'no-padding',
      closeBtn: false,
    })
    $dialog.on('hidden.modal', function () {
      $(this).remove()
    })

    $dialog.off('click.validateCardInfo')
      .on('click.validateCardInfo', '.js-btn-validate', () => {
        const $form = $dialog.find('.js-uc-last-form')
        const formStatus = $form.parsley().validate()
        if (formStatus) {
          // 验证密码;
          const accountName = $dialog.find('.js-uc-cmAccountName').val()
          const cardNo = $dialog.find('.js-uc-cmCardNo').val()
          const data = { name: accountName, cardNo }
          self.verifyCardInfoXhr(data)
            .done((res) => {
              if (res.result === 0) {
                $dialog.modal('hide')
                const token = res.root
                self.$('.js-uc-pwdToken').val(token)
                self.propConfirmModel(cardId, token)
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
        }
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
    return `<span class="text-hot"><i class="sfa sfa-error-icon m-right-xs vertical-sub"></i>${text}</span>`
  },
  addCloseHandler() {
    this.$addCardContainer.addClass('hidden')
    this.cardBindView.destroy()
  },
})

module.exports = CardManageView
