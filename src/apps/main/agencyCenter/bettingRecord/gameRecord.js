

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

const gameConfig = require('skeleton/misc/gameConfig')

// var RealBetRecordView = require('agencyCenter/bettingRecord/real');
// var SlotBetRecordView = require('agencyCenter/bettingRecord/slot');
// var SportBetRecordView = require('agencyCenter/bettingRecord/sport');
// var FisherBetRecordView = require('agencyCenter/bettingRecord/fisher');

const gameRecordView = SearchGrid.extend({

  template: require('agencyCenter/bettingRecord/gameRecord.html'),

  events: {
    // 'click .js-ac-queryBtn': 'queryBtnClickHandler',
    'change .js-ac-br-channelId-type': 'channelTypeChangeHandler',
  },

  channelTypeChangeHandler(e) {
    const game = this.$('select[name="channelIdType"]').val()
    const channelId = game.substr(0, 1)
    const type = game.substr(1, 1)
    this.$('.js-ac-br-channelId').val(channelId)
    this.$('.js-ac-br-type').val(type)
  },

  // queryBtnClickHandler: function(){
  //   var game = this.$('select[name="channelId"]').val();
  //   var startTime = this.$('input[name="startTime"]').val();
  //   var endTime = this.$('input[name="endTime"]').val();
  //   var channelId = game.substr(0,1);
  //   var type = game.substr(1,1);
  //
  //
  //   this.options.channnelId = channelId;
  //   var options = _(this.options).extend({
  //     channelId: channelId,
  //     type: type,
  //     startTime: startTime,
  //     endTime: endTime,
  //   });
  //   {/*<option value="11">AG真人</option>*/}
  //   {/*<option value="14">AG捕鱼</option>*/}
  //     {/*<option value="21">EBET真人</option>*/}
  //     {/*<option value="31">BBIN真人</option>*/}
  //     {/*<option value="43">PT老虎机</option>*/}
  //     {/*<option value="53">MG老虎机</option>*/}
  //     {/*<option value="64">GG捕鱼</option>*/}
  //     {/*<option value="72">188体育</option>*/}
  //   switch(channelId){
  //     case 1: this.el.html(new RealBetRecordView(options).render().el);break;
  //     case 2: this.el.html(new RealBetRecordView(options).render().el);break;
  //   }
  // },

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '注单编号',
          width: '20%',
        },
        {
          name: '投注时间',
          width: '16%',
        },
        {
          name: '用户名',
          width: '12%',
        },
        {
          name: '平台',
          width: '5%',
        },
        {
          name: '游戏',
          width: '9%',
        },
        {
          name: '真实投注',
          width: '9%',
        },
        {
          name: '有效投注',
          width: '9%',
        },
        {
          name: '派奖',
          width: '9%',
        },
        {
          name: '盈亏',
          width: '9%',
        },
      ],
      gridOps: {
        emptyTip: '没有投注记录',
      },
      ajaxOps: {
        url: '/ticket/game/history.json',
        abort: false,
      },
      // reqData:{
      //   channelId: this.options.channelId,
      //   type: this.options.type,
      //   startTime: this.options.startTime,
      //   endTime: this.options.endTime,
      // },
      listProp: 'root.dataList',
      tip: '<div class="tip-hot"><span>注意</span> 投注记录只保留最近30天。</div>',
      height: 290,
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTimeHolder: '起始日期',
      startDefaultDate: _(moment().add('day', 0)).toDate(),
      endTimeHolder: '结束日期',
      endDefaultDate: _(moment().add('day', 0)).toDate(),
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
    }).render()

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const num = 0
    const rowsData = _(gridData.dataList).map(function(bet, index, betList) {
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
        '', '', '', '',
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
    //
    row.push(rowInfo.username)
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
})

module.exports = gameRecordView
