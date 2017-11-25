

const Roll = require('../roll')

const statusConfig = [
  {
    id: -1,
    className: 'sure_btn_text_disable',
    title: '未达标',
  },
  {
    id: 0,
    className: '',
    title: '领取礼金',
  },
  {
    id: 1,
    className: 'sure_btn_text_disable',
    title: '已使用',
  },
  {
    id: 2,
    className: 'sure_btn_text_disable',
    title: '已失效',
  },
]

const CardView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-get-pack': 'getPackHandler',
    'click .js-use-card': 'useCardHandler',
    'click .js-close': 'closeHandler',
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/packactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  getPackXhr() {
    return Global.sync.ajax({
      url: '/info/packactivity/dopack.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  useCardXhr(data) {
    return Global.sync.ajax({
      url: '/info/packactivity/douse.json',
      data: _({
        activityId: this.options.activityId,
      }).extend(data),
    })
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  onRender() {
    const self = this
    this.updateInfo()
    setInterval(() => {
      self.updateInfo()
    }, 30000)

    this.roll = new Roll({
      el: '.js-roll',
    }).render()

    this.width = $(window).innerWidth() / 2
    this.height = $(window).innerHeight() / 2

    this.$bg = this.$('.bg_black')
    this.$go = this.$('.sure_go')
    this.$cardContainer = this.$('.card_contain_01,.card_contain_02')
    this.$cards = this.$('.js-use-card')
    this.$fullscreen = this.$('.status_fullscreen')
  },

  updateInfo() {
    const self = this

    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.$('.js-from-date').text(_(data.fromDate).toDate('YYYY年MM月DD日'))
          self.$('.js-end-date').text(_(data.endDate).toDate('YYYY年MM月DD日'))
          self.roll.roll(data.dataList)

          if (!_.isEmpty(data.packData)) {
            self.showCards(data.packData)
          }
        } else {
          Global.ui.notification.show(res.msg || '')
        }
      })
  },

  showCards(packData) {
    this.$go.hide()
    this.$bg.show()
    this.$cardContainer.show()
    this.$cards.each((index, card) => {
      const $card = $(card)
      const info = _(packData).findWhere({
        resultType: $card.data('type'),
      })
      if (info) {
        const statusInfo = _(statusConfig).findWhere({
          id: info.status,
        })

        $card.addClass(statusInfo.className)
          .find('.sure_btn_text').text(statusInfo.title).removeClass('sure_btn_text_disable')
          .addClass(statusInfo.className)
      }
    })
  },

  getPackHandler() {
    const self = this

    if (this.data.status === 0) {
      Global.ui.notification.show('活动未开始')
      return false
    } else if (this.data.status === 2) {
      Global.ui.notification.show('活动已结束')
      return false
    }

    this.getPackXhr()
      .done((res) => {
        if (res && res.result === 0) {
          self.showCards()
          self.updateInfo()
        } else {
          Global.ui.notification.show(res.msg || '')
        }
      })
  },

  useCardHandler(e) {
    const self = this
    const $target = $(e.currentTarget)

    if ($target.find('.sure_btn_text_disable').length) {
      return false
    }

    this.useCardXhr({
      resultType: $target.data('type'),
    })
      .done((res) => {
        self.$fullscreen.show()

        if (res && res.result === 0) {
          self.showCardTable($target.data('type'), res.root)
          self.updateInfo()
        } else {
          const $status_false = self.$('.status_false')

          $status_false.css({
            top: self.height - $status_false.height() / 2,
            left: self.width - $status_false.width() / 2,
          })

          $status_false.find('.hate_text').text(res.msg || '')
          $status_false.show()
        }
      })
  },

  showCardTable(type, data) {
    const $card = this.$(`.card_0${type}`)

    $card.find('.status_table tbody').html(_(data).map((info) => {
      const html = []

      html.push('<tr>')
      html.push(`<td>${_(info.time).toDate()}</td>`)
      html.push(`<td>${_(info.consumeAmount).convert2yuan()}</td>`)
      html.push(`<td>${_(info.result).convert2yuan()}</td>`)
      html.push('</tr>')

      return html.join('')
    }).join(''))
    $card.css({
      top: this.height - $card.eq(0).height() / 2,
      left: this.width - $card.eq(0).width() / 2,
    })

    $card.show()
  },

  closeHandler(e) {
    $(e.currentTarget).parent().hide()
    this.$fullscreen.hide()
  },
})

module.exports = CardView
