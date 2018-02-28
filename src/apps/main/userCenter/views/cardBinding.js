define((require, exports, module) => {
  const TrackRecordsView = Base.ItemView.extend({

    template: require('userCenter/templates/cardBinding.html'),

    events: {
      'click .js-uc-cbCardBinding-check': 'submitBankCard',
      'change .js-uc-cbProvince': 'selectProvinceHandler',
      'change .js-uc-cbCity': 'selectCityAndBankHandler',
      // 'change .js-uc-cbBankId': 'selectCityAndBankHandler',
      'click .js-uc-cb-btn': 'fundCheckHandler',
      'click .js-uc-cb-last-btn': 'checkLastHandler',
    },
    serializeData() {
      return {
        isFirstBind: this.options.firstBind,
      }
    },

    initialize() {
    },

    saveCardBindingInfoXhr(data) {
      return Global.sync.ajax({
        url: '/fund/bankcard/savecard.json',
        data,
      })
    },

    getBankListXhr() {
      return Global.sync.ajax({
        url: '/fund/bankcard/banklist.json',
      })
    },
    getProvinceListXhr() {
      return Global.sync.ajax({
        url: '/info/city/provincelist.json',
      })
    },
    getCityListXhr(data) {
      return Global.sync.ajax({
        url: '/info/city/citylist.json',
        data,
      })
    },
    getBranchListXhr(data) {
      return Global.sync.ajax({
        url: '/fund/bankcard/branchlist.json',
        data,
      })
    },
    verifyPayPwdXhr(data) {
      return Global.sync.ajax({
        url: '/fund/moneypd/verify.json',
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
      const self = this
      this.$CardBindContainer = this.$('.js-uc-cbCardBinding-container')
      this._initSteps()
      this.$bankBranch = this.$('.js-uc-cbBankBranch')
      this.$bankId = this.$('.js-uc-cbBankId')
      this.$province = this.$('.js-uc-cbProvince')
      this.$city = this.$('.js-uc-cbCity')
      this.$userAccountName = this.$('.js-uc-cbAccountName')
      this.$bindForm = this.$('.js-uc-cbCardBindingForm')
      this.$cardNo = this.$('.js-uc-cbCardNo')
      this.$fundForm = this.$('.js-uc-cb-fund-form')
      this.$fundPwdError = this.$('.js-uc-cb-vf-fundPwd-error')
      this.$lastForm = this.$('.js-uc-cb-last-form')
      this.$lastUserName = this.$('.js-uc-last-userName')
      this.$lastCardNo = this.$('.js-uc-last-cardNo')
      this.$lastCardError = this.$('.js-last-card-error')
      this.$pwdToken = this.$('.js-uc-pwdToken')
      this.$addressListError = this.$('.js-uc-cm-provence-error')
      this.getBankListXhr().done((res) => {
        if (res.result === 0) {
          const bankOptions = []
          _(res.root).each((bank) => {
            bankOptions.push(`<option value="${bank.bankId}">${bank.bankName}</option>`)
          })
          self.$bankId.append(bankOptions.join(''))
        } else {
          Global.ui.notification.show(`获取银行列表失败，${res.msg}`)
        }
      })
      this.getProvinceListXhr()
        .done((res) => {
          if (res.result === 0) {
            const provinceOptions = []
            _(res.root).each((province) => {
              provinceOptions.push(`<option value="${province.provinceId}">${province.province}</option>`)
            })
            self.$province.append(provinceOptions.join(''))
          } else {
            Global.ui.notification.show(`获取省份列表失败，${res.msg}`)
          }
        })
    },
    _initSteps() {
      this.$CardBindContainer.steps({
        headerTag: 'h3',
        bodyTag: '.js-uc-steps',
        forceMoveForward: false,
        enablePagination: false,
        transitionEffect: 'slideLeft',
        onStepChanging(event, currentIndex, newIndex) {
          return newIndex !== 3
        },
      })
    },
    selectProvinceHandler(e) {
      const self = this
      const $target = $(e.currentTarget)
      const province = $target.find('option:checked').html()
      const data = {
        province,
      }
      this.getCityListXhr(data)
        .done((res) => {
          if (res.result === 0) {
            const cityOptions = []
            cityOptions.push('<option value="">城市</option>')
            _(res.root).each((city) => {
              cityOptions.push(`<option value="${city.cityId}">${city.city}</option>`)
            })
            self.$city.html('').html(cityOptions.join(''))
            self.selectCityAndBankHandler()
          } else {
            Global.ui.notification.show(`获取城市列表失败，${res.msg}`)
          }
        })
    },
    selectCityAndBankHandler() {
      const self = this
      const cityId = this.$city.val()
      const bankId = this.$bankId.val()
      if (cityId === '' || bankId === '') {
        return
      }
      const data = {
        cityId,
        bankId,
      }
      this.getBranchListXhr(data)
        .done((res) => {
          if (res.result === 0) {
            const branchOptions = []
            branchOptions.push('<option value="">支行</option>')
            _(res.root).each((branch) => {
              branchOptions.push(`<option value="${branch.branchId}">${branch.branchName}</option>`)
            })
            branchOptions.push('<option value="999999">其他</option>')
            self.$bankBranch.html('').html(branchOptions.join(''))
          } else {
            Global.ui.notification.show(`获取城市列表失败，${res.msg}`)
          }
        })
    },

    checkCardBindingInfoHandler() {
      // const $target = $(e.currentTarget)
      const $form = this.$bindForm
      const clpValidate = $form.parsley().validate()
      if (!clpValidate) {
        return false
      }
      const self = this
      const bankName = this.$bankId.find('option:checked').html()
      const province = this.$province.find('option:checked').html()
      const city = this.$city.find('option:checked').html()
      const bankBranchName = this.$bankBranch.val()
      const name = this.$userAccountName.val()
      const cardNo = this.$cardNo.val()


      let html = `<dl class="dl-horizontal"><dt >银行名称：</dt><dd>${bankName}</dd>`
      html = `${html}<dl><dt >开户城市：</dt><dd>${province} ${city}</dd>`
      html = `${html}<dl><dt >支行名称：</dt><dd>${bankBranchName}</dd>`
      html = `${html}<dl><dt >开户人姓名：</dt><dd>${name}</dd>`
      html = `${html}<dl><dt >银行卡号：</dt><dd>${cardNo}</dd>`
      $(document).confirm({
        content: html,
        btnLeftText: '立即绑定',
        btnRightText: '返回',
        agreeCallback(e) {
          self.submitBankCard(e)
        },
      })
    },

    submitBankCard(e) {
      const self = this
      const $target = $(e.currentTarget)
      const $cardBindingForm = this.$bindForm
      const clpValidate = $cardBindingForm.parsley().validate()
      const pid = this.$province.val()
      const cid = this.$city.val()
      if (pid === '' || cid === '' || pid === undefined || cid === undefined) {
        const data = {
          el: this.$addressListError,
          errorText: '省市填写不完整',
        }
        this.$('.select2').toggleClass('faild', true)
        this.formateError(data)
        return false
      } else {
        this.$('.select2').toggleClass('faild', false)
      }
      if (clpValidate) {
        $target.button('loading')

        const bankId = this.$bankId.val()
        const province = this.$province.val()
        const city = this.$city.val()
        const bankBranchId = this.$bankBranch.find('option:selected').text()
        const name = this.$userAccountName.val()
        const cardNo = this.$cardNo.val()
        const pwdToken = this.$pwdToken.val()

        const data = {
          bankId,
          province,
          city,
          branch: bankBranchId,
          name,
          cardNo,
          pwdToken,
        }
        this.saveCardBindingInfoXhr(data).always(() => {
          $target.button('reset')
        })
          .done((res) => {
            if (res.result === 0) {
              self.$CardBindContainer.steps('goTo', 2)
              Global.memoryCache.set('hasBeenVerified', 'true')
              setTimeout(() => {
                self.trigger('bind:success')
              }, 1500)
              // 判断是否绑定银行卡，0：银行卡与密码都未绑定，1：银行卡与密码都已绑定，2：只绑定资金密码，3：只绑定银行卡
              const preStatus = window.Global.cookieCache.get('security')
              let status = 0
              if (preStatus === 0) {
                status = 3
                window.Global.cookieCache.set('security', status)
              } else if (preStatus === 2) {
                status = 1
                window.Global.cookieCache.set('security', status)
              }
            } else {
              const data2 = {
                el: this.$('.js-uc-cm-error'),
                errorText: res.msg,
              }
              this.formateError(data2)
              // Global.ui.notification.show(`绑定失败，${res.msg}`)
            }
          })
      }
    },
    renderError(data) {
      const errorTpl = `<div class="m-top-sm"><i class="sfa sfa-error-icon vertical-sub tooltip-icon"></i><div class="tooltip-inner">${data.errorText}</div></div>`
      data.el.html(errorTpl)
    },
    fundCheckHandler() {
      const self = this
      const payPwd = this.$('.js-uc-cb-fundPwd').val()
      if (payPwd === '') {
        const errorData1 = {
          el: this.$fundPwdError,
          errorText: '请输入资金密码',
        }
        self.renderError(errorData1)
        return false
      } else {
        const errorData2 = {
          el: this.$fundPwdError,
          errorText: '',
        }
        self.renderError(errorData2)
      }
      const data = {
        payPwd,
        type: '1',
      }
      this.verifyPayPwdXhr(data)
        .done((res) => {
          const errorData = {
            el: this.$fundPwdError,
            errorText: '',
          }
          if (res.result === 0) {
            self.$CardBindContainer.steps('goTo', 1)
          } else if (_(res.root).isNull()) {
            errorData.errorText = `验证失败，${res.msg}`
          } else if (res.root > 0) {
            errorData.errorText = `验证失败，剩余${res.root}次机会`
          } else {
            errorData.errorText = '验证失败，请一个小时后在验证！'
          }
          self.renderError(errorData)
        })
        .fail((res) => {
          var data =
            Global.ui.notification.show(res.msg === 'fail' ? '资金密码校验失败' : res.msg)
        })
    },
    checkLastHandler() {
      const self = this
      const lastStatus = this.$lastForm.parsley().validate()
      if (lastStatus) {
        const name = this.$lastUserName.val()
        const cardNo = this.$lastCardNo.val()
        const data = {
          name,
          cardNo,
        }
        this.verifyCardInfoXhr(data)
          .done((res) => {
            const errorData = {
              el: this.$lastCardError,
              errorText: '',
            }
            if (res.result === 0) {
              self.$pwdToken.val(res.root)
              self.$CardBindContainer.steps('goTo', 1)
            } else {
              if (_(res.root).isNull()) {
                errorData.errorText = `验证失败,${res.msg}`
              } else if (res.root !== null && _(res.root).isNumber()) {
                if (res.root > 0) {
                  errorData.errorText = `验证失败,剩余${res.root}次机会。`
                } else {
                  errorData.errorText = '验证失败,请一个小时后再验证！'
                }
              } else {
                errorData.errorText = `验证失败,${res.msg}`
              }
              self.renderError(errorData)
            }
          })
          .fail((res) => {
            // Global.ui.notification.show(res.msg === 'fail' ? '银行卡信息校验失败' : res.msg)
          })
      }
    },
    formateError(data) {
      const errorTpl = `<div class="m-top-sm"><i class="sfa sfa-error-icon vertical-sub tooltip-icon"></i><div class="tooltip-inner">${data.errorText}</div></div>`
      data.el.html(errorTpl)
    },
  })


  module.exports = TrackRecordsView
})

