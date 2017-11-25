

require('./jquery-1.10.2')
require('./index.scss')

const SigninView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-check-agent': 'getPrizeHandler',
    'click .js-close': 'closeActivityHandler',
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/checkInActivity/info.json',
      data: {
        activityId: 15,
        source: 1,
      },
      async: false,
    })
  },

  
  doGetXhr(days) {
    return Global.sync.ajax({
      url: '/info/checkInActivity/doget.json',
      data: {
        activityId: 15,
        cycle: days,
      },
    })
  },


  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },
 
 
  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root

          self.$('.js-rank').html(`欢迎来到无限娱乐平台，您已经成为无限娱乐第${data.rank}位用户了！`)
         
          _(data.cfg.itemList).each((info) => {
            const htmlStr = ` <div class='li_text'><span>第${info.cycle}天</span><br>` +
              `   充值${info.recharge / 10000}元<br>` +
              `   投注${info.bet / 10000}元<br>` +
              `   奖${info.bonus / 10000}元` +
              ' </div>'
            self.$(`.js-divbet-0${info.cycle}`).html(htmlStr)

            // 0：未开始　1：已过期 2：已领取 3: 进行中
            if (info.status == '0') {
              self.$(`.js-img${info.cycle}-01`).show()
              self.$(`.js-img${info.cycle}-02`).hide()
            }
            if (info.status == '1') {
              self.$(`.js-divbet-0${info.cycle}`).html(`<div class='li_label_02'></div>${self.$(`.js-divbet-0${info.cycle}`).html()}`)
              self.$(`.js-img${info.cycle}-01`).show()
              self.$(`.js-img${info.cycle}-02`).hide()
            }
            if (info.status == '2') {
              self.$(`.js-divbet-0${info.cycle}`).html(`<div class='li_label_01'></div>${self.$(`.js-divbet-0${info.cycle}`).html()}`)
              self.$(`.js-img${info.cycle}-01`).show()
              self.$(`.js-img${info.cycle}-02`).hide()
            }
            if (info.status == '3') {
              self.$(`.js-divbet-0${info.cycle}`).html(`<div class='person'></div>${self.$(`.js-divbet-0${info.cycle}`).html()}`)
              self.$(`.js-img${info.cycle}-01`).hide()
              self.$(`.js-img${info.cycle}-02`).show()
            }
          })
        }
      })
  },

  onRender() {
    const self = this
    this.$popContain = this.$('.js-acc-siginin')
    this.initPage()
    this.updateInfo()
    //    setInterval(function() {
    //      self.updateInfo();
    //    }, 30000);
  },

  initPage() {
    const $sunshine = this.$('.sunshine')
    let rotate_num = 0
    setInterval(() => {
      rotate_num++
      if (rotate_num >= 360) {
        rotate_num = 0
      } else {
        $sunshine.css('transform', `rotate(${rotate_num}deg)`)
      }
    }, 50)
  },

  // event handlers

  jsCloseHandler() {
    $('.js-info1').hide()
    $('.js-info2').hide()
    $('.js-info3').hide()
  },

  // 领奖
  getPrizeHandler() {
	  const self = this  
	  const days = this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          _(data.cfg.itemList).each((info) => {
            if (info.status == '3') {
            	self.checkPrize(info.cycle)
            }
          })
        }
      })
  },

  checkPrize(days) {
	  const self = this  
	    
	  this.doGetXhr(days)
      .done((res) => {
        let data = res.root.result
        let msg
        if (res && res.result === 0) {
          data = res.root.result
          // 未达标
          if (data == '0') {
            self.$('.js-info2').show()
            self.$('.js-main').hide()
          }
          // 失败
          if (data == '1') {
            self.$('.js-info3').show()
            self.$('.js-main').hide()
          }
          // 成功
          if (data == '2') {
            self.$('.js-info1').show()
            self.$('.js-main').hide()
          }
        } else {
          Global.ui.notification.show(`您的帐户不符合领取条件，有可能是：<br>${res.msg}`)
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
    let $dialog = null
    this.getInfoXhr().done((res) => {
      if (res.result === 0) {
        const data = self.data = res.root
        // 比较时间
        const dat = new Date().getTime()

        if (dat >= data.cfg.fromDate && dat < data.cfg.endDate) {
          $target.css('display', 'block')
        } else {
          $target.css('display', 'none')
        }
        if (res.root.valid) {
          // $('body').append(self.render().$el);
          isShow = true
          $dialog = self.render().$el
        }
      } else {
        $target.css('display', 'none')
      }
    })
    return { $dialog, dialogParent: '.js-activity_siginIn', isShow }
  },


})

module.exports = SigninView
