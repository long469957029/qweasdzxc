

const FilterHelper = require('skeleton/misc/filterHelper')

const ChaseModel = require('bettingCenter/models/bettingChase-normal')


const BettingCenterChaseNormalView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter-chase-normal.html'),

  footerTemplate: require('bettingCenter/templates/bettingCenter-chase-footer.html'),

  confirmTpl: _.template(require('bettingCenter/templates/bettingCenter-confirm.html')),

  events: {
    'click .js-bc-chase-create': 'chaseCreateHandler',
    'change .js-bc-single-plan-multiple': 'singleMultipleHandler',
    'click .js-bc-chase-submit': 'chaseSubmitHandler',
  },

  initialize() {
    this.template += this.footerTemplate

    this.model = new ChaseModel()
  },

  onRender() {
    const self = this
    _(this.options).extend(_(this._parentView.options).pick(
      'limitMoney',
      'previewList',
      'singleType',
      'maxMultiple',
      'planId',
      'ticketInfo',
      'ticketId',
      'basicBettingMoney',
      'totalLottery',
    ))

    this.model.set({
      basicBettingMoney: this.options.basicBettingMoney,
      maxMultiple: this.options.maxMultiple,
      usePack: this._parentView.options.usePack,
    })

    this.listenTo(this._parentView, 'change:planId', function(planId) {
      this.model.kickFirstPlan(planId)
      // this.getPlans();
    })

    this.listenTo(this.model, 'sync change:plans', this.renderBaseInfo)
    this.listenTo(this.model, 'change:plans', function(model, val) {
      const length = val.length
      this.$leftPlans.text(length)
      this.$chasePlans.data('monitorRange', [1, length])

      if (Number(this.$chasePlans.val()) > length) {
        this.$chasePlans.val(length)
      }
    })

    this.listenTo(this.model, 'change:chasePlanList', this.updateChasePlanGrid)

    this.$filterTable = this.$('.js-bc-chase-normal-table')
    this.$planId = this.$('.js-bc-chase-normal-planId')
    this.$chasePlans = this.$('.js-bc-chase-chasePlans')
    this.$leftPlans = this.$('.js-bc-chase-left-plans')
    this.$chaseContainer = this.$('.js-bc-chase-normal-container')
    this.$startMultiple = this.$('.js-bc-start-multiple')
    this.$gaps = this.$('.js-bc-gaps')
    this.$incMultiple = this.$('.js-bc-inc-multiple')

    this.$chaseSuspend = this.$('.js-bc-chase-suspend')
    this.$chaseTotal = this.$('.js-bc-chase-total')
    this.$chaseTotalMoney = this.$('.js-bc-chase-total-money')

    this.filterHelper = new FilterHelper('', {
      form: this.$filterTable,
    })

    this.$chasePlans.spinner({
      min: 1,
    })

    function overMax(e, data) {
      const $target = $(e.target)
      if (!Math.floor($target.val())) {
        $target.val(1)
      } else {
        $target.val(Math.floor($target.val()))
      }

      if ((data.value || Number(e.target.value)) > self.options.maxMultiple) {
        Global.ui.notification.show(`您填写的倍数已超出平台限定的单注中奖限额<span class="text-pleasant">${ 
          _(self.options.limitMoney).convert2yuan()}</span>元，` +
          `已为您计算出本次最多可填写倍数为：<span class="text-pleasant">${self.options.maxMultiple}</span>倍`)

        e.target.value = self.options.maxMultiple
      }
    }

    this.$startMultiple.spinner({
      min: 1,
      change: overMax,
      stop: overMax,
    })

    this.$gaps.spinner({
      min: 1,
    })

    this.$incMultiple.spinner({
      min: 1,
    })

    this.initStaticInfo()

    this.getPlans()
  },

  getPlans() {
    this.model.fetch({
      parse: true,
      abort: false,
      data: {
        ticketId: this.options.ticketId,
      },
    })
  },

  renderBaseInfo() {
    const currentPlanId = this.$planId.val()
    let isInDate = false
    const plans = this.model.get('plans')

    this.$planId.html(_(plans).map((planInfo, index) => {
      if (planInfo.ticketPlanId === currentPlanId) {
        isInDate = true
      }
      return `<option value="${planInfo.ticketPlanId}">${planInfo.ticketPlanId + (index === 0 ? '（当前期）' : '')}</option>`
    }))

    if (!isInDate || !currentPlanId) {
      this.$planId.val(plans[0].ticketPlanId)
    } else {
      this.$planId.val(currentPlanId)
    }

    this.$leftPlans.html(plans.length)
    this.$chasePlans.spinner('option', {
      max: plans.length,
    })

    if (!isInDate && currentPlanId) {
      this.chaseCreateHandler()
    }

    this.$('.js-bc-chase-create').trigger('click')
  },

  initStaticInfo() {
    const self = this

    this.staticGrid = this.$chaseContainer.staticGrid({
      tableClass: 'table table-bordered table-inverse table-center no-margin',
      colModel: [
        {
          label: '序号',
          name: 'index',
          width: '15%',
          formatter(val, index) {
            return index + 1
          },
        },
        {
          label: '期号',
          name: 'ticketPlanId',
          width: '25%',
          formatter(val, index) {
            if (index === 0 && val === self.options.planId) {
              return `${val}（当前期）`
            }
            return val
          },
        },
        {
          label: '倍数',
          name: 'multiple',
          width: '20%',
          formatter(val) {
            return `${'<input type="text" class="js-bc-single-plan-multiple js-gl-monitor input-xs" ' +
            'data-monitor-type="number" data-monitor-range="[1, '}${self.options.maxMultiple}]" value="${val}" /> 倍`
          },
        },
        {
          label: '当期投入',
          name: 'betMoney',
          width: '20%',
          formatter(val) {
            return _(val).convert2yuan()
          },
        },
        {
          label: '累计投入',
          name: 'statisticsMoney',
          width: '20%',
          formatter(val) {
            return _(val).convert2yuan()
          },
        },
      ],
      startOnLoading: false,
      height: 210,
    }).staticGrid('instance')
  },

  updateChasePlanGrid() {
    const chasePlanList = this.model.get('chasePlanList')
    const last = _(chasePlanList).last()

    this.staticGrid.renderRow(chasePlanList)

    this.$chaseTotal.text(chasePlanList.length)
    this.$chaseTotalMoney.text(_(last && last.statisticsMoney || 0).fixedConvert2yuan())
  },

  // event handlers

  singleMultipleHandler(e) {
    const $target = $(e.currentTarget)
    const multiple = Number($target.val())
    const index = $target.closest('.js-gl-static-tr').index()

    this.model.changeSingleMultiple(index, multiple)
  },

  chaseCreateHandler(e) {
    this.model.set('filters', this.filterHelper.serializeObject(), {
      silent: true,
    })
    this.model.trigger('change:filters')
  },

  chaseSubmitHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const chasePlanList = this.model.get('chasePlanList')
    const lastPlanInfo = _(chasePlanList).last()
    const suspend = this.$chaseSuspend.prop('checked')

    // 腾讯分分彩，金额限制1000元
    if (this.options.ticketId == 31) {
      const chasePlan = _(chasePlanList).find((item) => {
        return _(item.betMoney).formatDiv(10000) > ticketConfig.getComplete(31).info.betAmountLimit
      })
      if (chasePlan) {
        Global.ui.notification.show(`试运行期间，每期单笔投注不超过${ticketConfig.getComplete(31).info.betAmountLimit}元。`)
        return false
      }
    }

    const totalInfo = {
      totalMoney: lastPlanInfo.statisticsMoney,
      totalLottery: this.options.totalLottery,
    }

    const confirm = $(document).confirm({
      title: '确认投注',
      content: this.confirmTpl({
        ticketInfo: this.options.ticketInfo,
        planId: [chasePlanList[0].ticketPlanId, lastPlanInfo.ticketPlanId],
        totalInfo,
        previewList: this.options.previewList,
      }),
      agreeCallback() {
        $target.button('loading')

        self.model.saveChaseXhr(self.options.previewList, suspend, totalInfo.totalMoney)
          .always(() => {
            $target.button('reset')
          })
          .done((res) => {
            if (res && res.result === 0) {
              self._parentView.trigger('submit:complete')

              Global.m.oauth.check()

              Global.ui.notification.show('追号成功！', {
                type: 'success',
              })
              self._parentView.trigger('check:redPack')
            } else {
              Global.ui.notification.show(`追号失败！错误原因：${res.msg}` || '')
            }
          })
      },
    }).confirm('instance')

    this._parentView.off('change:planId', changePlanId).on('change:planId', changePlanId)

    function changePlanId() {
      confirm.hide()
    }
  },
})

module.exports = BettingCenterChaseNormalView
