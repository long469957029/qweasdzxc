

require('./index.scss')
const grantConfig = require('../grantConfig.js')
const levelConfig = require('../levelConfig.js')
const dividendConfig = require('../dividendConfig')

const Countdown = require('com/countdown')

const MyDividView = Base.ItemView.extend({

  template: require('./index.html'),

  graphTpl: _.template(require('./index-graph-tpl.html')),

  events: {
    'click .js-ac-dm-md-type-btn': 'typeSelectHandler',
    'change .js-ac-dm-md-cycle': 'cycleChangeHandler',
    'click .js-ac-dm-md-status': 'getHandler',
    'click .js-ac-dm-my-config': 'checkAgreement',
  },

  checkAgreement() {
    Global.router.goTo('ac/sum/am?operationStatus=3&username=我')
  },
  serializeData() {
    return this.options
  },
  getMyDividDataXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/myDividInfo.json',
      data,
      abort: false,
    })
  },

  dividRoleXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/dividViewInfo.json',
      data,
    })
  },

  getAgreementXhr() {
    return Global.sync.ajax({
      url: '/fund/divid/reqinfo.json',
    })
  },

  onRender() {
    const self = this
    this.$type = this.$('.js-ac-dm-md-type-btn')
    this.$cycle = this.$('.js-ac-dm-md-cycle')
    this.$status = this.$('.js-ac-dm-md-status')
    this.$graph = this.$('.js-ac-dm-md-graph')
    this.$grid = this.$('.js-ac-dm-md-settle-grid')
    this.$reviseTip = this.$('.js-ac-dm-md-tip')
    this.$timeCountdown = this.$('.js-time-countdown')

    if(this.options.dividendStatus === dividendConfig.getByName('REVISE').id){
      this.getAgreementXhr().done((res) => {
        this.$reviseTip.removeClass('hidden')
        this.timeCountdown = new Countdown({
          el: this.$timeCountdown,
          color: 'red',
          size: 'sm',
          needBg: true,
        })
          .render(res.root.leftSeconds * 1000)
          .on('finish.countdown', () => {
            Global.ui.notification.show('您未在协议有效期内签署，当前协议已失效。', {
              event() {
                Global.m.oauth.check()
                Global.router.goTo('')
              },
            })
          })
      })
    }


    this.getMyDividDataXhr({ type: 0 }).done((res) => {
      if (res.result === 0) {
        self.ticketData = res.root
        self.dividRoleXhr().done((res1) => {
          if (res1.result === 0) {
            if (res1.root.myDividTicket) {
              self.$type.filter('[data-type=0]').removeClass('hidden')
            }
            if (res1.root.myDividGame) {
              self.$type.filter('[data-type=1]').removeClass('hidden')
            }
            // self.$type.filter('[data-type=0]').toggleClass('hidden',!res1.root.myDividTicket);
            // self.$type.filter('[data-type=1]').toggleClass('hidden',!res1.root.myDividGame);
            if (res1.root.myDividTicket) {
              self.getMyDividData(0)
            } else {
              // 没有权限时，隐藏页面
              self.getMyDividData(1)
            }
          }
        })
      }
    })
  },
  getMyDividData (type) {
    const self = this
    this.getMyDividDataXhr({ type: 1 }).done((res) => {
      if (res.result === 0) {
        self.gameData = res.root
      }
    })
      .always(() => {
        self.$type.eq(type).trigger('click')
      })
  },
  typeSelectHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.addClass('active').data('type')
    $target.siblings().removeClass('active')
    this.initPageByType(type, 0)
  },
  cycleChangeHandler() {
    const cycle = Number(this.$cycle.val())
    const type = this.$('.js-ac-dm-md-type-btn.active').data('type')
    this.initPageByType(type, cycle)
  },
  initPageByType(type, cycle) {
    const acctInfo = Global.memoryCache.get('acctInfo')
    const html = []
    let pageData = {}
    if (type === 0) {
      pageData = this.ticketData.dividList[cycle] || {}
      _(this.ticketData.dividList).each((item, index) => {
        html.push(`<option value="${index}"${index === cycle ? 'selected' : ''} >${item.cycle}</option>`)
      })
    } else if (type === 1) {
      pageData = this.gameData.dividList[cycle] || {}
      _(this.gameData.dividList).each((item, index) => {
        html.push(`<option value="${index}"${index === cycle ? 'selected' : ''} >${item.cycle}</option>`)
      })
    }
    const tplData = {
      userType: acctInfo.merchant ? 0 : 1,
      gameType: type,

      betTotal: _(pageData.betTotal || '').convert2yuan(),
      profitTotal: _(pageData.profitTotal || '').convert2yuan(),
      divid: _(pageData.divid || '0').formatDiv(100),
      dividTotal: _(pageData.dividTotal || '').convert2yuan(),
      activeUser: pageData.activeUser || '0',
      subDividTotal: _(pageData.subDividTotal || '').convert2yuan(),
      rebatTotal: _(pageData.rebatTotal || '').convert2yuan(),
      lastMonthNegativeProfitTotal: _(pageData.lastMonthNegativeProfitTotal || '').convert2yuan(),

      freezeTotal: _(pageData.freezeTotal || '').convert2yuan(),
      status: pageData.status || '',
    }


    // 渲染选项
    this.$cycle.html(html.join(''))
    this.$status.addClass((pageData.status === 0 && (acctInfo.merchant || acctInfo.userGroupLevel === 0)) ? 'active cursor-pointer' : '')
      .html((acctInfo.merchant || acctInfo.userGroupLevel === 0) ? _(levelConfig.getByName('TOP').status).getConfigById(pageData.status)
        : grantConfig.getZh(pageData.status) || '统计中').data('dividid', pageData.dividId)
    // 渲染图表
    this.$graph.toggleClass('ac-dm-dm-grid-5', !(!acctInfo.merchant && type === 0))
    this.$graph.html(this.graphTpl(tplData))
    // 渲染表格
    if (this.grid) {
      this.grid.destroy()
      // this.$grid.staticGrid('destroy');
    }
    this.grid = this.$grid.staticGrid({
      tableClass: 'table table-bordered table-center',
      //  wrapperClass: 'border-table-bottom',
      height: 208,
      colModel: [
        {
          label: '结算日期', name: 'day', merge: false, width: 230,
        },
        {
          label: '团队投注', name: 'betTotal', merge: false, width: 230,
        },
        { label: '团队盈亏', name: 'profitTotal', width: 230 },
      ],
      row: this.formatGridData(pageData.dividDetailList),
    }).staticGrid('instance')
    // var grid = this.$grid.grid('instance');

    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>' +
        '总计</strong>',
        _(pageData.betTotal || '').convert2yuan(),
        _(pageData.profitTotal || '').convert2yuan(),
      ],
    })
    this.grid.hideLoading()
  },
  formatGridData(list) {
    return _(list).map((item) => {
      return {
        day: item.day,
        betTotal: _(item.betTotal).convert2yuan(),
        profitTotal: _(item.profitTotal).convert2yuan(),
      }
    })
  },
  getHandler(e) {
    const $target = $(e.currentTarget)
    const type = this.$('.js-ac-dm-md-type-btn.active').data('type')
    if (!$target.hasClass('active')) {
      return false
    }
    const dividid = $target.data('dividid')
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')
    let url
    if (acctInfo.merchant) {
      url = '/fund/merchantBonus/get.json'
    } else if (acctInfo.userGroupLevel === 0) {
      url = '/fund/divid/get.json'
    }
    Global.sync.ajax({
      url,
      data: {
        dividId: dividid,
        type,
      },
    })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('申请成功，等待审核', {
            type: 'success',
          })
          self.render()
        } else {
          Global.ui.notification.show(`申请失败，${res.msg}`)
        }
      })
  },


})

module.exports = MyDividView
