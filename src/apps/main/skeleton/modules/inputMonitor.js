define((require, exports, module) => {
  const InputMonitorModule = Base.Module.extend({

    startWithParent: false,

    initialize() {
      const self = this
      $(document).on('keyup', '.js-gl-monitor', (e) => {
        const $target = $(e.currentTarget)
        const type = $target.data('monitor-type')

        switch (type) {
          case 'number':
            self.validateNumber(e, $target)
            break
        }
      })
      $(document).on('focus', '.js-gl-monitor', (e) => {
        const $target = $(e.currentTarget)
        $target.data('gl.monitor.val', $target.val())
      })

      $(document).on('blur', '.js-gl-monitor', (e) => {
        const $target = $(e.currentTarget)
        if ($target.data('gl.monitor.change')) {
          $target.trigger('change')
        }
      })
    },

    validateNumber(e, $target) {
      const range = $target.data('monitor-range')

      if (!range) {
        return true
      }

      const currentVal = $target.val()
      const min = range[0]
      const max = range[1]
      let test = true
      let val = currentVal


      if (!/^\d+$/.test(currentVal)) {
        val = Number(currentVal.replace(/[^\d+]/g, ''))
        test = false
      }

      if (val < min) {
        test = false
        val = min
      }
      if (val > max) {
        test = false
        val = max
      }

      $target.val(val)
      $target[0].dispatchEvent(new Event('input'))

      if ($target.data('gl.monitor.val') != $target.val()) {
        if (val < min || val > max || (val == min || val == max) && !test) {
          $target.data('gl.monitor.change', true)
        } else {
          $target.data('gl.monitor.change', false)
        }
      } else {
        $target.data('gl.monitor.change', false)
      }
    },

  })

  module.exports = InputMonitorModule
})
