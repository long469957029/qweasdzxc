

require('./style.scss')

const millionBreakthroughView = Base.ItemView.extend({
  template: require('./index.html'),
  events: {
    'click .js-millionBreakthrough-off': 'offHandel',
    'click .js-isNext': 'isNextHandel',
    'click .js-millionBreakthrough-reset': 'resetHandel',
    'click .js-millionBreakthrough-confirm': 'confirmHandel',
    'click .js-receive-million': 'receiveHandel',
  },
  level: null,
  onRender() {
    const self = this
    this.$receiveBtn = this.$('.js-receive-million')
    this.$bonus = this.$('.js-bonus')
    this.canClick = true
    this.getActivityInfoXhr().done((res) => {
      const ROOT = res.root
      if (res.result == 0) {
        if (ROOT.isChallenge) {
          self.confirm(ROOT.clickedIndex)

          if (Number(ROOT.baseChallengeAmount) <= _(ROOT.currentBetTotal).convert2yuan()) {
            // self.confirmReceiveHandel(ROOT.clickedIndex);
            self.confirmReceiveHandel(_(ROOT.bonusList).sortBy((item) => {
              return Number(item.challengePercentage)
            }), _(ROOT.currentBetTotal).convert2yuan())
          } else {
            self.$receiveBtn.addClass('disable')
          }
        } else {
          self.$receiveBtn.addClass('disable')
        }
        self.$('.js-challenge-money').html(`${ROOT.baseChallengeAmount}元`)
        if (ROOT.currentBetTotal != null) {
          var currentBetTotal = _(ROOT.currentBetTotal).convert2yuan()
        } else {
          var currentBetTotal = '0'
        }
        self.$('.js-over-money').html(`${currentBetTotal}元`)
        self.$('.js-end-time').html(_(ROOT.endDate).toDate('YYYY年MM月DD日'))
        self.formateData(_(ROOT.bonusList).sortBy((item) => {
          return Number(item.challengePercentage)
        }))
        self.level = ROOT.level
        $('.js-column').each((index, item) => {
          const height = parseInt($(item).css('height'))
          $(item).css('height', height + (ROOT.level * 10))
        })
      }
    })
  },
  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState ($target) {
    const acctInfo = Global.memoryCache.get('acctInfo')
    const self = this
    let isShow = false
    let $dialog = null
    this.getActivityInfoXhr().done((res) => {
      if (res.result === 0) {
        $target.removeClass('hidden')
        if (acctInfo.isFirstLoginToday) {
          $dialog = self.render().$el
          isShow = true
        }
      }
    })

    return { $dialog, dialogParent: '.js-millionBreakthrough', isShow }
  },
  getActivityInfoXhr (data) {
    return Global.sync.ajax({
      async: false,
      url: '/info/overMillion/info.json',
      data,
    })
  },
  joinActivityInfoXhr (data) {
    return Global.sync.ajax({
      url: '/info/overMillion/join.json',
      data,
    })
  },
  checkBonusXhr (data) {
    return Global.sync.ajax({
      url: '/info/overMillion/checkBonus.json',
      data,
    })
  },
  getBonusXhr (data) {
    return Global.sync.ajax({
      url: '/info/overMillion/getBonus.json',
    })
  },
  formateData (data) {
    const self = this
    _(data).map((item, index) => {
      self.$('.js-bonus').eq(index).html(`奖${item.bonusAmount}元`)
      self.$('.js-challengeAmount').eq(index).html(item.challengeAmount)
      self.$('.js-challengePercentage').eq(index).html(item.challengePercentage)
    })
  },
  offHandel () {
    const callbacks = $.Callbacks()
    this.$('.js-millionBreakthrough').addClass('millionBreakthrough-off-box')
    setTimeout(() => {
      $('.js-millionBreakthrough').parent().remove()
    }, 600)
  },

  /* 加码和重置 */
  resetNmn: false,
  isNext: true,
  isNextHandel () {
    this.$('.js-isNext-state').removeClass('js-isNext')
    this.level += 1
    const self = this
    this.getActivityInfoXhr({ level: this.level }).always(() => {
      $('.js-column').each((index, item) => {
        const height = parseInt($(item).css('height'))
        $(item).css('height', height + 10)
      })
    }).done((res) => {
      $('.js-isNext').removeClass('isNext')
      if (res.result == 0) {
        self.$('.js-isNext-state').addClass('js-isNext')
        if (self.isNext) {
          self.$('.js-challenge-money').html(`${res.root.baseChallengeAmount}元`)
          self.formateData(res.root.bonusList)
          self.resetNmn = true
          self.$('.millionBreakthrough-reset').addClass('js-millionBreakthrough-reset')
        } else {
          self.dialog(0, '加码已到上限！')
          self.level -= 1
          $('.js-column').each((index, item) => {
            const height = parseInt($(item).css('height'))
            $(item).css('height', height - 10)
          })
        }
        self.isNext = res.root.isNext
      }
    })
  },
  resetHandel () {
    const self = this
    self.$('.millionBreakthrough-reset').removeClass('js-millionBreakthrough-reset')
    this.getActivityInfoXhr({ level: 0 }).done((res) => {
      if (res.result == 0) {
        self.$('.js-challenge-money').html(`${res.root.baseChallengeAmount}元`)
        self.formateData(res.root.bonusList)
        if (self.resetNmn) {
          $('.js-column').each((index, item) => {
            const height = parseInt($(item).css('height'))
            switch (index) {
              case 0: $(item).css('height', 66); break
              case 1: $(item).css('height', 86); break
              case 2: $(item).css('height', 106); break
              case 3: $(item).css('height', 126); break
              case 4: $(item).css('height', 146); break
            }
          })
          self.resetNmn = false
          self.level = 0
        }
        self.isNext = res.root.isNext
      }
    })
  },
  confirmReceiveHandel (bonusList, currentBet) {
    const self = this
    // this.$('.js-receive').each(function (index, item) {
    //   if (openBtn==index) {
    //       // self.$(item).addClass('disable').removeClass('js-receive');
    //   }else{
    //       self.$(item).addClass('disable').removeClass('js-receive');
    //   }
    // });
    $.each(bonusList, (index, item) => {
      if (item.status === 2) {
        self.$bonus.eq(index).addClass('text-hot font-bold').parent().siblings()
          .children('.js-bonus')
          .removeClass('text-hot font-bold')
        return false
      }
      item.status === 1 && Number(item.challengeAmount) <= currentBet ? self.$bonus.eq(index).addClass('text-hot font-bold').parent().siblings()
        .children('.js-bonus')
        .removeClass('text-hot font-bold') : ''
      
      // item.status === 2 ? self.$bonus.eq(index).addClass('text-hot font-bold').parent().siblings().children('.js-bonus').removeClass('text-hot font-bold')
      //  : (item.status === 1 && Number(item.challengeAmount) <= currentBet ? self.$bonus.eq(index).addClass('text-hot font-bold').parent().siblings().children('.js-bonus').removeClass('text-hot font-bold') : '');
      // item.status === 1 ? (Number(item.challengeAmount) <= currentBet ? '' : self.$receiveBtn.eq(index).addClass('disable')) : (item.status === 0 ? self.$receiveBtn.eq(index).addClass('disable') : self.$receiveBtn.eq(index).addClass('disable').html('已领取'));
    })
    !_.isUndefined(_(bonusList).findWhere({ status: 2 })) ? self.$receiveBtn.addClass('disable').html('已领取') : (!_.isUndefined(_(bonusList).findWhere({ status: 1 })) ? self.$receiveBtn.removeClass('disable') : self.$receiveBtn.addClass('disable'))
  },
  confirm (openBtn) {
    const self = this
    this.$('.js-isNext').addClass('disable').removeClass('js-isNext')
    this.$('.js-millionBreakthrough-reset-state').addClass('disable').removeClass('js-millionBreakthrough-reset')
    this.$('.js-millionBreakthrough-confirm').addClass('disable').removeClass('js-millionBreakthrough-confirm')

    // this.$('.js-receive').each(function (index, item) {
    //   if (openBtn==index) {
    //     // self.$(item).addClass('disable').removeClass('js-receive');
    //   }else{
    //     self.$(item).addClass('disable').removeClass('js-receive');
    //   }
    // });
  },
  confirmHandel () {
    const self = this
    this.joinActivityInfoXhr({ level: this.level }).done((res) => {
      if (res.result == 0) {
        self.confirm()
        self.render()
        self.dialog(0, '挑战值设定成功，加油努力吧！完成挑战后记得领取奖励哟。')
      } else {
        self.dialog(0, ' 参加挑战失败！')
      }
    })
  },

  /* 领取 */
  receiveHandel (e) {
    const self = this
    const $target = $(e.currentTarget)
    if (this.canClick) {
      if (!$target.hasClass('disable')) {
        this.canClick = false
        this.receiveSuccess()
        // var num = $target.attr('num');
        // this.receiveSuccess(num);
        // this.checkBonusXhr({index:num}).done(function (res) {
        //   if (res.result==0) {
        //     $('.js-millionBreakthrough').hide();
        //     if(res.root.next){
        //       self.dialog(1,'您还差'+res.root.nextDiffBonus+'元即可领取下一阶段奖励，再努力一下吧！',num);
        //     }else{
        //       self.receiveSuccess(num);

        //     }
        //   }else{
        //     self.dialog(0,res.msg)
        //   }
        // });
      }
    }
  },

  /* 弹窗
   * btnType:按钮类型
   * msg：内容
   * num：第几个按钮
   */
  dialog (btnType, msg, num) {
    this.$('.js-millionBreakthrough').hide()
    const self = this
    let btn = ''
    switch (btnType) {
      case 0: btn = '<button  data-dismiss="modal">返回</button></div>'; break
      case 1: btn = '<button class="js-pop-receive">不了，领取奖励</button><button data-dismiss="modal">再拼一下</button>'; break
    }
    const $dialog = Global.ui.dialog.show({
      size: 'modal-lg',
      modalClass: 'millionBreakthrough-pop-modal',
      bodyClass: 'millionBreakthrough-pop-body',
      body: `<div class="millionBreakthrough-pop"><p>${msg}</p>${btn}</div>`,
    })
    $dialog.on('hidden.modal', function() {
      $(this).remove()
      $('.js-millionBreakthrough').show()
      $('.modal-backdrop').remove()
    })

    $dialog.on('click', '.js-pop-receive', (e) => {
      const $target = $(e.currentTarget)
      $dialog.remove()
      self.receiveSuccess(num)
    })
  },
  receiveSuccess(num) {
    const self = this
    this.getBonusXhr().done((res) => { // 原来的参数{index:num}
      if (res.result == 0) {
        self.$receiveBtn.addClass('disable').html('已领取')
        const $_dialog = Global.ui.dialog.show({
          size: 'modal-lg',
          modalClass: 'millionBreakthrough-pop-modal',
          bodyClass: 'millionBreakthrough-pop-body',
          body: '<div class="millionBreakthrough-pop"><p>恭喜，领取成功！</p>' +
            '<button  data-dismiss="modal">返回</button></div>',
        })
        $_dialog.on('hidden.modal', function() {
          // $('.js-receive').each(function (index, item) {
          //   self.$(item).addClass('disable').removeClass('js-receive');
          // });
          // self.render();
          $(this).remove()
          $('.modal-backdrop').remove()
          $('.js-millionBreakthrough').show()
        })
      } else {
        self.dialog(0, res.msg)
        self.canClick = false
      }
    })
  },
})

module.exports = millionBreakthroughView
