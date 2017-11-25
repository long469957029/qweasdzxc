

const swfUrl = require('vendor/assets/ZeroClipboard.swf')
const ZeroClipboard = require('vendor/scripts/ZeroClipboard')

ZeroClipboard.config({ swfPath: swfUrl })

$.widget('gl.textCopy', {

  options: {
    textEl: null,
  },

  _create() {
    if (!this.options.textEl) {
      this.options.textEl = this.element
    }

    this.options.textEl = $(this.options.textEl)

    this._initCopy()
  },

  _initCopy() {
    const self = this
    const clip = new ZeroClipboard(this.element)
    if (!this.options.notShowToolTip) {
      const tooltipOption = {
        title: '复制到剪贴板',
      }
      if (this.options.toolTipDirection) {
        tooltipOption.placement = this.options.toolTipDirection
      }
      this.element.tooltip(tooltipOption)
    }

    clip.on('copy', (event) => {
      const clipboard = event.clipboardData
      let text = self.options.textEl.is('input') ? self.options.textEl.val() : self.options.textEl.text()
      if (self.options.text !== undefined) {
        text = self.options.text
      }
      clipboard.setData('text/plain', text)
      if (!self.options.notShowToolTip) {
        self.element.data('tooltip').options.title = '完成复制!'
        self.element.tooltip('show')
        self.element.on('hide.tooltip', () => {
          self.element.data('tooltip').options.title = '复制到剪贴板'
          self.element.off('hide.tooltip')
        })
      }
    })
  },
})

module.exports = $.gl.qrPreview
