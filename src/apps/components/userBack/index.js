

require('./css/eyhg/main.scss')

const springRechargeBetView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-qe-eyhg-gift-get': 'getGiftHandler',
    'click .js-qe-eyhg-close': 'closeActivityHandler',
    'click .js-qe-eyhg-card-get': 'userCardHandler',
    'click .js-qe-eyhg-close-return': 'hideDialogHandler',

  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/userpack/info.json',
      data: {
        activityId: 31,
        source: 1,
      },
      async: false,
    })
  },

  doUserXhr(data) {
    return Global.sync.ajax({
      url: '/info/userpack/douse.json',
      data,
    })
  },

  doGetXhr(data) {
    return Global.sync.ajax({
      url: '/info/userpack/doget.json',
      data,
    })
  },

  initialize() {

  },

  onRender() {
    const self = this
    // this.$popContain = this.$(".js-acc-siginin");
    this.$ActivityMainPage = this.$('.js-qe-eyhg-main')
    this.initPage()
    this.updateInfo()
    //    setInterval(function() {
    //      self.updateInfo();
    //    }, 30000);
  },

  initPage() {
    const self = this
    $(() => {
      const window_height = $(window).innerHeight()
      const $mask = self.$('.mask')
      const $main_pic = self.$('.main_pic')
      const $bonus_lump = self.$('.bonus_lump')
      const $notice_lump = self.$('.notice_lump')
      const $get_bonus_lump = self.$('.get_bonus_lump')
      const $get_bonus_ele = self.$('.get_bonus_lump>ul>li')

      const $close_btn = self.$('.close_btn,.pop_close_btn')
      const $btn_go = self.$('.btn_go')
      const $btn_notice = self.$('.get_bonus_btn_lump li .btn:odd')

      // console.log('window_height',window_height);
      // console.log('$main_pic.height()',$main_pic.height());
      // console.log('window_height',window_height);
      // console.log('height',window_height / 2 - $main_pic.height() / 2 - 100);
      $main_pic.css({
        top: `${window_height / 2 - 566 / 2 - 100}px`,
      })
      $bonus_lump.css({
        top: `${window_height / 2 - $bonus_lump.height() / 2 - 260}px`,
      })
      $notice_lump.css({
        top: `${window_height / 2 - $bonus_lump.height() / 2 - 260}px`,
      })
      $get_bonus_lump.css({
        top: `${window_height / 2 - $get_bonus_lump.height() / 2 - 300}px`,
      })

      $btn_notice.click(() => {
        $bonus_lump.hide()
        $get_bonus_ele.hide()
        $notice_lump.show()
      })
      $btn_go.click(() => {
        if (self.data.packageType !== undefined && self.data.packageType != 0) {
          $main_pic.hide()
          $bonus_lump.show()
        } else {
          Global.ui.notification.show('不满足领取条件，领取失败！')
          self.destroy()
        }
      })
      // $close_btn.click(function () {
      //   $mask.hide();
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
          self.$('.js-qe-eyhg-regTime').html(moment(data.userRegTime).format('YYYY年MM月DD日'))// 注册日期
          self.$('.js-qe-eyhg-start').html(moment(data.fromDate).format('MM.DD'))// 注册日期
          self.$('.js-qe-eyhg-end').html(moment(data.endDate).format('MM.DD'))// 注册日期
          let type = ''
          switch (data.packageType) {
            case 1: type = '白银'; self.$('.js-qe-eyhg-gift-luster ').eq(0).css('display', 'block'); break
            case 2: type = '黄金'; self.$('.js-qe-eyhg-gift-luster ').eq(1).css('display', 'block'); break
            case 3: type = '钻石'; self.$('.js-qe-eyhg-gift-luster ').eq(2).css('display', 'block'); break
            case 4: type = '至尊'; self.$('.js-qe-eyhg-gift-luster ').eq(3).css('display', 'block'); break
          }
          self.$('.js-qe-eyhg-gift-bag-type').html(type)// 礼包类型'
          self.$('.js-qe-springRechargeBet-amount').html(_(data.limit).formatDiv(10000))

          _(data.amountList).each((item, index) => {
            const resultType = item.resultType
            const category = String(resultType).substr(0, 1)
            const grade = Number(String(resultType).substr(1, 1)) - 1
            const amount = _(item.amount).convert2yuan()
            const limit = _(item.limit).convert2yuan()

            switch (Number(category)) {
              case 1: self.$('.js-qe-eyhg-bonux-amount').eq(grade).html(amount ? (`${amount}元${limit == 1 ? ',需有投注记录' : ''}`) : '无'); break
              case 2: self.$('.js-qe-eyhg-active-amount').eq(grade).html(amount ? (`${amount}元${limit ? (`，活跃天数≥${limit}天`) : ''}`) : '无'); break
              case 3: self.$('.js-qe-eyhg-recharge-limit').eq(grade).html(limit); self.$('.js-qe-eyhg-recharge-amount').eq(grade).html(amount); break
              case 4: self.$('.js-qe-eyhg-bet-amount').eq(grade).html(amount); break
              case 5: self.$('.js-qe-eyhg-addBonus-amount').eq(grade).html(amount); break
            }
          })

          _(data.itemList).each((item) => {
            const resultType = item.resultType
            switch (resultType) {
              case 1: self.$('.js-qe-eyhg-register-time-limit').eq(0).html(`注册时间≤${item.maxLimit}天`); self.$('.js-qe-eyhg-register-time-limit-silver').html(`注册时间≤${item.maxLimit}天`); break
              case 2: self.$('.js-qe-eyhg-register-time-limit').eq(1).html(`注册时间＞${item.minLimit}天≤${item.maxLimit}天`); self.$('.js-qe-eyhg-register-time-limit-gold').html(`注册时间＞${item.minLimit}天≤${item.maxLimit}天`); break
              case 3: self.$('.js-qe-eyhg-register-time-limit').eq(2).html(`注册时间＞${item.minLimit}天≤${item.maxLimit}天`); self.$('.js-qe-eyhg-register-time-limit-diamond').html(`注册时间＞${item.minLimit}天≤${item.maxLimit}天`); break
              case 4: self.$('.js-qe-eyhg-register-time-limit').eq(3).html(`注册时间＞${item.minLimit}天`); self.$('.js-qe-eyhg-register-time-limit-supremacy').html(`注册时间＞${item.minLimit}天`); break
            }
          })
          // if(data.bagStatus==1){
          //   //跳宝箱结果展示页
          //   self.$('.js-qe-eyhg-gift-get').trigger('click');
          // }
          self.$ActivityMainPage.toggleClass('hidden', false)
        }
      })
  },


  userCardHandler(e) {
    const self = this
    const category = $(e.currentTarget).data('type')
    const rechargeLimit = _(this.data.amountList).find((item) => {
      return item.resultType == (`3${self.level}`)
    }).limit
    this.doUserXhr({ resultType: category }).done((res) => {
      let msg = ''
      if (res.result == 0) {
        if (res.root.length > 0) {
          if (res.root[0].resultType) {
            switch (category) {
              case 3: msg = `${_(res.root[0].result).convert2yuan()}元<br/>恭喜您，成功领取今日充值奖励！`; break
              case 4: msg = `恭喜您<br>您今天在无限娱乐投注${_(res.root[0].consumeAmount).convert2yuan()}元<br/>已发放${_(res.root[0].result).convert2yuan()}元投注奖励。<br>敬请留意账户变化！`; break
              case 5: msg = `恭喜您<br>您今天在无限娱乐共中奖${_(res.root[0].consumeAmount).convert2yuan()}元<br>已发放${_(res.root[0].result).convert2yuan()}元加奖奖励。<br>敬请留意账户变化！`; break
            }
          }
        } else {
          msg = '领取成功'
          // switch(category){
          //   case 3:msg = '您今天首次充值未达'+_(rechargeLimit).convert2yuan()+'元<br>暂无法领取奖励！' ;break;
          //   case 4:msg = '您今天还未在平台进行投注<br>暂无法领取奖励！<br><span>注：投注且开奖的订单才可领取奖励。</span>' ;break;
          //   case 5:msg = '您今天还没有中奖的订单<br>暂无法领取奖励！' ;break;
          // }
        }
      } else {
        // switch(category){
        //   case 3:msg = '您今天首次充值未达'+_(rechargeLimit).convert2yuan()+'元<br>暂无法领取奖励！' ;break;
        //   case 4:msg = '您今天还未在平台进行投注<br>暂无法领取奖励！<br><span>注：投注且开奖的订单才可领取奖励。</span>' ;break;
        //   case 5:msg = '您今天还没有中奖的订单<br>暂无法领取奖励！' ;break;
        // }
        msg = res.msg
      }
      self.showMsg(msg)
    })
  },

  showMsg(msg) {
    const $msg = this.$('.js-qe-eyhg-msg')
    $msg.html(msg)
    this.$('.js-qe-eyhg-dialog-mask').toggleClass('hidden', false)
    this.$('.js-qe-eyhg-dialog').toggleClass('hidden', false)
  },
  hideDialogHandler() {
    this.$('.js-qe-eyhg-dialog-mask').toggleClass('hidden', true)
    this.$('.js-qe-eyhg-dialog').toggleClass('hidden', true)
  },


  closeActivityHandler() {
    this.destroy()
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState($target) {
    const cookie = new Base.Storage({
      name: 'appstorage',
      type: 'cookie',
    })
    const userBackActivity = cookie.get('UserBack')
    const today = moment().format('YYYY-MM-DD')

	  const self = this
    let isShow = false
    let $dialog = null
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (acctInfo.userRebate != 128) {
      this.getInfoXhr().done((res) => {
        if (res.result === 0) {
          const status = res.root.status// 0是未开始，1是进行中，2是已结束
          switch (status) {
            case 0:
              $target.css('display', 'none')
              break
            case 1:
              $target.css('display', 'block')
              if (today !== userBackActivity) {
                /** valid 是否首次登录,首次登录会自动弹出活动界面 */
                cookie.set('UserBack', today)
                // $('body').append(self.render().$el);
                isShow = true
                $dialog = self.render().$el
              }
              break
            case 2:
              $target.css('display', 'none')
              break
          }
        }
        // $('body').append(self.render().$el)
        //  if(res.result===0){

        //        var data = self.data = res.root;
        //        //比较时间
        //        var dat = new Date().getTime();

        //       if(dat>=data.fromDate && dat<data.endDate){
        //         $target.css('display','block');
        //         // if(res.root.status==0 ){
        //         //   $('body').append(self.render().$el)
        //         // }


        //         if( today!==userBackActivity){
        //           /** valid 是否首次登录,首次登录会自动弹出活动界面 */
        //           cookie.set('UserBack',today);
        //           $('body').append(self.render().$el);
        //         }
        //       }else{
        //         $target.css('display','none');
        //       }


        // }else{
        //   // $target.css('display','none');
        // }
      })
    }
    return { $dialog, dialogParent: '.js-qe-eyhg-main', isShow }
  },
  closeCurrentDialogHandler(e) {
    this.$('.js-qe-spring-recharge-bet-pop-mask').toggleClass('hidden', true)
    this.$('.js-qe-spring-recharge-bet-ticketRebate-dialog3').toggleClass('hidden', true)
    this.$('.js-qe-spring-recharge-bet-ticketRebate-dialog4').toggleClass('hidden', true)
  },

  getGiftHandler() {
    const self = this
    const $mask = self.$('.mask')
    const $main_pic = self.$('.main_pic')// 首页
    const $bonus_lump = self.$('.bonus_lump')// 奖项描述
    const $notice_lump = self.$('.notice_lump')// 活动说明
    const $get_bonus_lump = self.$('.get_bonus_lump')// 四个礼包当前领取状态描述
    const $get_bonus_ele = self.$('.get_bonus_lump>ul>li')

    $main_pic.hide()
    $bonus_lump.hide()
    $get_bonus_ele.hide()
    $notice_lump.hide()
    this.doGetXhr({}).done((res) => {
      if (res.result === 0) {
        const hasGet = res.root.packageStatus// 0 未领取，1已领取
        const type = Number(res.root.packageType)// 礼包类型：1白金，2黄金，3钻石，4至尊
        self.level = type
        const amountList = res.root.userAmountList
        if (amountList.length > 0) {
          _(amountList).each((item, index) => {
            const amount = item
            const resultType = item.resultType
            const categry = String(resultType).substr(0, 1)// 1元老奖金，2活跃奖金，3充值卡，4投注卡,5加奖卡
            const $li = $get_bonus_ele.eq(type - 1)
            const status = res.root.packageStatus
            const status1 = res.root.packageStatus1
            switch (Number(categry)) {
              case 1: $li.find('.js-qe-eyhg-gift-detail').eq(0).html(`${_(amount.amount).convert2yuan()}元`); status == 0 ? ($li.find('.js-qe-eyhg-gift-status').eq(0).html('未达标')) : ($li.find('.js-qe-eyhg-gift-status').eq(0).html('已发放')); break
              case 2: $li.find('.js-qe-eyhg-gift-detail').eq(1).html(`${_(amount.amount).convert2yuan()}元`); status1 == 0 ? ($li.find('.js-qe-eyhg-gift-status').eq(1).html('未达标')) : ($li.find('.js-qe-eyhg-gift-status').eq(1).html('已发放')); break
              case 3: $li.find('.js-qe-eyhg-gift-detail').eq(2).html(`首充${_(amount.limit).convert2yuan()}返${_(amount.amount).convert2yuan()}元`); break
              case 4: $li.find('.js-qe-eyhg-gift-detail').eq(3).html(`每天投注额的${_(amount.amount).convert2yuan()}%`); break// 每天投注额的0.4%
              case 5: $li.find('.js-qe-eyhg-gift-detail').eq(4).html(`每天中奖额的${_(amount.amount).convert2yuan()}%`); break// 每天中奖额的0.04%
            }
            $get_bonus_ele.hide()
            $li.show()
          })
        } else {
          Global.ui.notification.show('领取失败！')
          self.destroy()
        }
      } else {
        // $get_bonus_ele.eq(1).show();
        Global.ui.notification.show('领取失败！')
        self.destroy()
      }
    }).fail((res) => {
      Global.ui.notification.show('领取失败！')
      self.destroy()
    })
  },


})

module.exports = springRechargeBetView
