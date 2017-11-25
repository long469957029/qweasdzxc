

const DailyView = Base.ItemView.extend({

  template: require('./index.html'),

  itemTpl: _(require('./item.html')).template(),

  prizedList: [],

  events: {
    'click .js-get-reward': 'rewardHandler',
  },

  initialize() {
    const self = this
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
      self._onRender()
    })
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/salesactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  getRewardXhr(data) {
    return Global.sync.ajax({
      url: '/info/salesactivity/doget.json',
      data: _(data).extend({
        activityId: this.options.activityId,
      }),
    })
  },

  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root

          if (!data.available) {
            Global.ui.notification.show('您没有参与该活动的资格！', {
              event () {
                window.location.href = 'index.html'
              },
            })
            return false
          }

          self.$('.js-from-date').text(_(data.fromDate).toDate('MM月DD日'))
          self.$('.js-end-date').text(_(data.endDate).toDate('MM月DD日'))

          const list = []

          _(data.prizedList).each((info) => {
            const find = _(self.prizedList).findWhere({
              username: info.username,
              bonus: info.bonus,
            })
            if (!find) {
              self.prizedList.push(info)
              list.push(info)
            }
          })

          self.$('.js-prized-list').append(_(list).map((info) => {
            return `<li>--<span>${info.username}</span>获得日量奖励${_(info.bonus).convert2yuan()}元</span></li>`
          }))

          self.$('.js-grid').html(_(data.itemList).chain().sortBy((info) => {
            return info.sales
          }).map((info) => {
            let html = '<tr>'
            html += `<td class="td_menu">${info.sales}元/天</td>`
            html += self.itemTpl({
              money: info.day3,
              status: info.day3Status,
              sales: info.sales,
              cycle: 3,
            })
            html += self.itemTpl({
              money: info.day6,
              status: info.day6Status,
              sales: info.sales,
              cycle: 6,
            })
            html += self.itemTpl({
              money: info.day10,
              status: info.day10Status,
              sales: info.sales,
              cycle: 10,
            })
            html += self.itemTpl({
              money: info.day15,
              status: info.day15Status,
              sales: info.sales,
              cycle: 15,
            })
            html += self.itemTpl({
              money: info.day30,
              status: info.day30Status,
              sales: info.sales,
              cycle: 30,
            })

            html += '</tr>'

            return html
          })
            .value()
            .join(''))
        }
      })
  },

  _onRender() {
    const self = this

    this.updateInfo()
    // setInterval(function() {
    //  self.updateInfo();
    // }, 30000);

    // 获奖名单滚动
    const $ul = $('.prompt_content ul')

    function rolling() {
      $ul.animate({
        left: '-205px',
      }, 1000, () => {
        $ul.css('left', '0px')
        $ul.find('li:eq(0)').appendTo($ul)
      })
    }

    $ul.each((index) => {
      setInterval(rolling, 4000)
    })

    // mask
    this.$mask = $('.mask')
    this.$pop_lump = $('.pop_lump')
    this.$pop_btn = $('.pop_btn')

    this.$pop_btn.click(() => {
      self.$mask.hide()
      self.$pop_lump.hide()
    })

    // animate
    const $icon_01 = $('.icon_01')
    const $icon_02 = $('.icon_02')
    const $icon_03 = $('.icon_03')
    const $icon_04 = $('.icon_04')
    const $icon_05 = $('.icon_05')
    const $icon_06 = $('.icon_06')
    const $icon_07 = $('.icon_07')
    const $icon_08 = $('.icon_08')
    const $icon_09 = $('.icon_09')

    $icon_01.animate({
      top: '28px',
      left: '-92px',
      opacity: '1',
    }, 500)
    $icon_02.animate({
      top: '-30px',
      left: '825px',
      opacity: '1',
    }, 500)
    $icon_03.animate({
      top: '550px',
      left: '-200px',
      opacity: '1',
    }, 500)
    $icon_04.animate({
      top: '470px',
      left: '900px',
      opacity: '1',
    }, 500)
    $icon_05.animate({
      top: '120px',
      left: '-130px',
      opacity: '1',
    }, 500)
    $icon_06.animate({
      top: '280px',
      left: '-250px',
      opacity: '1',
    }, 500)
    $icon_07.animate({
      top: '480px',
      left: '-130px',
      opacity: '1',
    }, 500)
    $icon_08.animate({
      top: '100px',
      left: '870px',
      opacity: '1',
    }, 500)
    $icon_09.animate({
      top: '350px',
      left: '840px',
      opacity: '1',
    }, 500)
  },

  rewardHandler(e) {
    const self = this
    const $target = $(e.currentTarget)

    const window_width = $(window).innerWidth()
    const window_height = $(window).innerHeight()

    this.$pop_lump.css({
      left: `${window_width / 2 - this.$pop_lump.width() / 2}px`,
      top: `${window_height / 2 - this.$pop_lump.height() / 2}px`,
    })

    this.getRewardXhr({
      sales: $target.data('sales'),
      cycle: $target.data('cycle'),
    })
      .done((res) => {
        if (res && res.result === 0) {
          self.$mask.show()
          self.$pop_lump.show()
          self.updateInfo()
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },
})

module.exports = DailyView
