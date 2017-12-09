

const Model = require('skeleton/model')
const ticketConfig = require('skeleton/misc/ticketConfig')

const BettingChoiceModel = Model.extend({

  url: '/ticket/bet/bet.json',

  defaults: {
    // groupId: 1,
    // groupName: '',
    // levelId: 1,
    // levelName: '',
    // multiple: 1,
    // playId: 1,
    // playName: '',
    betBonus: {},
    maxBonus: 195000,
    unit: 10000,
    formatUnit: '元',
    statistics: 0,
    userRebate: 0,
    previewList: [],
    buyList: [],
    totalInfo: {},
    buyInfo: {},
    usePack: 0,
    // ticketId:
  },

  saveBettingXhr(planId) {
    const self = this

    const params = this.pick('playId', 'multiple', 'userRebate', 'previewList')
    const previewList = _(params.previewList).reduce((list, item) => {
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
      url: '/ticket/bet/bet.json',
      tradition: true,
      data: {
        planId,
        bet: previewList,
        usePack: this.get('usePack'),
      },
    })
      .done((res) => {
        if (res && res.result === 0) {
          self.emptyPrevBetting()
        }
      })
  },

  buyBettingXhr(planId) {
    const self = this

    const params = this.pick('playId', 'multiple', 'userRebate', 'buyList')
    const buyList = _(params.buyList).reduce((list, item) => {
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
      url: '/ticket/bet/bet.json',
      tradition: true,
      data: {
        planId,
        bet: buyList,
        usePack: this.get('usePack'),
      },
    })
      .done((res) => {
        if (res && res.result === 0) {
          self.emptyBuyBetting()
        }
      })
  },

  initialize() {
    this.on('change:multiple change:statistics change:userRebate change:betMethod', this.calculateByPrefab)
    this.on('change:maxBonus change:multiple change:unit', this.calculateMaxBonus)
    this.on('change:maxMultiple change:unit', function() {
      const info = this.pick('maxMultiple', 'unit')
      this.set('formatMaxMultiple', _(info.maxMultiple).chain().mul(10000).div(info.unit)
        .value())
    })

    this.on('change:unit', function(model, unit) {
      let unitText = ''
      switch (unit) {
        case 10000:
          unitText = '元'
          break
        case 1000:
          unitText = '角'
          break
        case 100:
          unitText = '分'
          break
        case 10:
          unitText = '厘'
          break
        default:
          break
      }
      this.set('formatUnit', unitText)
      this.calculateByPrefab()
    })

    this.on('change:previewList', this.calculateTotal)
    this.on('change:buyList', this.calculateBuyInfo)

    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()
  },

  calculateByPrefab() {
    const info = this.pick('statistics', 'betMethod', 'multiple', 'userRebate')

    if (info.statistics && info.multiple) {
    // if (info.statistics && info.multiple && info.userRebate) {
      const prefabMoney = _(info.statistics).chain().mul(info.multiple).mul(2)
        .mul(this.get('unit'))
        .value()

      this.set({
        prefabMoney,
        rebateMoney: info.betMethod === 1 ? _(prefabMoney).chain().mul(info.userRebate).div(1000)
          .value() : 0,
      })
    } else {
      this.set({
        prefabMoney: 0,
        rebateMoney: 0,
      })
    }
  },

  getStatisticsInfo() {
    const info = this.pick('statistics', 'prefabMoney', 'rebateMoney')

    info.prefabMoney = _(info.prefabMoney).convert2yuan()
    info.rebateMoney = _(info.rebateMoney).convert2yuan()

    return info
  },

  calculateMaxBonus() {
    const multiple = this.get('multiple')

    if (multiple) {
      this.set('formatMaxBonus', _(this.get('maxBonus')).chain()
        .div(10000).mul(this.get('unit'))
        .mul(multiple)
        .value())
    }
  },

  calculateTotal() {
    const previewList = this.get('previewList')

    const totalInfo = _(previewList).reduce((info, item) => {
      info.totalLottery = _(info.totalLottery).add(item.statistics)
      info.totalMoney = _(info.totalMoney).add(item.prefabMoney)
      info.totalRebateMoney = _(info.totalRebateMoney).add(item.rebateMoney)
      return info
    }, {
      totalLottery: 0,
      totalMoney: 0,
      totalRebateMoney: 0,
    })

    this.set('totalInfo', totalInfo)
  },

  calculateBuyInfo() {
    const buyList = this.get('buyList')

    const buyInfo = _(buyList).reduce((info, item) => {
      info.totalLottery = _(info.totalLottery).add(item.statistics)
      info.totalMoney = _(info.totalMoney).add(item.prefabMoney)
      info.totalRebateMoney = _(info.totalRebateMoney).add(item.rebateMoney)
      return info
    }, {
      totalLottery: 0,
      totalMoney: 0,
      totalRebateMoney: 0,
    })

    this.set('buyInfo', buyInfo)
  },

  // 手动输入和自动生成、选择的唯一区别在于分隔符要用空格
  formatBettingNumber(bettingNumber, options) {
    let number = ''
    options = _(options || {}).defaults({
      type: 'data',
    })

    if (!_.isEmpty(options.selectOptionals)) {
      number += `${options.selectOptionals.join(',')}|`
    }

    if (bettingNumber.length === 1) {
      number += bettingNumber[0].join(',')
    } else {
      number += _(bettingNumber).map((row) => {
        if (_.isEmpty(row)) {
          row = ['-']
        }

        // 如果有值，则用该符号隔开number
        if (options.format) {
          return row.join(options.format.symbol)
        }
        // 同行是否用空格隔开
        return row.join(options.type === 'display' ? '' : ' ')
      }).join(',')
    }

    if (options.formatToNum) {
      number = this._formatToNum(number, options)
    }

    return number
  },

  // 将球上的文字转换成对应的数值
  _formatToNum(betNum, options) {
    let newNum = betNum
    if (_.indexOf(this.mark6TicketIdArr, parseInt(options.ticketId, 10)) > -1) {
      if (options.formatToNumInfo) {
        const newNumArr = []
        const replaceArr = options.formatToNumInfo
        const selectArr = newNum.split(',')
        _(selectArr).each((text) => {
          _(replaceArr).each((item) => {
            if (text === item.name) {
              newNumArr.push(item.value)
            }
          })
        })
        newNum = newNumArr.join()
      }
    } else {
      while (newNum.indexOf('大') !== -1 || newNum.indexOf('小') !== -1 || newNum.indexOf('单') !== -1 || newNum.indexOf('双') !== -1
      || newNum.indexOf('龙') !== -1 || newNum.indexOf('虎') !== -1 || newNum.indexOf('和') !== -1 || newNum.indexOf('三同号通选') !== -1 || newNum.indexOf('三连号通选') !== -1) {
        newNum = newNum.replace('大', 1)
        newNum = newNum.replace('小', 2)
        newNum = newNum.replace('单', 3)
        newNum = newNum.replace('双', 4)
        newNum = newNum.replace('龙', 0)
        newNum = newNum.replace('虎', 1)
        newNum = newNum.replace('和', 2)
        newNum = newNum.replace('三同号通选', 0)
        newNum = newNum.replace('三连号通选', 0)
      }
    }
    return newNum
  },

  _addBets(bettingList, options) {
    const selectInfo = this.pick(
      'levelName',
      'playId',
      'multiple',
      'playName',
      'bonusMode',
      'formatBonusMode',
      'unit',
      'formatUnit',
      'betMethod',
      'maxBonus',
      'userRebate',
      'formatMaxMultiple',
      'maxMultiple',
      'rebateMoney',
      'formatMaxBonus',
      'ticketId',
    )

    let previewList = this.get('previewList')
    let buyList = this.get('buyList')
    const items = []
    const sameBets = []

    options = _(options || {}).defaults({
    })

    _(bettingList).each(function(bettingInfo) {
      let sameBet
      let statistics

      if (bettingInfo.statistics) {
        statistics = bettingInfo.statistics
      } else {
        statistics = options.statistics
      }

      let item = {
        levelName: selectInfo.levelName,
        playId: selectInfo.playId,
        playName: selectInfo.playName,
        bettingNumber: this.formatBettingNumber(bettingInfo.lotteryList, {
          selectOptionals: bettingInfo.selectOptionals,
          formatToNum: bettingInfo.formatToNum,
          playId: selectInfo.playId,
          ticketId: selectInfo.ticketId,
          formatToNumInfo: bettingInfo.formatToNumInfo || false,
        }),
        // 显示用
        formatBettingNumber: this.formatBettingNumber(bettingInfo.lotteryList, {
          type: 'display',
          format: bettingInfo.format,
        }),
        type: bettingInfo.type,
        formatBonusMode: selectInfo.formatBonusMode,
        multiple: selectInfo.multiple,
        unit: selectInfo.unit,
        statistics,
        formatUnit: selectInfo.formatUnit,
        betMethod: selectInfo.betMethod,
        userRebate: selectInfo.userRebate,
        rebateMoney: selectInfo.rebateMoney,
        maxMultiple: selectInfo.formatMaxMultiple,
        maxBonus: selectInfo.maxBonus,
        formatMaxBonus: selectInfo.formatMaxBonus,
      }

      // if (!_.isUndefined(options.statistics)) {
      //  //手选
      //  item.rebateMoney = options.rebateMoney;
      // } else {
      //  //机选
      //  item.rebateMoney = _(prefabMoney).chain().mul(selectInfo.userRebate).div(100).value();
      // }

      // 判断是否有相同的投注,几个方面比较playId,unit,betMethod,bettingNumber
      if (!options.buy) {
        sameBet = _(previewList).findWhere({
          playId: item.playId,
          unit: item.unit,
          betMethod: item.betMethod,
          bettingNumber: item.bettingNumber,
        })

        if (sameBet) {
          sameBet.multiple = _(sameBet.multiple).add(item.multiple)
          // if (sameBet.multiple > sameBet.maxMultiple) {
          //  sameBet.multiple = sameBet.maxMultiple;
          // }
          item = sameBet
        }
      }

      // 计算prefabMoney 和 rebateMoney

      item.prefabMoney = _(2).chain()
        .mul(item.multiple).mul(item.statistics)
        .mul(item.unit)
        .value()

      // rebateMoney: info.betMethod === 1 ? _(prefabMoney).chain().mul(info.userRebate).div(1000).value() : 0
      // item.rebateMoney = _(item.prefabMoney).chain()
      //  .mul(selectInfo.userRebate).div(100).value();

      if (sameBet) {
        sameBets.push(item)
      } else {
        items.splice(0, 0, item)
      }
    }, this)

    if (!options.buy) {
      previewList = items.concat(previewList)

      this.set('previewList', previewList)

      this.trigger('change:previewList', this)
    } else {
      buyList = items.concat(buyList)

      this.set('buyList', buyList)

      this.trigger('change:buyList', this)
    }

    return sameBets
  },

  addAutoBets(bettingList) {
    return this._addBets(bettingList)
  },

  addPrevBet(bettingInfo, options) {
    const selectInfo = this.pick('statistics')

    if (selectInfo.statistics) {
      if (!_.isNull(this.get('maxBetNums')) && selectInfo.statistics > this.get('maxBetNums')) {
        this._addBets([bettingInfo], _(options || {}).extend(selectInfo, { buy: true }))
        return { MaxBetNums: this.get('maxBetNums') }
      }
      this.emptyBuyBetting()
      return this._addBets([bettingInfo], _(options || {}).extend(selectInfo))
    }
    return false
  },

  emptyPrevBetting() {
    this.set('previewList', [])

    this.trigger('change:previewList:del', this)
    this.trigger('change:previewList', this)
  },

  delPrevBetting(index) {
    const previewList = this.get('previewList')
    previewList.splice(index, 1)

    this.trigger('change:previewList:del', this, index)
    this.trigger('change:previewList', this, index)
  },

  emptyBuyBetting() {
    this.set('buyList', [])

    this.trigger('change:buyList:del', this)
    this.trigger('change:buyList', this)
  },

  changePreviewMultipleBet(index, num) {
    const previewList = this.get('previewList')
    previewList[index].multiple = parseInt(num, 10)
    console.log(previewList)
    this.trigger('change:previewList', this, index)
  },


})

module.exports = BettingChoiceModel
