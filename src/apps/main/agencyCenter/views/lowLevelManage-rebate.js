

const LowLevelRebateView = Base.ItemView.extend({

  template: require('agencyCenter/templates/lowLevelManage-rebate.html'),

  startOnLoading: true,

  events: {
    'click .js-ac-submitRebateInfo': 'submitRebateHandler',
    'blur .js-ac-subRebate': 'inputRebateHandler',
  },

  className: 'ac-lowLevel-rebate-view',

  serializeData() {
    return {
      userName: this.options.userName,
    }
  },

  onRender() {
    const self = this
    // TODO 获取当前登陆用户的返点信息及配额信息（用于初始化最大返点值），
    // TODO 获取被编辑用户的级别、返点值（用于判断其返点编辑规则，判断是否可编辑，或者可查看,初始化最小返点值）
    this.$acSubRebate = this.$('.js-ac-subRebate')
    this.$lowLevelError = this.$('.js-lowLevel-error')
    this.getSubAcctXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root.seriesList
          self.$acSubRebate.attr('data-parsley-range', `[${_(data.subRebateRange.subAcctRebate).formatDiv(10)},${_(data.subRebateRange.rebateMax).formatDiv(10, { fixed: 1 })}]`)
            .val(_(data.subRebateRange.subAcctRebate).formatDiv(10))
          self.maxRebate = _(data.subRebateRange.rebateMax > 130 ? 130 : data.subRebateRange.rebateMax).formatDiv(10, { fixed: 1 })
          self.minRebate = _(data.subRebateRange.rebateMin).formatDiv(10)
        }
      })
  },
  getSubAcctXhr() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacctrebate.json',
      data: {
        subAcctId: this.options.userId,
      },
    })
  },

  checkValueRangeHandler(e) {
    const $target = $(e.currentTarget)
    const range = JSON.parse($target.data('parsley-range'))
    const rebate = Number($target.val())
    if (rebate !== '' && _(rebate).isFinite() && range.length === 2) {
      if (rebate < range[0]) {
        $target.val(range[0])
      } else if (rebate > range[1]) {
        $target.val(range[1])
      }
    }
  },
  submitRebateHandler(e) {
    const $target = $(e.currentTarget)
    const self = this
    $target.button('loading')
    Global.sync.ajax({
      url: '/acct/subaccount/modifySubAcctRebate.json',
      data: {
        subAcctId: this.options.userId,
        subAcctRebate: _(this.$('.js-ac-subRebate').val()).formatMul(10),
      },
    }).always(() => {
      $target.button('reset')
    }).fail(() => {
      //  Global.ui.notification.show(res.root);
    })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('保存成功', {
            type: 'success',
          })
          self.trigger('change:success')
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },
  inputRebateHandler(e) {
    const $target = $(e.currentTarget)
    const rebate = Number($target.val())
    if (rebate !== '' && _(rebate).isFinite()) {
      if (rebate < this.minRebate) {
        $target.val(this.minRebate)
        this.getError('新设置返点不可低于当前返点')
      } else if (rebate > this.maxRebate) {
        $target.val(this.maxRebate)
        this.getError(`新设置返点不可高于${this.maxRebate}`)
      }
    } else {
      $target.val(this.minRebate)
      this.$lowLevelError.empty()
    }
  },
  getError(text) {
    const errorTpl = `<span class="text-hot"><span class="sfa sfa-error-icon vertical-sub m-right-xs"></span>${text}</span>`
    this.$lowLevelError.html(errorTpl)
  },
})

module.exports = LowLevelRebateView
