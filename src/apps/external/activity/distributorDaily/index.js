

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
      url: '/info/agentsalesactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  getRewardXhr(data) {
    return Global.sync.ajax({
      url: '/info/agentsalesactivity/doget.json',
      data,
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

          // _(data.prizedList).each(function(info) {
          //   var find = _(self.prizedList).findWhere({
          //     username: info.username,
          //     bonus: info.bonus
          //   });
          //   if (!find) {
          //     self.prizedList.push(info);
          //     list.push(info);
          //   }
          // });

          // self.$('.js-prized-list').append(_(list).map(function(info) {
          //   return '<li>--<span>' + info.username + '</span>获得日量奖励' + _(info.bonus).convert2yuan() + '元</span></li>';
          // }));

          self.$('.js-grid').html(_(data.itemList).chain().sortBy((info) => {
            return info.sales
          }).map((info) => {
            let html = '<tr class="tr-gry">'
            html += `<td class="td_menu">${_(info.sales).convert2yuan()}元/天</td>`
            html += _(info.days).map((item, index) => {
              return self.itemTpl({
                money: item.bonus,
                status: item.status,
                sales: info.sales,
                cycle: (index + 1) * 7,
              })
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
    // var $ul = $(".prompt_content ul");
    //
    // function rolling() {
    //   $ul.animate({
    //     "left": "-205px"
    //   }, 1000, function () {
    //     $ul.css("left", "0px");
    //     $ul.find("li:eq(0)").appendTo($ul);
    //   });
    // }
    //
    // $ul.each(function (index) {
    //   setInterval(rolling, 4000);
    // });

    // mask
    this.$mask = $('.mask')
    this.$pop_lump = $('.pop_lump')
    this.$pop_btn = $('.pop_btn')

    this.$pop_btn.click(() => {
      self.$mask.hide()
      self.$pop_lump.hide()
    })
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
      cycle: $target.data('cycle'),
    })
      .done((res) => {
        if (res && res.result === 0) {
          self.$mask.show()
          self.$pop_lump.show()
          self.updateInfo()
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '领取失败' : res.msg)
        }
      })
  },
})

module.exports = DailyView
