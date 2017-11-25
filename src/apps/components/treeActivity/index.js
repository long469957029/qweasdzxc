

require('./index.scss')

// var $fullscreen = $(".full_screen");

// 显示结果函数
/*
 这里的gift_num数字从1到9正好对应9个奖项

 从1到9！！！！不要乱丢数字
 */

const gift_num = 9

const TreeActivity = Base.ItemView.extend({
  template: '<div class="modal-backdrop fade in"></div><div class="js-tree tree"></div>',

  className: 'hidden',

  itemTpl: _(require('./index.html')).template(),

  events: {
    'click .tree_btn_03': 'closeActivityHandler',
    'click .btn_01': 'continueShakeHandler',
    // 'click .btn_02': 'confirmCloseHandler',
    'click .close_icon, .btn_03, .btn_04': 'goBackHandler',
    // 'click .btn_04': 'redeemHandler',
    'click .tree_btn_01': 'beginShakeHandler',
    'click .tree_btn_02': 'closeHandler',
  },


  onRender() {
    const self = this
    this.$tree = this.$('.js-tree')
    this.$tree.append(self.itemTpl({}))
    this.$treeLump = this.$('.tree_lump')
    this.$popContain = this.$('.pop_lump')
    this.$tree01 = this.$('.tree_01')
    this.$tree02 = this.$('.tree_02')

    const popContainWidth = 597
    const popContainHeight = 441
    const treeLumpWidth = 290
    const treeLumpHeight = 304

    this.$popContain.css({
      left: `${document.body.clientWidth / 2 - popContainWidth / 2}px`,
      top: `${(document.body.clientHeight / 2 - popContainHeight / 2) > 0 ? (document.body.clientHeight / 2 - popContainHeight / 2) : 0}px`,
    })

    this.$treeLump.css({
      left: `${$(window).width() / 2 - treeLumpWidth / 2}px`,
      top: `${($(window).height() / 2 - treeLumpHeight / 2) > 0 ? ($(window).height() / 2 - treeLumpHeight / 2) : 0}px`,
    })

    this._checkTimes().done(() => {
      self.showTree()
    })

    Global.ui.notification.setPrevent(true)
  },

  showResult(giftCase, giftType) {
    this.$popContain.css('z-index', 10000)
    this.$tree.find('.tree_btn_02').removeClass('hidden')
    this.$tree.find('.tree_btn_01').removeClass('hidden')
    if (giftCase) {
      switch (giftType) {
        case 0:
          this.$tree01.css('display', 'none')
          this.$popContain.css('display', 'block')
          this.$popContain.find('li').css('display', 'none')
          $('.pop_03').css('display', 'block').find('.pop_02_text').text(`树上掉下一个金钱袋，里面蹦出${_(giftCase).convert2yuan()}个硬币！\n 恭喜您得到${_(giftCase).convert2yuan()}元钱！`)
          break
        case 1:
          this.$tree01.css('display', 'none')
          this.$popContain.css('display', 'block')
          this.$popContain.find('li').css('display', 'none')
          $('.pop_06').css('display', 'block')
          break
        case 2:
          this.$tree01.css('display', 'none')
          this.$popContain.css('display', 'block')
          this.$popContain.find('li').css('display', 'none')
          $('.pop_05').css('display', 'block')
          break
        case 3:
          this.$tree01.css('display', 'none')
          this.$popContain.css('display', 'block')
          this.$popContain.find('li').css('display', 'none')
          $('.pop_04').css('display', 'block')
          break
      }
    } else {
      this.$tree01.css('display', 'none')
      this.$popContain.css('display', 'block')
      this.$popContain.find('li').css('display', 'none')
      $('.pop_02').css('display', 'block')
    }
  },

  giftAnimate() {
    const $gift01 = this.$('.tree_lump .gift_01')
    const $gift02 = this.$('.tree_lump .gift_02')
    const $gift03 = this.$('.tree_lump .gift_03')
    const $gift04 = this.$('.tree_lump .gift_04')
    $gift01.animate({
      top: '+=120px',
      opacity: '1',
    }, 600, function() {
      $(this).css({
        top: '-=120px',
        opacity: '0',
      })
    })
    $gift02.delay(200).animate({
      top: '+=120px',
      opacity: '1',
    }, 600, function() {
      $(this).css({
        top: '-=120px',
        opacity: '0',
      })
    })
    $gift03.delay(600).animate({
      top: '+=120px',
      opacity: '1',
    }, 600, function() {
      $(this).css({
        top: '-=120px',
        opacity: '0',
      })
    })
    $gift04.delay(800).animate({
      top: '+=120px',
      opacity: '1',
    }, 600, function() {
      $(this).css({
        top: '-=120px',
        opacity: '0',
      })
    })
  },

  treeShake() {
    const self = this
    let data
    let giftCase
    let giftType

    $('body').addClass('overflow-hidden')

    this.giftAnimate()
    this.startShaking()

    this.getResultXhr()
      .done((res) => {
        if (res && res.result === 0) {
          data = res.root && res.root[0] || {}
          giftCase = parseInt(data.result) ? data.result : 0
          giftType = data.resultType || 0

          setTimeout(() => {
            self.stopShaking()
            self.showResult(giftCase, giftType)
          }, 3000)
        } else {
          giftCase = 0
          giftType = 0

          self.stopShaking()
          self.$tree.find('.tree_btn_01').removeClass('hidden')
          self.$tree.find('.tree_btn_02').removeClass('hidden')
          self.$tree.find('.tree_text').text(self.prevText)

          Global.ui.notification.show(res.msg, {
            id: 'tree',
            force: true,
          })
        }
      }).fail(() => {
        giftCase = 0
        giftType = 0
        self.stopShaking()
      }).always(() => {
        self._checkTimes()
      })
  },

  startShaking() {
    const self = this
    this.num = 0
    this.times = 0
    this.giftTimer = setInterval(self.giftAnimate.bind(this), 2000)

    this.fullGiftTimer = setInterval(() => {
      const $drop = $(`<div class="gift_0${_.random(1, 4)} full-screen"></div>`)
      self.$tree.append($drop)

      setTimeout(() => {
        const left = _.random(4, 96)
        $drop.css({
          left: `${left}%`,
          top: '120%',
        })
      }, 10)

      setTimeout(() => {
        $drop.remove()
      }, 4010)
    }, 150)

    this.shakeTimer = setInterval(() => {
      if (self.num > 2) {
        self.num = 0
        $('.tree_01').find('li').css('display', 'none').eq(self.num)
          .css('display', 'block')

        self.num++
      } else {
        $('.tree_01').find('li').css('display', 'none').eq(self.num)
          .css('display', 'block')
        self.num++
      }
    }, 200)
  },

  stopShaking() {
    clearInterval(this.shakeTimer)
    clearInterval(this.giftTimer)
    clearInterval(this.fullGiftTimer)

    setInterval(() => {
      $('body').removeClass('overflow-hidden')
    }, 4000)
    this.$('.tree_01').find('li').css('display', 'none')
    this.$('.tree_01').find('li').eq(1).css('display', 'block')
  },


  // event handlers
  closeActivityHandler() {
    this.$popContain.css('z-index', 0)
    this.$popContain.find('li').css('display', 'none')
    this.$tree.css('display', 'none')
    this.destroy()
    // console.log($(this).attr("keep"));
    // if($(this).attr("keep") == "keep"){
    //  this.$tree01.css("display","block");
    // }else{
    //  this.$tree02.css("display","block");
    // }
  },

  continueShakeHandler() {
    this.$popContain.find('li').css('display', 'none')
    this.$tree01.css('display', 'block')
  },

  goBackHandler() {
    this.$popContain.css('display', 'none')
    this.$popContain.find('li').css('display', 'none')
    // this.$tree02.css("display","block");
    this.showTree()
  },

  updateTreeInfo(msg, shakable) {
    this.prevText = msg
    this.preShakable = shakable
  },

  showTree() {
    this.$el.removeClass('hidden')
    if (this.preShakable) {
      this.$tree01.find('.tree_text').text(this.prevText)
      this.$tree01.css('display', 'block')
      this.$tree02.css('display', 'none')
    } else {
      this.$tree02.find('.tree_text2').text(this.prevText)
      this.$tree02.css('display', 'block')
      this.$tree01.css('display', 'none')
    }
  },

  beginShakeHandler(e) {
    const $target = $(e.currentTarget)
    const $text = this.$tree.find('.tree_text')
    this.prevText = $text.text()
    $target.addClass('hidden')
    this.$tree.find('.tree_btn_02').addClass('hidden')
    $text.text('摇奖中……')
    this.treeShake()
  },

  closeHandler() {
    const self = this
    this.$tree01.css('display', 'none')
    this.$popContain.css('z-index', 0)
    this.$popContain.find('li').css('display', 'none')
    // $(".pop_01").css("display","block");
    this.$tree.css('display', 'none')
    Global.ui.notification.show('您暂时关闭了摇钱树，重新刷新页面或10分钟后摇钱树将再次出现！(注：摇钱树当天次数可累积， 每日零点重置。)', {
      id: 'tree',
      force: true,
      event() {
        // Global.m.treeActivity.skip();
        self.destroy()
      },
    })
  },

  onDestroy() {
    clearInterval(this.timer || 0)
    Global.ui.notification.setPrevent(false)
  },

  _checkTimes() {
    const self = this
    return this.getTreeInfoXhr()
      .done((res) => {
        let data
        let msg
        let shakable
        if (res && res.result === 0) {
          data = res.root

          if (data.timesLeft === 0) {
            const lefBet = data.limit - data.betLeftTotal
            msg = `距离下一次摇钱树出现还差${_(lefBet).convert2yuan()}元消费，加油！`
            shakable = false
          } else {
            msg = `已消费${_(data.betLeftTotal).convert2yuan()}元, 可以摇${data.timesLeft}次！`
            shakable = true
          }

          self.updateTreeInfo(msg, shakable)
        } else {
          const notice = '活动已结束'
          Global.ui.notification.show(`<div class="text-left"><p>${notice}</p></div>`, {
            id: 'tree',
            force: true,
            event() {
              // Global.m.treeActivity.skip();
              self.destroy()
            },
          })
        }
      })
  },

  getTreeInfoXhr() {
    return Global.sync.ajax({
      url: '/info/moneytreeactivity/query.json',
      data: {
        activityId: 9,
      },
    })
  },

  getResultXhr() {
    return Global.sync.ajax({
      url: '/info/moneytreeactivity/doget.json',
      data: {
        activityId: 9,
      },
    })
  },


})

module.exports = TreeActivity
