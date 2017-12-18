define((require, exports, module) => {
  const TrackRecordsView = Base.ItemView.extend({

    template: require('userCenter/templates/cardBinding.html'),

    events: {
      'click .js-uc-cbCardBinding-check': 'checkCardBindingInfoHandler',
      'change .js-uc-cbProvince': 'selectProvinceHandler',
      'change .js-uc-cbCity': 'selectCityAndBankHandler',
      'change .js-uc-cbBankId': 'selectCityAndBankHandler',
    },

    initialize () {
    },

    saveCardBindingInfoXhr (data) {
      return Global.sync.ajax({
        url: '/fund/bankcard/savecard.json',
        data,
      })
    },

    getBankListXhr () {
      return Global.sync.ajax({
        url: '/fund/bankcard/banklist.json',
      })
    },
    getProvinceListXhr () {
      return Global.sync.ajax({
        url: '/info/city/provincelist.json',
      })
    },
    getCityListXhr (data) {
      return Global.sync.ajax({
        url: '/info/city/citylist.json',
        data,
      })
    },
    getBranchListXhr (data) {
      return Global.sync.ajax({
        url: '/fund/bankcard/branchlist.json',
        data,
      })
    },
    onRender () {
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
    selectProvinceHandler (e) {
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
            self.$bankBranch.html('').html(branchOptions.join(''))
          } else {
            Global.ui.notification.show(`获取城市列表失败，${res.msg}`)
          }
        })
    },

    checkCardBindingInfoHandler () {
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
        agreeCallback (e) {
          self.submitBankCard(e)
        },
      })
    },

    submitBankCard (e) {
      // const self = this
      const $target = $(e.currentTarget)
      const $cardBindingForm = this.$bindForm
      const clpValidate = $cardBindingForm.parsley().validate()
      if (clpValidate) {
        $target.button('loading')

        const bankId = this.$bankId.val()
        const province = this.$province.val()
        const city = this.$city.val()
        const bankBranchId = this.$bankBranch.val()
        const name = this.$userAccountName.val()
        const cardNo = this.$cardNo.val()
        const pwdToken = _.getUrlParam('pwdToken')

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
              Global.ui.notification.show('绑定成功。', {
                type: 'success',
              })
              Global.memoryCache.set('hasBeenVerified', 'true')
              // Global.router.back();
              Global.appRouter.navigate(_('#uc/cm').addHrefArgs('_t', _.now()), { trigger: true, replace: false })
            } else {
              Global.ui.notification.show(`绑定失败，${res.msg}`)
            }
          })
      }
    },

  })


  module.exports = TrackRecordsView
})

