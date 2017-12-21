

const Model = require('skeleton/model')

const BettingChaseModel = Model.extend({

  url: '/ticket/chase/chaseinfo.json',

  defaults: {
    plans: [],
    chasePlans: 5,
    startMultiple: 1,
    gaps: 1,
    incMultiple: 1,
    usePack: 0,
  },

  parse(res) {
    if (res && res.result === 0) {
      return {
        plans: _(res.root).map((planInfo) => {
          return _(planInfo).extend({
            formatTicketStarttime: _(planInfo.ticketStarttime).toTime(),
            formatTicketEndtime: _(planInfo.ticketEndtime).toTime(),
            ticketOpentime: _(planInfo.ticketOpentime).toTime(),
          })
        }),
      }
    }
  },

  saveChaseXhr(previewList, suspend, totalMoney) {
    previewList = _(previewList).reduce((list, item) => {
      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        // 0 高奖金 1 有返点
        betMethod: item.betMethod,
      })

      return list
    }, [])

    return Global.sync.ajax({
      url: '/ticket/chase/chase.json',
      tradition: true,
      data: {
        plan: this.get('chasePlanList'),
        play: previewList,
        suspend,
        usePack: this.get('usePack'),
        amount: totalMoney,
      },
    })
  },

  getPlans(startPlanId, chasePlans) {
    const plans = this.get('plans')
    const planInfo = _(plans).findWhere({
      ticketPlanId: startPlanId,
    })
    const startIndex = _(plans).indexOf(planInfo)

    return plans.slice(startIndex, _(startIndex).add(chasePlans))
  },


  initialize() {
    this.on('change:filters', this.updateChasePlans)
  },

  kickFirstPlan(planId) {
    const plans = this.get('plans')
    if ((`${plans[0].ticketPlanId}`) === (`${planId}`)) {
      this.set('plans', _(plans).rest())
    }
  },

  updateChasePlans() {
    const filters = this.get('filters')
    const chasePlans = this.getPlans(filters.startPlanId, filters.chasePlans)

    let currentGaps = filters.gaps
    let times = 1
    let multiple = 1

    let statisticsMoney = 0

    this.set('chasePlanList', _(chasePlans).map(function(chasePlan) {
      if (currentGaps === 0) {
        multiple = Math.pow(filters.incMultiple, times)
        ++times
        currentGaps = filters.gaps
      }

      --currentGaps

      const calculate = this._calculate(chasePlan.ticketPlanId, multiple, statisticsMoney)

      statisticsMoney = calculate.statisticsMoney

      return calculate
    }, this))
  },

  _calculate(ticketPlanId, multiple, statisticsMoney) {
    const filters = this.get('filters')
    const info = this.pick('basicBettingMoney', 'maxMultiple')

    multiple = _(filters.startMultiple).mul(multiple)

    if (multiple > info.maxMultiple) {
      multiple = info.maxMultiple
    }

    const betMoney = _(info.basicBettingMoney).mul(multiple)
    statisticsMoney = _(statisticsMoney).add(betMoney)

    return {
      ticketPlanId,
      multiple,
      betMoney,
      statisticsMoney,
    }
  },

  changeSingleMultiple(index, singleMultiple) {
    let statisticsMoney = 0
    const chasePlanList = this.get('chasePlanList')
    chasePlanList[index].multiple = singleMultiple


    this.set('chasePlanList', _(chasePlanList).map(function(chasePlan) {
      const calculate = this._calculate(chasePlan.ticketPlanId, chasePlan.multiple, statisticsMoney)

      statisticsMoney = calculate.statisticsMoney

      return calculate
    }, this))
  },
})

module.exports = BettingChaseModel
