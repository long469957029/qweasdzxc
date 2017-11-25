

const YesterdayBigGodsView = Base.ItemView.extend({
  template: require('./yesterdayBigGods.html'),
  events: {
    'click .js-info-worShip-btn': 'showCheatsHandler',
    'click .js-cheats-info-btn': 'goBetHandler',
  },
  serializeData () {
    const ticketPlayIdData = this.options.data.ticketPlayId.toString()
    const ticketId = ticketPlayIdData.slice(0, ticketPlayIdData.length - 6)
    const ticketRuleId = ticketPlayIdData.slice(0, ticketPlayIdData.length - 4)

    return {
      data: this.options.data,
      ticketId,
      ticketRuleId,
    }
  },
  onRender() {
    const self = this
    this.$worshipMain = this.$('.js-big-gods-worship-main')
    this.$cheatsMain = this.$('.js-big-gods-cheats-main')
  },
  showCheatsHandler () {
    this.$worshipMain.toggleClass('hidden')
    this.$cheatsMain.toggleClass('hidden')
  },
  goBetHandler () {
    const ticketPlayIdData = this.options.data.ticketPlayId.toString()
    const ticketId = ticketPlayIdData.slice(0, ticketPlayIdData.length - 6)
    const ticketRuleId = ticketPlayIdData.slice(0, ticketPlayIdData.length - 4)
    const data = {
      ticketRuleId,
      ticketPlayId: this.options.data.ticketPlayId,
      num: this.options.data.betNum,
    }
    Global.m.publish('bet:updating', data)

    // href="#bc/<%=ticketId%>?ruleId=<%=ticketRuleId%>&advance=<%=data.ticketPlayId%>&betNum=<%=data.betNum%>"
  },

})

module.exports = YesterdayBigGodsView
