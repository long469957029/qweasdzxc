const TabView = require('com/tabView')

const TrackRecordsView = TabView.extend({

  events: {},

  className: 'price-ul',

  initialize() {
    _(this.options).defaults({
      height: 739,
      tabClass: 'nav-inverse',
      tabs: [
        {
          label: '时时彩',
          name: 'constant',
          id: 'jsUCConstantTab',
          view: '',
          template: '<div class="js-uc-constContainer"><div class="js-uc-constNotice"></div><div class="js-uc-constGrid portlet-filter uc-prize"></div></div>',
        },
        {
          label: '11选5',
          name: 'elev',
          id: 'jsUCElevenSelectFiveTab',
          template: '<div class="js-uc-ElevContainer"><div class="js-uc-ElevNotice"></div><div class="js-uc-ElevGrid portlet-filter uc-prize"></div></div>',
        },
        {
          label: '低频彩',
          name: 'low',
          id: 'jsUCLowFrequentTab',
          template: '<div class="js-uc-lowContainer"><div class="js-uc-lowNotice"></div><div class="js-uc-lowGrid portlet-filter uc-prize"></div></div>',
        },
        {
          label: 'PK10',
          name: 'happy',
          id: 'jsUCHappyTab',
          template: '<div class="js-uc-happyContainer"><div class="js-uc-happyNotice"></div><div class="js-uc-happyGrid portlet-filter uc-prize"></div></div>',
        },
        {
          label: '江苏快3',
          name: 'QSan',
          id: 'jsUCQSanTab',
          template: '<div class="js-uc-QSanContainer"><div class="js-uc-QSanNotice"></div><div class="js-uc-QSanGrid portlet-filter uc-prize"></div></div>',
        },
        // {
        //   label: '六合彩',
        //   name: 'Mark6',
        //   id: 'jsMark6Tab',
        //   template: '<div class="js-uc-Mark6Container"><div class="js-uc-Mark6Notice"></div><div class="js-uc-Mark6Grid portlet-filter uc-prize"></div></div>',
        // },

        // {
        //   label: '秒秒彩',
        //   name: 'mmc',
        //   id: 'jsUCMmcFrequentTab',
        //   template: '<div class="js-uc-mmcContainer"><div class="js-uc-mmcNotice"></div><div class="js-uc-mmcGrid portlet-filter uc-prize"></div></div>'
        // }

      ],
    })

    // 未传递此参数时使用当前用户的id,分别用于个人中心及代理中心的奖金详情查询
    _(this.options).defaults({
      userId: Global.memoryCache.get('acctInfo').userId,
    })
  },

  onConstantRender () {
    const params = { ticketSeriesId: 1, subAcctId: this.options.userId }
    this._loadPage(params, 'js-uc-constGrid')
  },
  onElevRender () {
    const params = { ticketSeriesId: 2, subAcctId: this.options.userId }
    this._loadPage(params, 'js-uc-ElevGrid')
  },
  onLowRender () {
    const params = { ticketSeriesId: 3, subAcctId: this.options.userId }
    this._loadPage(params, 'js-uc-lowGrid')
  },
  onHappyRender () {
    const params = { ticketSeriesId: 4, subAcctId: this.options.userId }
    this._loadPage(params, 'js-uc-happyGrid')
  },
  onQSanRender () {
    const params = { ticketSeriesId: 7, subAcctId: this.options.userId }
    this._loadPage(params, 'js-uc-QSanGrid')
  },
  onMark6Render () {
    const params = { ticketSeriesId: 8, subAcctId: this.options.userId }
    this._loadPage(params, 'js-uc-Mark6Grid')
  },
  // onMmcRender: function () {
  //   var self = this;
  //   var params = {ticketSeriesId: 5, subAcctId: this.options.userId};
  //   this._loadPage(params, 'js-uc-mmcGrid');
  // },
  //
  ticketSeriesIdFlag: null,
  _loadPage (params, classValue) {
    this.ticketSeriesIdFlag = params.ticketSeriesId
    this.$(`.${classValue}`).html(Global.ui.loader.get())

    const self = this
    if (this.options.rebate || this.options.rebate === 0) {
      params = _(params).chain().omit('subAcctId').extend({ userRebate: this.options.rebate })
        .value()
    }
    this._getBonusData(params).done((res) => {
      if (res.result === 0) {
        if (res.root.playBonusList.ticketId === 34) { // 六合彩特殊处理34
          self.getMark6Table(self.formatMark6(res.root.playBonusList.levels), classValue)
        } else {
          self._getTable(self._formatNewGroups(self._formatLevelData(res.root.playBonusList.levels)), classValue)
          $('.js-ac-pd-ssc-maxBonus').html(self.formatMoney(_(res.root.maxBonus).formatDiv(10000, { fixed: 0 }), 0))
        }
      } else {
        Global.ui.notification.show(res.msg)
      }
    })
  },
  // 发送请求
  _getBonusData (params) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/userticketbonus.json',
      data: params,
    })
  },
  // 六合彩表格
  getMark6Table (tableInfo, classValue) {
    this.$(`.${classValue}`).staticGrid({
      tableClass: 'table table-bordered table-center',
      wrapperClass: 'border-table-bottom',
      height: this.options.height,
      colModel: [
        {
          label: '玩法群', name: 'playLevel', merge: true, width: 100,
        },
        {
          label: '玩法', name: 'playGroup', merge: true, width: 120,
        },
        { label: '投注项目', name: 'playName', width: 130 },
        // { label: '最低奖金（元模式）', name: 'bonusMin', width: 130 },
        { label: '返点', name: 'rebate', width: 120 },
        { label: '最高奖金（元模式）', name: 'bonusMax', width: 120 },
      ],
      row: tableInfo,
    })
  },
  formatMark6 (data) {
    const row = []
    _(data).each((items) => {
      _(items.groups).each((groups) => {
        _(groups.plays).each((plays) => {
          if (plays.betBonus != null) {
            _(plays.betBonus).each((betBonus) => {
              row.push({
                playLevel: items.ticketLevelName,
                playGroup: plays.ticketPlayName,
                playName: betBonus.betName,
                // bonusMin: _(betBonus.betMethodMin).formatDiv(10000, { fixed: 4 }),
                rebate: `${_(plays.userRebate).formatDiv(10)}%`,
                bonusMax: _(betBonus.betMethodMax).formatDiv(10000, { fixed: 4 }),
              })
            })
          } else {
            row.push({
              playLevel: items.ticketLevelName,
              playGroup: plays.ticketPlayName,
              playName: '',
              // bonusMin: _(plays.ticketPlayBonus).formatDiv(10000, { fixed: 4 }),
              rebate: `${_(plays.userRebate).formatDiv(10)}%`,
              bonusMax: _(plays.ticketPlayMaxBonus).formatDiv(10000, { fixed: 4 }),
            })
          }
        })
      })
    })
    return row
  },
  // 获取表格
  _getTable (tableInfo, classValue) {
    this.$(`.${classValue}`).staticGrid({
      tableClass: 'table table-similar table-center',
      wrapperClass: 'border-table-bottom',
      height: this.options.height,
      colModel: [
        {
          label: '玩法群', name: 'playLevel', merge: true, width: 100,
        },
        {
          label: '玩法组', name: 'playGroup', merge: true, width: 120,
        },
        { label: '玩法', name: 'playName', width: 130 },
        // { label: '最低奖金（元模式）', name: 'bonusMin', width: 130 },
        { label: '返点', name: 'rebate', width: 120 },
        { label: '最高奖金（元模式）', name: 'bonusMax', width: 120 },
      ],
      row: tableInfo,
    })
  },
  // 格式化数据
  _formatLevelData (levels) {
    return _(levels).chain().map((level) => {
      const playLevel = level.ticketLevelName
      const groups = level.groups
      return _(groups).map((group) => {
        const playGroup = group.ticketGroupName
        return {
          playLevel,
          playGroup,
          plays: group.plays,
        }
      })
    }).flatten()
      .value()
  },
  _formatNewGroups (groups) {
    const self = this
    return _(groups).chain().map((group) => {
      return _(group.plays).map((play) => {
        let bonusMin = ''
        let bonusMax = ''
        if (play.betBonus === null) {
          bonusMin = _(play.ticketPlayBonus).convert2yuan()
          bonusMax = `<span class="text-prominent">${_(play.ticketPlayMaxBonus).convert2yuan()}</span>`
        } else if (self.ticketSeriesIdFlag === 7) {
          bonusMin = '3或18 354.24</br>' +
                        '4或17 118.08</br>' +
                        '5或16 59.04</br>' +
                        '6或15 35.42</br>' +
                        '7或14 23.62</br>' +
                        '8或13 16.87</br>' +
                        '9或12 14.17</br>' +
                        '10或11 13.12'
          bonusMax = '<span class="text-prominent">3或18 410.40</br>' +
                        '4或17 136.80</br>' +
                        '5或16 68.40</br>' +
                        '6或15 41.04</br>' +
                        '7或14 27.36</br>' +
                        '8或13 19.54</br>' +
                        '9或12 16.42</br>' +
                        '10或11 15.20</span>'
        } else if (self.ticketSeriesIdFlag === 4) {
          const groupByBetMethodMin = _.groupBy(play.betBonus, 'betMethodMin')
          const groupByBetMethodMax = _.groupBy(play.betBonus, 'betMethodMax')

          const groupByBetMethodMinArr = []
          const groupByBetMethodMaxArr = []
          $.each(groupByBetMethodMin, (key, item) => {
            groupByBetMethodMinArr.unshift({ sumVal: key, betMethodList: item })
          })

          $.each(groupByBetMethodMax, (key, item) => {
            groupByBetMethodMaxArr.unshift({ sumVal: key, betMethodList: item })
          })

          let bonusMinHtml = ''
          $.each(groupByBetMethodMinArr, (index, item) => {
            const numArr = []
            $.each(item.betMethodList, (index1, item1) => {
              numArr.push(item1.betType)
            })
            bonusMinHtml += `${numArr.join('/')}：${_(item.sumVal).convert2yuan()}<br/>`
          })
          let bonusMaxHtml = ''
          $.each(groupByBetMethodMaxArr, (index, item) => {
            const numArr = []
            $.each(item.betMethodList, (index1, item1) => {
              numArr.push(item1.betType)
            })
            bonusMaxHtml += `${numArr.join('/')}：${_(item.sumVal).convert2yuan()}<br/>`
          })

          //pk10龙虎最高奖金
          if (!bonusMax) {
            bonusMaxHtml = _.convert2yuan(play.ticketPlayMaxBonus)
          }

          bonusMin = bonusMinHtml
          bonusMax = `<span class="text-prominent">${bonusMaxHtml}</span>`

        } else {
          const bonusMinObj = _(play.betBonus).min((bonus) => { return bonus.betMethodMin })
          const bonusMaxObj = _(play.betBonus).max((bonus) => { return bonus.betMethodMin })
          bonusMin = `龙虎:${_(bonusMinObj.betMethodMin).convert2yuan()} 和:${_(bonusMaxObj.betMethodMin).convert2yuan()}`
          bonusMax = `<span class="text-prominent">龙虎:${_(bonusMinObj.betMethodMax).convert2yuan()} 和:${_(bonusMaxObj.betMethodMax).convert2yuan()}</span>`
        }
        return {
          playLevel: group.playLevel,
          playGroup: group.playGroup,
          playName: play.ticketPlayName,
          bonusMin,
          rebate: `${_(play.userRebate).formatDiv(10)}%`,
          bonusMax,
        }
      })
    }).flatten()
      .value()
  },

  formatMoney(s, type) {
    if (/[^0-9\.]/.test(s)) { return '0' }
    if (s === null || s === '') { return '0' }
    s = s.toString().replace(/^(\d*)$/, '$1.')
    s = (`${s}00`).replace(/(\d*\.\d\d)\d*/, '$1')
    s = s.replace('.', ',')
    const re = /(\d)(\d{3},)/
    while (re.test(s)) { s = s.replace(re, '$1,$2') }
    s = s.replace(/,(\d\d)$/, '.$1')
    if (type === 0) { // 不带小数位(默认是有小数位)
      const a = s.split('.')
      if (a[1] === '00') {
        s = a[0]
      }
    }
    return s
  },

})

module.exports = TrackRecordsView
