

const TrackDetailView = require('fundCenter/gameRecord/chaseDetail')

const LowLevelTrackDetailView = TrackDetailView.extend({

  initialize() {
    TrackDetailView.prototype.initialize.apply(this, arguments)

    this.options.detailPrevUrl = `#ac/betting/${this.options.userId}/detail/`
  },

  onRender() {
    TrackDetailView.prototype.onRender.apply(this, arguments)

    this.$('.js-td-title').html(`查看${_.getUrlParam('name')}的追号详情`)
  },
})

module.exports = LowLevelTrackDetailView
