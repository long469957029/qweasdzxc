

require('./jquery-1.10.2')
require('./index.scss')

const BetView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-check-agent': 'checkAgentHandler',
    'click .js-close': 'closeActivityHandler',
    'click .js-submit': 'submitHandler',
  },


  // 领取日销量活动奖金
  getAgentInfoXhr() {
    return Global.sync.ajax({
      url: '/info/dailySalesActivity/doget.json',
      data: {
        activityId: 16,
      },
    })
  },

  // 获取日销量活动领取详情
  getBetInfoXhr() {
    return Global.sync.ajax({
      url: '/info/dailySalesActivity/getinfo.json',
      data: {
        activityId: 16,
      },
    })
  },

  // 查看日销量活动信息
  getDailySalesInfoXhr() {
    return Global.sync.ajax({
      url: '/info/dailySalesActivity/info.json',
      data: {
        activityId: 16,
        source: 1,
      },
      async: false,
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
    this.getDailySalesInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root

          $('.js-rank').html(`欢迎回到无限娱乐平台，您已在无限娱乐奋斗了<span>${data.rank}</span> 天啦！`)
          $('.js-ul-list').html('')
          let htmlStr = []
          _(data.cfg.itemList).each((info) => {
            htmlStr.push(`<li >投注<span class='blue'>${info.bet / 10000}</span>元</br>` +
              `奖励<span class='red'>${info.bonus / 10000}</span>元` +
              '</li>')
          })
          htmlStr = _(htmlStr).reverse()
          self.$('.js-ul-list').html(htmlStr.join(''))
        }
      })
  },

  onRender() {
    const self = this
    this.initPage()
    this.updateInfo()
  },

  initPage() {
    const $main_contain = this.$('.main_contain')
    const window_width = $(window).innerWidth()
    const window_height = $(window).innerHeight()

    // $main_contain.css({
    //  "left": (window_width / 2 - $main_contain.width() / 2) + "px",
    //  "top": (window_height / 2 - $main_contain.height() / 2) + "px"
    // });

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

    // var $close_btn = this.$(".close_btn");
    // $close_btn.click(function () {
    //  $(".mask").hide();
    // });
  },
  // event handlers

  jsCloseHandler() {
    $('.js-info0').hide()
    $('.js-info1').hide()
    $('.js-info2').hide()
    $('.js-info3').hide()
  },

  submitHandler() {
    const self = this
    this.getAgentInfoXhr()
      .done((res) => {
        let data
        let msg
        if (res && res.result === 0) {
          data = res.root 
          // 0：未达标  1： 失败  2:成功
          if (data.result == '2') {
            $('.js-info1').show()
            $('.js-main').hide()
          }
          if (data.result == '0') {
            $('.js-info2').show()
            $('.js-main').hide()
          }
          if (data.result == '1') {
            $('.js-info3').show()
            $('.js-main').hide()
          }
        } else {
          Global.ui.notification.show(`您的帐户不符合领取条件，有可能是：<br>${res.msg}`)
        }
      })
    // $(".js-info1").show();
  },

  checkAgentHandler() {
    this.getBetInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root
          if (data.status == '0') {
     		 $('.js-info2').show()	
     		  $('.js-main').hide()
          } else if (data.status == '2') {
        	  $('.js-info3').show()	
     		  $('.js-main').hide()
          } else {
        	  $('.js-betInfo').html(`您当前已投注${data.bet / 10000}元，可领取${data.bonus / 10000}元奖励！`)
            $('.js-info0').show() 
            $('.js-main').hide()
          }
        } else {
          Global.ui.notification.show(`您的帐户不符合领取条件，有可能是：<br>${res.msg}`)
        }
      })
  },

  closeActivityHandler() {
    // this.$popContain.css('z-index', 0);
    // this.$popContain.find("li").css("display","none");
    // this.$tree.css('display', 'none');
    this.destroy()
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState($target) {
	  const self = this
	  let isShow = false
	  let $dialog = null
    this.getDailySalesInfoXhr().done((res) => {
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
    return { $dialog, dialogParent: '.js-activity_bet', isShow }
  },

})

module.exports = BetView
