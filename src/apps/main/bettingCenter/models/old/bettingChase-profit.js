

const Model = require('skeleton/model')

const BettingChaseModel = Model.extend({

  url: '/ticket/chase/chaseinfo.json',

  defaults: {
    plans: [],
    chasePlans: 5,
    startMultiple: 1,
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
  // 利润率公式(P*M-(M+X)I)/ (M+X)I> R
  // P当期奖金基础值,I投入基础值，M当前次倍数，X 之前累计的倍数，R目标利润率
  // 反推单次倍数 XI(R + 1 ) / (P - I - RI ) == M
  // 利润金额    (P-I)M - XI > R    (R + XI) / (P - I) = M

  saveChaseXhr(previewList, suspend, totalMoney) {
    const self = this

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

  initialize() {
    this.on('change:filters', this.updateChasePlans)
  },

  kickFirstPlan(planId) {
    const plans = this.get('plans')
    if ((`${plans[0].ticketPlanId}`) === (`${planId}`)) {
      this.set('plans', _(plans).rest())
    }
  },

  getPlans(startPlanId, chasePlans) {
    const plans = this.get('plans')
    const planInfo = _(plans).findWhere({
      ticketPlanId: startPlanId,
    })
    const startIndex = _(plans).indexOf(planInfo)

    return plans.slice(startIndex, _(startIndex).add(chasePlans))
  },

  updateChasePlans() {
    const filters = this.get('filters')

    const chasePlans = this.getPlans(filters.startPlanId, filters.chasePlans)
    const info = this.pick(
      'basicBettingMoney',
      'basicMaxBonus',
    )

    filters.startMultiple = Number(filters.startMultiple)

    // 投入基础值
    info.perBetMoney = info.basicBettingMoney
    // info.perBetMoney = _(info.basicBettingMoney).mul(filters.startMultiple);
    // 当期奖金基础值
    info.perBasicMaxBonus = info.basicMaxBonus
    // info.perBasicMaxBonus = _(info.basicMaxBonus).mul(filters.startMultiple);
    // 基础利润比率
    const perRateMoneyRate = _(info.perBasicMaxBonus).div(info.perBetMoney)
    // 基础利润金额
    const perRateMoney = _(info.perBasicMaxBonus).sub(info.perBetMoney)

    this.set({
      perBetMoney: info.perBetMoney,
      perBasicMaxBonus: info.perBasicMaxBonus,
      perRateMoneyRate,
      perRateMoney,
    })

    let formatChasePlans

    if (filters.rate || filters.prevRate) {
      formatChasePlans = this.rateCalculate(chasePlans, info, filters)
    } else {
      formatChasePlans = this.amountCalculate(chasePlans, info, filters)
    }

    this.set('chasePlanList', formatChasePlans)
  },

  // 利润率公式
  // 公式((P-I)M)/(M+X)I > R
  // P当期奖金基础值,I投入基础值，M当前次倍数，X 之前累计的倍数，R目标利润率
  rateCalculate(chasePlans, info, filters) {
    // 之前倍数总和
    let prevTotalMultiple = 0
    let formatChasePlans = []
    let calculated

    if (_.isUndefined(filters.rate)) {
      calculated = this._rateCalculate({
        info,
        chasePlans: chasePlans.slice(0, Number(filters.prevPlans)),
        prevTotalMultiple,
        rate: filters.prevRate,
        startMultiple: filters.startMultiple,
      })

      prevTotalMultiple = calculated.prevTotalMultiple
      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans)

      if (!_.isEmpty(calculated.formatChasePlans)) {
        calculated = this._rateCalculate({
          info,
          chasePlans: chasePlans.slice(Number(filters.prevPlans)),
          prevTotalMultiple,
          rate: filters.afterRate,
          startMultiple: filters.startMultiple,
        })

        formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans)
      }
    } else {
      calculated = this._rateCalculate({
        chasePlans,
        prevTotalMultiple,
        rate: filters.rate,
        startMultiple: filters.startMultiple,
      })

      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans)
    }

    return formatChasePlans
  },

  _rateCalculate(options) {
    const chasePlans = options.chasePlans
    let prevTotalMultiple = options.prevTotalMultiple
    const rate = _(options.rate).div(100)
    // var rate = options.rate;

    const maxMultiple = this.get('maxMultiple')
    let multiple = options.startMultiple
    const formatChasePlans = []

    const constant = _(rate).chain().add(1).div(this.get('perRateMoneyRate'))
      .value()
    let calculate

    if (constant < 0) {
      return formatChasePlans
    }

    for (let index = 0; index < chasePlans.length; ++index) {
      calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple)

      if (calculate.bonusRate < rate) {
        multiple = Math.ceil(_(prevTotalMultiple).chain().mul(constant).div(_(1).sub(constant))
          .value())

        calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple)
      }

      if (multiple > maxMultiple || multiple <= 0) {
        break
      }

      prevTotalMultiple += multiple

      formatChasePlans.push(calculate)
    }

    return {
      prevTotalMultiple,
      formatChasePlans,
    }
  },

  _calculate(ticketPlanId, multiple, prevTotalMultiple) {
    const info = this.pick('perBetMoney', 'perBasicMaxBonus')

    // 当期投入
    const betMoney = _(info.perBetMoney).mul(multiple)
    // 当期奖金
    const basicMaxBonus = _(info.perBasicMaxBonus).mul(multiple)
    // 累计投入
    const statisticsMoney = _(info.perBetMoney).mul(multiple + prevTotalMultiple)
    // 预期盈利
    const expectBonus = _(basicMaxBonus).sub(statisticsMoney)
    // 利润率
    const bonusRate = _(expectBonus).div(statisticsMoney)

    return {
      ticketPlanId,
      multiple,
      betMoney,
      statisticsMoney,
      basicMaxBonus,
      expectBonus,
      bonusRate,
      prevTotalMultiple,
    }
  },

  // 利润金额公式
  // (P-I)M - XI > R
  amountCalculate(chasePlans, info, filters) {
    let prevTotalMultiple = 0
    let formatChasePlans = []
    let calculated

    if (_.isUndefined(filters.amount)) {
      calculated = this._amountCalculate({
        info,
        chasePlans: chasePlans.slice(0, Number(filters.prevPlans)),
        prevTotalMultiple,
        amount: filters.prevAmount,
        startMultiple: filters.startMultiple,
      })

      prevTotalMultiple = calculated.prevTotalMultiple
      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans)

      if (!_.isEmpty(calculated.formatChasePlans)) {
        calculated = this._amountCalculate({
          info,
          chasePlans: chasePlans.slice(Number(filters.prevPlans)),
          prevTotalMultiple,
          amount: filters.afterAmount,
          startMultiple: filters.startMultiple,
        })

        formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans)
      }
    } else {
      calculated = this._amountCalculate({
        info,
        chasePlans,
        prevTotalMultiple,
        amount: filters.amount,
        startMultiple: filters.startMultiple,
      })

      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans)
    }

    return formatChasePlans
  },

  _amountCalculate(options) {
    const info = options.info
    const maxMultiple = this.get('maxMultiple')
    const chasePlans = options.chasePlans
    let prevTotalMultiple = options.prevTotalMultiple
    const amount = _(options.amount).formatMul(10000)

    let multiple = options.startMultiple

    const formatChasePlans = []
    let calculate

    for (let index = 0; index < chasePlans.length; ++index) {
      calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple)

      if (calculate.expectBonus < amount) {
        multiple = Math.ceil(_(amount).chain().add(_(info.perBetMoney).mul(prevTotalMultiple)).div(this.get('perRateMoney'))
          .value())

        calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple)
      }

      if (multiple > maxMultiple || multiple <= 0) {
        break
      }

      prevTotalMultiple += multiple

      formatChasePlans.push(calculate)
    }

    return {
      prevTotalMultiple,
      formatChasePlans,
    }
  },

  changeSingleMultiple(singleIndex, singleMultiple) {
    const chasePlanList = this.get('chasePlanList')
    chasePlanList[singleIndex].multiple = singleMultiple

    let prevTotalMultiple = 0

    this.set('chasePlanList', _(chasePlanList).map(function(chasePlan, index) {
      if (index >= singleIndex) {
        chasePlan = this._calculate(chasePlan.ticketPlanId, chasePlan.multiple, prevTotalMultiple)
      }

      prevTotalMultiple += chasePlan.multiple

      return chasePlan
    }, this))
  },
})

module.exports = BettingChaseModel
