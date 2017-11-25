

require('./index.scss')
const grantConfig = require('../grantConfig')

const TicketView = require('agencyCenter/dividendManage/lowLevelGrant/ticket')
const GameView = require('agencyCenter/dividendManage/lowLevelGrant/game')

const LowLevelView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-ac-dm-lg-type-btn': 'lowLevelDividendTypeChangeHandler',
    'click .js-ac-dm-lg-search': 'getLowLevelDividendRecord',
  },

  giveOutXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/give.json',
      data,
    })
  },

  initialize() {
  },

  serializeData() {
    return {
      grants: grantConfig,
    }
  },

  onRender() {
    const self = this
    this.$('select[name=status]').append(_(grantConfig.getAll()).map((grant) => {
      return `<option value="${grant.id}">${grant.zhName}</option>`
    }).join(''))
    this.$type = this.$('.js-ac-dm-lg-type-btn')
    this.$cycle = this.$('select[name=cycle]')
    this.$grid = this.$('.js-ac-dm-lg-grid')
    $.when(self._parentView.DividRoleData).done((res1) => {
      if (res1.result == 0) {
        self.$type.filter('[data-type=0]').toggleClass('hidden', !res1.root.subDividTicket)
        self.$type.filter('[data-type=1]').toggleClass('hidden', !res1.root.subDividGame)
        if (res1.root.subDividTicket) {
          // self.$grid.html(new TicketView({type:0,cycle: 1}));
          self.$type.eq(0).toggleClass('hidden', false)
          self.$type.eq(0).trigger('click')
          if (!res1.root.subDividGame) {
            self.$type.eq(1).toggleClass('hidden', true)
          }
        } else if (res1.root.subDividGame) {
          self.$grid.html(new GameView({ type: 1, cycle: 1 }))
          self.$type.eq(0).toggleClass('hidden', true)
          self.$type.eq(1).toggleClass('hidden', false)
          self.$type.eq(1).trigger('click')
        } else {
          // 没有权限时，隐藏页面
        }
      }
    })
  },

  getLowLevelDividendRecord(e) {
    const type = this.$type.filter('.active').data('type')
    const cycle = this.$cycle.val()
    const month = this.$cycle.find('option:selected').data('month')
    const userName = this.$('input[name="username"]').val()
    const status = this.$('select[name="status"]').val()

    if (type == 0) {
      if (this.TicketGridView) {
        this.TicketGridView.destroy()
      }
      this.TicketGridView = new TicketView({
        type, halfMonth: cycle, month, userName, status,
      })
      this.$grid.html(this.TicketGridView.render().el)
    } else if (type == 1) {
      if (this.GameGridView) {
        this.GameGridView.destroy()
      }
      this.GameGridView = new GameView({
        type, halfMonth: cycle, month, userName, status,
      })
      this.$grid.html(this.GameGridView.render().el)
    }
  },

  lowLevelDividendTypeChangeHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    const type = $target.data('type')
    this.$('.js-ac-dm-lg-type').val(type)
    this.renderCycle(type)
    this.$('.js-ac-dm-lg-search').trigger('click')
  },
  renderCycle(type) {
    const now = moment()
    const lastMonth = moment().add('month', -1)
    const date = now.date()
    const month = now.month() + 1
    const preMonth = lastMonth.month() + 1
    const formatMonth = now.format('YYYY-MM')
    const lastFormatMonth = lastMonth.format('YYYY-MM')
    const cycle = []
    if (type == 0) {
      if (date > 15) {
        cycle.push(`<option value="1" data-month="${formatMonth}">${month}月下半月</option>`)
        cycle.push(`<option value="0" data-month="${formatMonth}">${month}月上半月</option>`)
      } else {
        cycle.push(`<option value="0" data-month="${formatMonth}">${month}月上半月</option>`)
        cycle.push(`<option value="1" data-month="${lastFormatMonth}">${preMonth}月下半月</option>`)
      }
      this.$cycle.html(cycle.join(''))
    } else {
      cycle.push(`<option value="1" data-month="${formatMonth}">${month}月</option>`)
      cycle.push(`<option value="0" data-month="${lastFormatMonth}">${preMonth}月</option>`)
      this.$cycle.html(cycle.join(''))
    }
  },


})

module.exports = LowLevelView

