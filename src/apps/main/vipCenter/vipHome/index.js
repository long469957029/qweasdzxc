

require('./style.scss')

const VipHomeView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  // 获取页面信息
  getInfoXhr () {
    return Global.sync.ajax({
      url: '/acct/vip/vipindex.json',
    })
  },

  onRender() {
    const self = this
    this.$vipIntegral = this.$('.js-vip-integral')
    this.$vipIntegralStrip = this.$('.js-vip-integral-strip')
    this.$vipSetbacks = this.$('.js-vip-setbacks')
    this.$vipToday = this.$('.js-vip-today')

    this.$vip0 = this.$('.js-vip-0')
    this.$vip1 = this.$('.js-vip-1')
    this.$vip2 = this.$('.js-vip-2')
    this.$vip3 = this.$('.js-vip-3')
    this.$vip4 = this.$('.js-vip-4')
    this.$vip5 = this.$('.js-vip-5')
    this.$vip6 = this.$('.js-vip-6')

    this.getInfoXhr()
      .done((res) => {
        if (res && res.result == 0) {
          const root = res.root
          // 当前积分
          if (!_.isNull(root.integrate)) {
            self.$vipIntegral.html(root.integrate / 10000)
          } else {
            self.$vipIntegral.html('0')
          }
          if (!_.isNull(root.integrate)) {
            self.$vipIntegralStrip.html(root.integrate / 10000)
          } else {
            self.$vipIntegralStrip.html('0')
          }
          // 积分进度条
          if (!_.isNull(root.integrate)) {
            if (root.integrate === 0) {
              self.$vipSetbacks.css('margin-left', '0')
            } else if (root.integrate > root.integrateCfg[0].integrate && root.integrate < root.integrateCfg[1].integrate) {
              self.$vipSetbacks.css('margin-left', `${(((root.integrate / root.integrateCfg[1].integrate) * 100) / 700) * 100}%`)
            } else if (root.integrate >= root.integrateCfg[1].integrate && root.integrate < root.integrateCfg[2].integrate) {
              self.$vipSetbacks.css('margin-left', `${(((((root.integrate - root.integrateCfg[1].integrate) / (root.integrateCfg[2].integrate - root.integrateCfg[1].integrate)) * 100) + 100) / 700) * 100}%`)
            } else if (root.integrate >= root.integrateCfg[2].integrate && root.integrate < root.integrateCfg[3].integrate) {
              self.$vipSetbacks.css('margin-left', `${(((((root.integrate - root.integrateCfg[2].integrate) / (root.integrateCfg[3].integrate - root.integrateCfg[2].integrate)) * 100) + 200) / 700) * 100}%`)
            } else if (root.integrate >= root.integrateCfg[3].integrate && root.integrate < root.integrateCfg[4].integrate) {
              self.$vipSetbacks.css('margin-left', `${(((((root.integrate - root.integrateCfg[3].integrate) / (root.integrateCfg[4].integrate - root.integrateCfg[3].integrate)) * 100) + 300) / 700) * 100}%`)
            } else if (root.integrate >= root.integrateCfg[4].integrate && root.integrate < root.integrateCfg[5].integrate) {
              self.$vipSetbacks.css('margin-left', `${(((((root.integrate - root.integrateCfg[4].integrate) / (root.integrateCfg[5].integrate - root.integrateCfg[4].integrate)) * 100) + 400) / 700) * 100}%`)
            } else if (root.integrate >= root.integrateCfg[5].integrate && root.integrate < root.integrateCfg[6].integrate) {
              self.$vipSetbacks.css('margin-left', `${(((((root.integrate - root.integrateCfg[5].integrate) / (root.integrateCfg[6].integrate - root.integrateCfg[5].integrate)) * 100) + 500) / 700) * 100}%`)
            } else {
              self.$vipSetbacks.css('margin-left', '94%')
            }
          } else {
            self.$vipSetbacks.css('margin-left', '0')
          }
          // VIP特权
          // 1: 生日礼金2：信誉基金3：月度奖励4：特权卡5：节日礼金6：vip加奖
          // 1生日礼金（V1-V6）
          // 2信誉基金（V5-V6）
          // 节日礼金（V1-V6）
          // 周末加奖（V1-V6）
          // 电话客服（V3-V6）
          // 7充提优先（V3-V6）
          const acctInfo = Global.memoryCache.get('acctInfo')
          if (parseInt(acctInfo.memberLevel) >= 3 && parseInt(acctInfo.memberLevel) <= 6) {
            $('.js-vip-home-awards').removeClass('hidden')
            $('.js-vip-home-RW').removeClass('hidden')
          }

          if (!_.isNull(root.privilegeList)) {
            _(root.privilegeList).each((list) => {
              switch (list) {
                case 1:
                  $('.js-vip-home-birthday').removeClass('hidden')
                  break
                case 2:
                  $('.js-vip-home-reputation').removeClass('hidden')
                  break
                case 3:
                  $('.js-vip-home-monthly').removeClass('hidden')
                  break
                case 4:
                  $('.js-vip-home-privilege').removeClass('hidden')
                  break
                case 5:
                  $('.js-vip-home-festival').removeClass('hidden')
                  break
              }
            })
          }
          // 今日活动
          // 1: 生日礼金2：信誉基金3：月度奖励4：特权卡5：节日礼金6：vip加奖
          if (!_.isNull(root.todayList) && root.todayList != '') {
            let htmlList = ''
            _(root.todayList).each((item) => {
              switch (item.type) {
                case 1:
                  htmlList += "<div class='js-vip-birthday vip-home-menu-txt'>今天是您的生日，无限娱乐全体工作成员衷心的祝您生日快乐！您可以到" +
                      "<a class='vip-a' href='#vip/cash'>周末加奖</a>页面，领取无限为您准备的生日祝福！</div>"
                  break
                case 5:
                  $('.js-vip-home-reputation').removeClass('hidden')
                  htmlList += `<div class='js-vip-festival vip-home-menu-txt'>今天是${item.holidayName}，无限娱乐全体工作成员衷心的祝您节日快乐！您可以到` +
                      `<a class='vip-a' href='#vip/festival'>节日奖励</a>页面，领取无限为您准备的${item.bonus / 10000}元礼金！</div>`
                  break
                case 6:
                  $('.js-vip-home-monthly').removeClass('hidden')
                  htmlList += `<div class='js-vip-activity vip-home-menu-txt'>今天我们特别开启了周末加奖活动，加奖时间为${item.fromTime}至${item.endTime}，` +
                      `您在加奖时间内的所有中奖奖金都将获得${item.rate / 10000}%的加奖，您需要在${item.fromTime}至${item.endTime}进入<a class='vip-a' href='#vip/prize'>周末加奖</a>页面进行领取。</div>`
                  break
              }
            })
            self.$vipToday.html(htmlList)
          } else {
            $('.js-vip-home-menu-icon').addClass(' hidden')
          }
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },
})

module.exports = VipHomeView
