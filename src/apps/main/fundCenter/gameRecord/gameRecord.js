const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const gameConfig = require('skeleton/misc/gameConfig')

const fishBetRecordView = SearchGrid.extend({

  template: require('fundCenter/gameRecord/gameRecord.html'),

  events: {
    'change .js-gc-gr-channelId': 'channelIdChangeHandler',
    'change .js-gc-gr-channelId-type': 'channelTypeChangeHandler',
  },
  channelTypeChangeHandler() {
    const game = this.$('select[name="channelIdType"]').val()
    const channelId = game.substr(0, 1)
    const type = game.substr(1, 1)
    this.$('.js-ac-br-channelId').val(channelId)
    this.$('.js-ac-br-type').val(type)
  },

  initialize () {
    _(this.options).extend({
      height: '504',
      tableClass: 'table table-bordered table-center border-bottom',
      columns: [
        {
          name: '注单编号',
          width: '20%',
        },
        {
          name: '投注时间',
          width: '15%',
        },

        {
          name: '平台',
          width: '10%',
        },
        {
          name: '游戏',
          width: '11%',
        },
        {
          name: '真实投注',
          width: '11%',
        },
        {
          name: '有效投注',
          width: '11%',
        },
        {
          name: '派奖',
          width: '11%',
        },
        {
          name: '盈亏',
          width: '11%',
        },
      ],
      gridOps: {
        emptyTip: '没有投注记录',
      },
      ajaxOps: {
        url: '/ticket/game/history.json',
        // abort: false,
      },
      reqData: {
        channelId: this.options.channelId,
      },
      listProp: 'root.dataList',
      // tip: '<div class="tip-hot"><span>注意</span> 游戏记录只保留最近30天。</div>',
    })
  },

  onRender() {
    // 初始化时间选择
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
      size: 'timer-record-input',
      showIcon: true,
      minDate:_(moment().subtract(30, 'days')).toTime()
    }).render()

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.dataList).map(function (bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })

    // 加上统计行
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>所有页总计</strong>',
        '', '', '',
        _(gridData.realBetTotal).fixedConvert2yuan(),
        _(gridData.betTotal).fixedConvert2yuan(),
        _(gridData.amountTotal).fixedConvert2yuan(),
        _(gridData.profitTotal).convert2yuan(),
      ],
    }).hideLoading()
  },

  formatRowData(rowInfo) {
    // tradeNo:"xxxxxxx",
    //   createTime:133333333,
    //   channelId:1, // 渠道类型：1AG，2EBET，3BBIN，4PT，5MG，6GG，7 188体育
    //   game:"百家乐",   // 游戏
    //   username:"leoleo", // 用户名
    //   realBet:100000, // 真实投注
    //   bet:100000,     // 投注
    //   amount:1000,    // 派奖
    //   profit:1000     // 盈亏
    const row = []
    // 编号
    row.push(rowInfo.tradeNo)
    // 投注时间
    row.push(_(rowInfo.createTime).toTime())
    // 平台
    row.push(gameConfig.getChannelById(rowInfo.channelId).channelName)
    // 游戏
    row.push(rowInfo.game)
    // 真实投注
    row.push(_(rowInfo.realBet).convert2yuan())
    // 有效投注
    row.push(_(rowInfo.bet).convert2yuan())
    // 派奖
    row.push(_(rowInfo.amount).convert2yuan())// '<span class="text-bold-pleasant">' ++ '</span>'
    // 盈亏
    row.push(_(rowInfo.profit).convert2yuan())

    return row
  },
  channelIdChangeHandler(e) {
    const $target = $(e.currentTarget)
    const $type = this.$('.js-gc-gr-type')
    const channelId = $target.val()
    const options = [
      {
        type: 1,
        options: [
          '<option value="1">真人</option>',
        ],
      },
      // {
      //   type:2,
      //   options:[
      //     '<option>体育</option>',
      //   ]
      // },
      {
        type: 3,
        options: [
          '<option value="3">老虎机</option>',
        ],
      },
      {
        type: 4,
        options: [
          '<option value="4">捕鱼</option>',
        ],
      },

    ]
    switch (Number(channelId)) {
      case 1:
        $type.html(options[0].options.concat(options[2].options).join(''))
        break
      case 2:
        $type.html(options[0].options.join(''))
        break
      case 3:
        $type.html(options[0].options.join(''))
        break
      case 4:
        $type.html(options[1].options.join(''))
        break
      case 5:
        $type.html(options[1].options.join(''))
        break
      case 6:
        $type.html(options[2].options.join(''))
        break
      default:
        break
    }
  },
})

module.exports = fishBetRecordView
