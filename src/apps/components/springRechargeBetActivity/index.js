

require('./js/cjct/effect.js')
require('./css/cjct/main.scss')

const springRechargeBetView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-check-agent': 'getPrizeHandler',
    'click .js-close': 'closeActivityHandler',
    'click .js-qe-spring-rb-li': 'previewTicketBonusHandler',
    'click .js-qe-spring-recharge-bet-get': 'getSpringRedBagHandler',
    'click .js-qe-spring-recharge-bet-rebate-get': 'getRebateHandler',
    'click .js-qe-return-btn': 'closeCurrentDialogHandler',
    'click .js-qe-spring-rb-goon': 'goOnBetHandler',
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/moneyrebate/info.json',
      data: {
        activityId: 30,
        source: 1,
      },
      async: false,
    })
  },
  doQueryXhr(days) {
    return Global.sync.ajax({
      url: '/info/moneyrebate/query.json',
      data: {
        activityId: 30,
        cycle: days,
      },
    })
  },
  doPreviewXhr(data) {
    return Global.sync.ajax({
      url: '/info/moneyrebate/preview.json',
      data,
    })
  },

  doGetXhr(data) {
    return Global.sync.ajax({
      url: '/info/moneyrebate/doget.json',
      data,
    })
  },

  initialize() {

  },

  onRender() {
    const self = this
    // this.$popContain = this.$(".js-acc-siginin");
    this.initPage()
    this.updateInfo()
    //    setInterval(function() {
    //      self.updateInfo();
    //    }, 30000);
  },

  initPage() {
    const self = this
    $(() => {
      const $mask = self.$('.mask')
      const $con = self.$('.con')
      const $pop_lump = self.$('.pop_status_01')
      const $pop_lump2 = self.$('.pop_status_02')
      const window_width = $(window).innerWidth()
      const window_height = $(window).innerHeight()
      const $close_btn = self.$('.close_btn,.pop_close_btn,.btn')
      const $animal = self.$('.game_lump li>img')
      const $btn = self.$('.game_lump li>div')
      const $btn_get = self.$('.btn_get')
      console.log('1', window_width)
      console.log('2', window_width / 2 - 928 / 2)
      $con.css({
        left: `${0}px`, // window_width / 2 - 928 / 2
        top: `${window_height / 2 - 603 / 2}px`,
      })
      $pop_lump.css({
        left: `${window_width / 2 - 627 / 2}px`,
        top: `${window_height / 2 - 510 / 2}px`,
      })
      $pop_lump2.css({
        left: `${window_width / 2 - 627 / 2}px`,
        top: `${window_height / 2 - 510 / 2}px`,
      })

      $btn.hover(function() {
        const num = $btn.index($(this))
        if ($animal.eq(num).is(':animated')) {
          $animal.eq(num).stop()
        }
        if (num == 3) {
          $animal.eq(num).animate({
            opacity: '1',
            top: '-135px',
          })
        } else {
          $animal.eq(num).animate({
            opacity: '1',
            top: '-60px',
          })
        }
      }, function() {
        const num = $btn.index($(this))
        if ($animal.eq(num).is(':animated')) {
          $animal.eq(num).stop()
        }
        if (num == 3) {
          $animal.eq(num).animate({
            opacity: '0',
            top: '-50px',
          })
        } else {
          $animal.eq(num).animate({
            opacity: '0',
            top: '60px',
          })
        }
      })


      $close_btn.click(() => {
        $mask.hide()
        self.destroy()
      })

      // $btn_get.click(function(){
      //   $(this).parent().hide();
      //   $pop_lump2.show();
      // });
    })

    const $sunshine = this.$('.sunshine')
    const rotate_num = 0
  },

  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.$('.js-qe-springRechargeBet-amount').html(_(data.limit).formatDiv(10000))

          _(data.itemList).each((item, index) => {
            const $span = self.$(`.js-qe-spring-rb-ticket[data-id=${item.ticketId}]`)
            $span.html(`返水${_(item.amount).formatDiv(100)}%`)
          })
        }
      })
  },

  previewTicketBonusHandler(e) {
    const $ticket = $(e.currentTarget).find('.js-qe-spring-rb-ticket')
    const ticketId = $ticket.data('id')
    const self = this
    let msg = ''
    this.doPreviewXhr({ resultType: ticketId }).done((res) => {
      if (res.result == 0) {
        if (res.root.bonus > 0) {
          msg = `您已在${res.root.ticketName}下投注${_(res.root.amount).convert2yuan()}元，可领取奖励${_(res.root.bonus).convert2yuan()}元！`
          self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog2-msg').html(msg)
          self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
          self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog2').toggleClass('hidden', false)
          self.$('.js-qe-spring-recharge-bet-rebate-get').data('id', ticketId)
        } else if (res.root.amount > 0 && res.root.bonus == 0) {
          self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1-msg').html('您今天已经领过此活动奖励了！')
          self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
          self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1').toggleClass('hidden', false)
        }
      } else {
        msg = res.msg
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1-msg').html(msg)
        self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1').toggleClass('hidden', false)
      }
    })
  },

  getRebateHandler(e) {
    const self = this
    const ticketId = this.$('.js-qe-spring-recharge-bet-rebate-get').data('id')
    self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog2').toggleClass('hidden', true)
    self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', true)
    // todo
    this.doGetXhr({ resultType: ticketId }).done((res) => {
      if (res.result == 0) {
        var html = '恭喜您，领取成功！<br><br>明天再接再厉哦！'
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1-msg').html(html)
        self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1').toggleClass('hidden', false)
      } else {
        var html = res.msg
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1-msg').html(html == 'fail' ? '领取失败！' : html)
        self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog1').toggleClass('hidden', false)
      }
    })
  },

  getSpringRedBagHandler() {
    const self = this
    this.doGetXhr({ resultType: 0 }).done((res) => {
      if (res.result == 0) {
        if (res.root.length > 0) {
          if (res.root[0].result && res.root[0].result !== '0') {
            self.$('.js-qe-spring-recharge-bet-bonus').html(`${_(res.root[0].result).convert2yuan()}元!`)
            self.$('.js-qe-spring-recharge-bet-msg').html('红包一拆开，好运自然来<br/>')
            self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
            self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog3').removeClass('hidden')
          }
        } else {
          var msg = '红包一拆开，好运自然来</br></br>这个红包塞满了满满的祝福：恭祝您鸡年大发！'
          self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog4-msg').html(msg)
          self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog4').removeClass('hidden')
          self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
          // self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog3').removeClass('hidden');
        }
      } else {
        var msg = res.msg
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog4-msg').html(msg)
        self.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', false)
        self.$('.js-qe-spring-recharge-bet-ticketRebate-dialog4').removeClass('hidden')
      }
    })
  },

  closeActivityHandler() {
    this.destroy()
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState ($target) {
    const self = this
    let isShow = false
    this.getInfoXhr().done((res) => {
      console.info(res)
      if (res.result === 0) {
        const data = self.data = res.root
        // 比较时间
        const dat = new Date().getTime()

        if (dat >= data.fromDate && dat < data.endDate) {
          $target.css('display', 'block')
          if (res.root.status == 0) {
            // $('body').append(self.render().$el)
            isShow = true
          }
        } else {
          $target.css('display', 'none')
        }
      } else {
        $target.css('display', 'none')
      }
    })
    return { $dialog: self.render().$el, dialogParent: '.js-qe-spring-recharge-bet', isShow }
  },
  closeCurrentDialogHandler(e) {
    this.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', true)
    this.$('.js-qe-spring-recharge-bet-ticketRebate-dialog3').toggleClass('hidden', true)
    this.$('.js-qe-spring-recharge-bet-ticketRebate-dialog4').toggleClass('hidden', true)
  },
  goOnBetHandler(e) {
    const ticketId = this.$('.js-qe-spring-recharge-bet-rebate-get').data('id')
    Global.appRouter.navigate(_(`#bc/${ticketId}`).addHrefArgs('_t', _.now()), { trigger: true, replace: false })
    this.destroy()
  },


})

module.exports = springRechargeBetView
