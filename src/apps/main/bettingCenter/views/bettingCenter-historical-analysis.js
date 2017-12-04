

const ticketConfig = require('skeleton/misc/ticketConfig')

const BettingCenterHisAnalysisDetailView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter-historical-analysis.html'),

  height: 650,

  tableClass: 'table table-center',

  events: {
    'click .js-bc-his-num': 'bcHisNumHandler',
    'click .js-his-reduction': 'recoveryHandler',
  },

  widthId: '50%',
  widthNum: '50%',

  serializeData () {
    this.sscTicketIdArr = _(ticketConfig.getSccList()).pluck('id')
    this.c115TicketIdArr = _(ticketConfig.getChoose5List()).pluck('id')
    this.dpcTicketIdArr = _(ticketConfig.getLowList()).pluck('id')
    this.bjpk10TicketIdArr = _(ticketConfig.getHappyList()).pluck('id')
    // if(_(this.sscTicketIdArr).indexOf(this.options.ticketId)!==-1){
    //     var numCount = _.range(0,10);
    //     this.className = 'm-left-sm m-right-sm';
    //     this.numClassName = 'm-left-sm m-right-sm';
    // }else if(_(this.c115TicketIdArr).indexOf(this.options.ticketId)!==-1){
    //     var numCount = ['01','02','03','04','05','06','07','08','09','10','11'];
    //     this.className = '';
    //     this.numClassName = 'm-left-sm m-right-xs';
    //     this.widthId = '40%';
    //     this.widthNum = '60%';
    // }else if(_(this.dpcTicketIdArr).indexOf(this.options.ticketId)!==-1){
    //     var numCount = _.range(0,10);
    //     this.className = 'm-left-sm m-right-sm';
    //     this.numClassName = 'm-left-sm m-right-sm';
    // }else if(_(this.bjpk10TicketIdArr).indexOf(this.options.ticketId)!==-1) {
    //     var numCount = ['01','02','03','04','05','06','07','08','09','10'];
    //     this.className = 'm-left-s m-right-s';
    //     this.numClassName = 'm-right-s';
    //     this.widthId = '25%';
    //     this.widthNum = '75%';
    // }
    // return {
    //     ticketId: this.options.ticketId,
    //     numCount:numCount,
    //     className: this.className
    // }

    // if(_(this.sscTicketIdArr).indexOf(this.options.ticketId)!==-1){
    //     var numCount = _.range(0,10);
    //     this.className = 'm-left-sm m-right-sm';
    //     this.numClassName = 'm-left-sm m-right-sm';
    // }else if(_(this.c115TicketIdArr).indexOf(this.options.ticketId)!==-1){
    //     var numCount = ['1','2','3','4','5','6','7','8','9','10','11'];
    //     this.className = 'm-right-sm';
    //     this.numClassName = 'm-right-sm inline-block width-15';
    //     this.widthId = '40%';
    //     this.widthNum = '60%';
    // }else if(_(this.dpcTicketIdArr).indexOf(this.options.ticketId)!==-1){
    //     var numCount = _.range(0,10);
    //     this.className = 'm-left-sm m-right-sm';
    //     this.numClassName = 'm-left-sm m-right-sm';
    // }else if(_(this.bjpk10TicketIdArr).indexOf(this.options.ticketId)!==-1) {
    //     var numCount = ['1','2','3','4','5','6','7','8','9','10'];
    //     this.className = 'm-left-sm m-right-sm';
    //     this.numClassName = 'm-right-sm';
    //     this.widthId = '25%';
    //     this.widthNum = '75%';
    // }
    return {
      ticketId: this.options.ticketId,
    }
  },

  initialize() {

  },

  onRender() {
    this.$hisNum = this.$('.js-bc-his-num')
    this.$drawRecords = this.$('.js-his-draw')
    this.$numInput = this.$('.js-his-num-input')
    this.$hisHoth = this.$('.js-his-both')
    this.$sscMain = this.$('.js-ssc-main')
    this.$hisList = this.$('.js-his-both-list')
    this.renderDrawRecords()
  },
  update (data, needUpdate) {
    if (Number(data) === 21 || Number(data) === 16) {
      this.$sscMain.addClass('hidden')
      this.$hisHoth.removeClass('hidden')
      this.widthId = '50%'
      this.widthNum = '50%'
      // if(needUpdate){
      this.renderBothRecords()
      // }
    } else {
      this.$hisHoth.addClass('hidden')
      this.$sscMain.removeClass('hidden')
      if (needUpdate) {
        this.renderDrawRecords()
      }
    }
  },
  renderDrawRecords() {
    const self = this
    if (!this.drawRecords) {
      this.drawRecords = this.$drawRecords.staticGrid({
        tableClass: this.tableClass,
        colModel: [
          {
            label: '',
            name: 'ticketPlanId',
            width: `${self.widthId}`,
            formatter(val) {
              return val
            },
          },
          {
            label: '',
            name: '',
            width: '1%',
            formatter() {
              return '<span class="gray-line"></span>'
            },
          },
          {
            label: '',
            name: 'ticketOpenNum',
            width: `${self.widthNum}`,
            formatter(val) {
              const ticketArr = val.split(',')
              const html = []
              _(ticketArr).each((info) => {
                // html.push('<span class="js-his-num-list js-his-num'+ parseInt(info, 10) +' '+ self.numClassName +'">'+ parseInt(info, 10) +'</span>');
                html.push(`<span class="js-his-num-list js-his-num${info} ${self.numClassName}">${info}</span>`)
              })
              return html.join('')
            },
          },
        ],
        url: '/ticket/ticketmod/openhistory.json',
        emptyTip: '最近无开奖记录',
        abort: false,
        // initRemote: false,
        showHeader: false,
        height: this.height,
        data: {
          pageSize: 15,
          ticketId: this.options.ticketId,
        },
        dataProp: 'root.openedList',
      }).staticGrid('instance')
    } else {
      this.drawRecords.update()
    }
  },
  renderBothRecords() {
    const self = this
    if (!this.bothRecords) {
      this.bothRecords = this.$hisList.staticGrid({
        tableClass: this.tableClass,
        colModel: [
          {
            label: '',
            name: 'type',
            width: `${self.widthId}`,
            formatter(val, prop, info) {
              return `${_.getBothSides(info.type)}-${info.result}`
            },
          },
          {
            label: '',
            name: '',
            width: '1%',
            formatter() {
              return '<span class="gray-line"></span>'
            },
          },
          {
            label: '',
            name: 'count',
            width: `${self.widthNum}`,
            formatter(val, prop, info) {
              return `${info.count}期`
            },
          },
        ],
        url: `${_.jsonpUrl()}/trends/trend/twoSideList.json`,
        type: 'get',
        dataType: 'jsonp',
        jsonp: 'callback',
        emptyTip: '最近无开奖记录',
        abort: false,
        // initRemote: false,
        showHeader: false,
        height: this.height,
        data: {
          pageSize: 20,
          ticketId: this.options.ticketId,
        },
        dataProp: 'root',
      }).staticGrid('instance')
    } else {
      this.bothRecords.update()
    }
  },
  bcHisNumHandler (e) {
    const $target = $(e.currentTarget)
    const num = $target.data('id')
    $target.toggleClass('checkedBox')
    // this.$('.js-his-num-list').removeClass('text-hot');
    this.$(`.js-his-num${num}`).toggleClass('text-hot font-bold')
  },
  recoveryHandler () {
    this.$hisNum.removeClass('checkedBox')
    this.$('.js-his-num-list').removeClass('text-hot font-bold')
  },
})

module.exports = BettingCenterHisAnalysisDetailView
