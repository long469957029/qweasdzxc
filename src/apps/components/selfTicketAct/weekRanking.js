

const WeekRankingView = Base.ItemView.extend({
  template: require('./weekRanking.html'),
  events: {
  },
  serializeData () {
    return { data: this.options.data }
  },
  onRender() {
    const self = this
  },

})

module.exports = WeekRankingView
