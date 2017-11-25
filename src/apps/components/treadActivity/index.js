

require('./index.scss')
const ticketConfig = require('skeleton/misc/ticketConfig')

// 提前加载图片
const img_arr = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()]

img_arr[0].src = require('./images/xyccc/info_lump.png')
img_arr[1].src = require('./images/xyccc/btn.png')
img_arr[2].src = require('./images/xyccc/btn_over.png')
img_arr[3].src = require('./images/xyccc/bonus_board_ele.png')
img_arr[4].src = require('./images/xyccc/bonus_board.png')
img_arr[5].src = require('./images/xyccc/bonus_board_item.png')
img_arr[6].src = require('./images/xyccc/close_btn.png')


const GotImges = [
  require('./images/xyccc/icon_pop_01.png'),
  require('./images/xyccc/icon_pop_02.png'),
  require('./images/xyccc/icon_pop_03.png'),
  require('./images/xyccc/icon_pop_04.png'),
  require('./images/xyccc/icon_pop_05.png'),
  require('./images/xyccc/icon_pop_06.png'),
]

const TreadActivity = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-AlertSpec': 'specHandler', // 活动说明
    'click .js-AlterPrize': 'prizeHandler', // 兑奖台
    'click .js-return': 'returnHandler', // 返回活动主页面
    'click .js-start': 'startAnimate', // 马上开始;
    'click .js-get': 'receiveRrizes', // 立即领取
    'click .js-result': 'receiveResult', // 领取结果
    'click .js-sure': 'makeSure', // 确认领取
    'click .js-close': 'closeHandler', // 所有关闭按钮
  },

  getTreadInfoXhr() {
    return Global.sync.ajax({
      url: '/info/caicc/info.json',
      data: {
        activityId: 28,
      },
      async: false,
    })
  },

  getMoneyXhr() {
    return Global.sync.ajax({
      url: '/info/caicc/doget.json',
      data: {
        activityId: 28,
      },
    })
  },

  getPrizeXhr() {
    return Global.sync.ajax({
      url: '/info/caicc/douse.json',
      data: {
        activityId: 28,
      },
    })
  },

  checkState1($alertTread, needOpen) {
    const self = this
    const t = new Date().getTime()
    let isShow = false
    let $dialog = null
    this.getTreadInfoXhr()
      .done((res) => {
        self.GameInfo = res
        let data
        data = res.root || []
        if ((res.root.endDate < t) || res.root.fromDate > t) {
          $alertTread.addClass('hidden')
        } else {
          self.renderPrizeInfo(data)
          //  $alertTread.removeClass("hidden");
          self.$('.js-ta-active-time').html(`${_(data.fromDate).formatDate('YYYY-MM-DD HH:mm:ss')}--${_(data.endDate).formatDate('YYYY-MM-DD HH:mm:ss')}`)
          self.$spec.hide()
          self.$prize.hide()
          if (needOpen) {
            self.$mask.removeClass('hidden')
          }
          const cookie = new Base.Storage({
            name: 'appstorage',
            type: 'cookie',
          })
          const treadActivityOpen = cookie.get('treadActivity')
          const today = moment().format('YYYY-MM-DD')
          if (today !== treadActivityOpen) {
            /** valid 是否首次登录,首次登录会自动弹出活动界面 */
            // self.$mask.removeClass('hidden');
            cookie.set('treadActivity', today)
            isShow = true
            $dialog = self.$mask
          }
        }
      })
    return { $dialog, dialogParent: '.js-tread-mask-content', isShow }
  },

  renderPrizeInfo(data) {
    _(data.rebateItem).map((items, index) => {
      const $jsTicketName = $(`.js-ticketName0${index + 1}`)
      $jsTicketName.attr('data', items.ticketId)
      $jsTicketName.find('h5').html(items.ticketName).end().find('.js-ta-rate')
        .html(`${_(items.rebate).formatDiv(100)}%`)
    })
    _(data.amountItem).map((items, index) => {
      const $bonus = $(`.js-lucky-bonus0${index + 1}`)
      $bonus.attr('data', `彩金${_(items).convert2yuan()}元`)
      $bonus.find('h4').html(`彩金${_(items).convert2yuan()}元`)
    })
    // var $prizeItem = this.$('.js-ta-bonus_info_item');
    // _($prizeItem).each(function(item,index){
    //     var id = $(item).data('id');
    //     _(data.rebateItem).find(function(rebate,index){
    //         if(id==rebate.ticketId){
    //             $(item).find('.js-ta-rate').html(_(rebate.rebate).formatDiv(100)+'%').end().find('h5').html(rebate.ticketName)
    //             return true;
    //         }else{
    //             return false;
    //         }
    //     });
    // });
  },
  initialize() {
    $('body').append(this.render().$el)
  },

  closeHandler() {
    this.$maskContent.parent().remove()
    // this.$mask.hide()
  },

  specHandler () {
    this.$popChoice.hide()
    this.$get_bonus.hide()
    this.$get_gift_pop_notice.hide()
    this.$spec.show()
  },

  rolling(data) {
    const self = this
    this.renderRollInfo()
    self.$ul.animate({
      top: '-37px',
    }, 1000, () => {
      const $items = self.$ul.find('li')
      const html = []
      self.$ul.css('top', '0px')
      $items.eq(0).appendTo(self.$ul)
    })
  },
  renderRollInfo() {
    const liHtml = []
    _(this.GameInfo.root.dataList).each((item) => {
      liHtml.push(`<li>${_(item.time).formatDate('YYYY.MM.DD')}${item.result}</li>`)
    })
    this.$ul.html(liHtml.join(''))
  },

  prizeHandler() {
    const self = this
    this.$popChoice.hide()
    this.$get_bonus.hide()

    this.getTreadInfoXhr()
      .done(function(res) {
        let data
        self.GameInfo = res
        if (res && res.result === 0) {
          data = res.root || []
          this.dataList = data.dataList
          const length = this.dataList.length
          if (data.resultType == '-1') {
            self.prizeType = data.resultType
            self.$got.find('.js-ta-got-h4').html('<span>亲，赶紧去抽奖</span><br>')
          } else {
            self.$('.js-ta-special-pop').removeClass('pop_float_mid')
            if (data.resultType === '彩金') {
              self.$('.js-ta-special-pop').addClass('pop_float_mid')//
              self.$('.js-ta-special-notice').remove()
              self.$got.find('.js-ta-got-h4').html(`今日已领取${_(data.amount).formatDiv(10000)}彩金`)
            } else {
              self.$('.js-ta-got-img').removeClass('hidden')
              self.$('.js-get').removeClass('hidden')
              if (data.used) {
                self.$('.js-get').html('已领取').prop('disabled', true)
              } else {
                self.$('.js-get').html('立即领取').prop('disabled', false)
              }
              self.renderGotImg(self.$('.js-ta-got-img'), data.resultType)
              self.$got.find('.js-ta-got-h4').html(`<h4>${data.resultType}</h4>`)
              self.$got.find('.js-ta-got-span').html(`<span>返奖${_(data.amount).formatDiv(100)}%</span>`)
            }
            self.rollTimer = setInterval(self.rolling.bind(self), 3000)
          }
        } else {
          self.$popChoice.hide()
          self.$get_bonus.hide()
        }
      })

    this.$prize.show()
    this.$get_bonus_result.hide()
  },
  renderGotImg($img, resultType) {
    switch (this.ticktImgNum) {
      case 0: $img.attr('src', GotImges[0]); break
      case 2: $img.attr('src', GotImges[1]); break
      case 4: $img.attr('src', GotImges[2]); break
      case 6: $img.attr('src', GotImges[3]); break
      case 7: $img.attr('src', GotImges[4]); break
      case 8: $img.attr('src', GotImges[5]); break
    }
    // switch(resultType){
    //     case '韩国乐透1.5': $img.attr('src',GotImges[0]);break;
    //     case '东京1.5分彩': $img.attr('src',GotImges[1]);break;
    //     case '秒秒彩': $img.attr('src',GotImges[2]);break;
    //     case '加州分分彩': $img.attr('src',GotImges[3]);break;
    //     case '分分彩': $img.attr('src',GotImges[3]);break;
    //     case '北京赛车/PK拾': $img.attr('src',GotImges[4]);break;
    //     case '北京五分彩': $img.attr('src',GotImges[5]);break;
    //     case '北京5分彩': $img.attr('src',GotImges[5]);break;
    //     case 21: $img.attr('src',GotImges[0]);break;
    //     case 27: $img.attr('src',GotImges[1]);break;
    //     case 19: $img.attr('src',GotImges[2]);break;
    //     case 10: $img.attr('src',GotImges[3]);break;
    //     case 18: $img.attr('src',GotImges[4]);break;
    //     case 26: $img.attr('src',GotImges[5]);break;
    // }
  },

  returnHandler () {
    this.$spec.hide()
    this.$prize.hide()
    this.$get_gift_pop_notice.hide()
    this.$get_bonus.hide()
    this.$get_bonus_result.hide()
    this.$popChoice.show()
  },

  onRender() {
    const self = this
    this.alertTread = this.$('.js-alertTread')
    this.$mask = this.$('.js-tread-mask')
    this.$maskContent = this.$('.js-tread-mask-content')

    this.$popChoice = this.$('.js-pop-choice')
    this.$spec = this.$('.js-Spec')
    this.$prize = this.$('.js-Prize')

    this.$bonus_info_alpha_mask = this.$('.bonus_info_alpha_mask li')
    this.$bonus_info = this.$('.bonus_info li')

    this.$bonus_info_alpha_mask.mouseover(function () {
      let num = 0
      const $li = $(this)
      _(self.$bonus_info_alpha_mask).find((item, index) => {
        if ($li.is($(item))) {
          num = index
          return true
        }
        return false
      })
      self.$bonus_info.hide()
      self.$bonus_info.eq(num).show()
    }).mouseout(function () {
      let num = 0
      const $li = $(this)
      _(self.$bonus_info_alpha_mask).find((item, index) => {
        if ($li.is($(item))) {
          num = index
          return true
        }
        return false
      })
      self.$bonus_info.eq(num).hide()
    })


    this.$start = this.$('.bonus_btn')
    this.$start.mouseover(function () {
      $(this).addClass('bonus_btn_over')
    }).mouseout(function () {
      $(this).removeClass('bonus_btn_over')
    })

    this.$authority = this.$('.js-authority-err')

    this.$board_ele = this.$('.bonus_board_ele li')

    this.$get_gift_pop_notice = this.$('.get_gift_pop_notice')
    this.$pop_get_notice = this.$('.pop_get_notice')
    this.$pop_normal = this.$('.pop_normal')
    this.$get = this.$('.js-ta-get')
    this.$got = this.$('.js-ta-got')
    this.$get_gift_icon_lump = this.$('.get_gift_icon_lump')

    this.$ul = this.$('.prompt_content ul')

    this.$get_bonus = this.$('.get_bonus')
    this.$get_bonus_result = this.$('.get_bonus_result')
  },


  // 抽奖动画效果
  setBonusEffect(luckyNum) {
    const self = this
    const round_time = 2
    const total_round_time = round_time * 9
    let cur_round_time = 0
    const speed = 80
    let num = 0
    let clear_id
    this.giftNum = luckyNum

    clear_id = setInterval(() => {
      if (num > 8) {
        num = 0
        self.$board_ele.css('display', 'none')
        self.$board_ele.eq(num).css('display', 'block')
      } else {
        self.$board_ele.css('display', 'none')
        self.$board_ele.eq(num).css('display', 'block')
      }

      // 抽奖效果绕的次数和那个奖品所在位置的数字之和(最少也要跑两圈)
      if (cur_round_time >= total_round_time + self.giftNum) {
        self.$board_ele.css('display', 'none')
        self.$board_ele.eq(num).css('display', 'block')
        clearInterval(clear_id)
      } else {
        cur_round_time++
      }
      num++
    }, speed)
  },

  ticktImgNum: null,
  startAnimate () {
    const self = this
    this.giftNum
    const str1 = [1, 3, 5]
    const str2 = [0, 2, 4, 6, 7, 8]
    let random
    this.prizeMoney
    this.prize = ''
    this.prizeName
    this.prizeText
    const resultType = this.GameInfo.resultType
    this.getTreadInfoXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || []
          if (data.resultType == -1) {
            self.getMoneyXhr()
              .done((re) => {
                let datas
                if (re && re.result === 0) {
                  datas = re.root
                  self.prize = datas.resultType
                  if (datas) {
                    if (datas.resultType == 0) {
                      random = Math.floor(Math.random() * str1.length)
                      self.giftNum = self.getGiftNum(datas.resultType, datas.result)
                      self.ticktImgNum = self.getGiftNum(datas.resultType, datas.result)
                      self.prizeMoney = datas.result
                    } else {
                      random = Math.floor(Math.random() * str2.length)
                      self.giftNum = self.getGiftNum(datas.resultType, datas.result)
                      self.ticktImgNum = self.getGiftNum(datas.resultType, datas.result)
                      self.prize = datas.resultType
                      self.prizeName = ticketConfig.getComplete(self.prize).info.zhName
                      self.prizeText = datas.result
                    }
                    self.setBonusEffect(self.giftNum)
                    setTimeout(() => {
                      self.$popChoice.hide()
                      if (self.prize != null) {
                        if (self.prize == 0) {
                          self.$get_gift_pop_notice.css('display', 'block')
                          self.$get.find('.js-ta-get-h4').html(self.prizeMoney)
                          self.$get_gift_icon_lump.append(`<div class="get_gift_info">恭喜您，获得${self.prizeMoney}奖励，已加币至您的平台账号，请留意查看账户明细。明天再接再厉哦！`)
                        } else {
                          self.$('.js-ta-get-img').removeClass('hidden')
                          self.renderGotImg(self.$('.js-ta-get-img'), datas.resultType)// resultType是彩种id
                          self.$get_gift_pop_notice.css('display', 'block')
                          self.$get.find('.js-ta-get-h4').html(self.prizeText)
                          self.$get_gift_icon_lump.append(`<div class="get_gift_info">今日幸运彩种：${self.prizeName}!在${self.prizeName}下所有的投注都将获得对应返水，请在今日内完成消费并领取奖励。</div>`)
                        }
                      } else {
                        self.$authority.text('亲，今天机会错过了，明天再来哦~')
                        self.$popChoice.hide()
                        self.$get_bonus.hide()
                        self.$pop_get_notice.show()
                      }
                      self.$mask.show()
                    }, 2300)
                  } else {
                    self.$authority.text(res.msg)
                    self.$mask.hide()
                    self.$pop_get_notice.show()
                  }
                } else {
                  self.$authority.text(re.msg)
                  self.$popChoice.hide()
                  self.$get_bonus.hide()
                  self.$pop_get_notice.show()
                }
              })
          } else {
            self.$authority.text('今日游戏次数已耗尽，请明天再来玩！')
            self.$popChoice.hide()
            self.$get_bonus.hide()
            self.$pop_get_notice.show()
          }
        } else {
          self.$mask.hide()
        }
      })
  },
  getGiftNum(resultType, result) {
    const data = this.$('.js-ta-bonus_info_item')
    let num
    _(data).map((items, index) => {
      if (parseInt($(items).attr('data')) == resultType) {
        num = index
      } else if ($(items).attr('data') == result) {
        num = index
      }
    })
    return num
  },

  receiveRrizes () {
    const self = this
    const root = this.GameInfo.root
    const html = `恭喜，获得${root.resultType}返水奖励，您在${root.resultType}中投注${_(root.bet).convert2yuan()} 元，可领取奖励${_(root.bonus).convert2yuan()}元。`
    this.$get_bonus.find('.js-ta-congra-msg').html(html)
    self.$prize.hide()
    self.$get_bonus.show()
  },


  receiveResult () {
    this.$get_bonus.hide()

    this.$get_bonus_result.show()
  },

  makeSure () {
    const self = this
    this.$get_bonus.hide()
    const $result = this.$('.js-ta-get-result')

    this.getPrizeXhr()
      .done((res) => {
        let data
        data = res.root || []
        if (res.result == 0) {
          $result.html('领取成功')
        } else {
          $result.html('领取失败')
        }
        self.$get_bonus_result.show()
      })
  },

})

module.exports = TreadActivity
