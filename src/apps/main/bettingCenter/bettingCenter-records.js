const BettingRecordsView = Base.ItemView.extend({
  // common APIs
  update() {
    // const resizeHeight = $('.js-bc-main-area-right').height() - 394
    if (this.options.type === 'chase') {
      this.renderChaseHandler()
      this.$bettingRecords.addClass('hidden')
      this.$drawRecords.removeClass('hidden')
      // this.resizeRecords(this.$drawRecords, resizeHeight)
    } else {
      this.renderBettingRecords()
      this.$bettingRecords.removeClass('hidden')
      this.$drawRecords.addClass('hidden')
      // this.resizeRecords(this.$bettingRecords, resizeHeight)
    }
  },

  popupHandler(e) {
    if (!$(e.currentTarget).data('popover')) {
      $(e.currentTarget).popover({
        title: '详细号码',
        trigger: 'click',
        html: true,
        container: 'body',
        content: `<div class="js-pf-popover">${e.currentTarget.dataset.num}</div>`,
        placement: 'right',
      }).popover('show')
    }
  }
})

export default BettingRecordsView
