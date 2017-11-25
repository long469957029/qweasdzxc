'use static'

import lottery from './lottery'
import StatusModule from '../modules/pickUp/statusModule'
import couponConfig from './couponConfig'
import './index.scss'

const treasureView = Base.ItemView.extend({

  template: require('./index.html'),
  // 转盘奖项 template
  awardTpl: _(require('./award.html')).template(),
  // 转盘控制 template
  centerTpl: _(require('./center.html')).template(),
  // 刮刮乐奖项 template
  chestTpl: _(require('./chest.html')).template(),

  events: {
    'click .js-treasure-rob': 'robHandler',
    'click .js-treasure-scratch': 'scratchHandler',
  },

  // 获取初始资料设定
  getInitDataXhr () {
    return Global.sync.ajax({
      url: '/mall/lucky/conf.json',
    })
  },

  // 抽奖
  lotteryXhr (data) {
    return Global.sync.ajax({
      url: '/mall/lucky/lottery.json',
      data,
    })
  },

  // 刮刮乐
  lotteryChestXhr (data) {
    return Global.sync.ajax({
      url: '/mall/lucky/lotteryChest.json',
      data,
    })
  },
  onRender () {
    const self = this
    // 获奖用户DOM
    self.$rewardList = self.$('.js-reward-list')
    // 转盘DOM
    self.$turntable = self.$('.js-turntable')
    // 刮刮乐DOM
    self.$scratch = self.$('.js-scratch')

    // 获取初始资料设定
    self.getInitDataXhr()
      .done((res) => {
        if (res.root && res.result === 0) {
          const data = res.root
          // 获奖用户 / 刮刮乐奖项
          const { recentUser, chest } = data
          // 转盘奖项
          const {
            myLucky, integralRob, cashRob, awards,
          } = data
          const awardData = {
            myLucky,
            integralRob,
            cashRob,
            awards,
          }

          // 渲染获奖用户
          self.renderRewardUsers(recentUser)
          // 渲染转盘奖项
          self.renderAwards(awardData)
          // 渲染刮刮乐奖项
          self.renderChest(chest)
        } else {
          Global.ui.notification.show('加载失败，请稍后再试')
        }
      })
    self.click = false
  },

  initialize () { },

  // 抽奖
  robHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type') // (0:积分, 1:现金)
    // self.dialogHandler(testData5, 'scratch') // treasureType: rob / scratch
    lottery.init('js-turntable')
    if (self.click) {
      return
    }
    self.click = true

    self.lotteryXhr({ type })
      .done((res) => {
        let isSuccess
        if (res && res.result === 0) {
          const data = res.root
          let id = data.id

          lottery.speed = 100
          if (id >= 6) {
            id += 1
          }

          if (data.awardTypeId === 0) { // 谢谢惠顾
            id = 6
          }
          self.robAnimation(data, id)

          isSuccess = true
          _.extend(data, { isSuccess })
        } else {
          isSuccess = false
          self.dialogHandler(res.msg, 'rob')
          // self.trigger('update:userInfo');
          self.click = false
        }
      })

    // 更新个人资料
  },

  robAnimation (data, id) {
    const self = this
    lottery.times += 1
    lottery.roll()
    if (lottery.times > lottery.cycle + 10 && lottery.prize === lottery.index) {
      clearTimeout(lottery.timer)
      lottery.prize = -1
      lottery.times = 0
      setTimeout(self.dialogHandler.bind(self, data, 'rob'), 800)
      setTimeout(() => {
        self.click = false
        self.trigger('update:userInfo')
        self.onRender()
      }, 1000)
    } else {
      if (lottery.times < lottery.cycle) {
        lottery.speed -= 10
      } else if (lottery.times === lottery.cycle) {
        const index = id
        lottery.prize = index
      } else if (lottery.times > lottery.cycle + 10
        && ((lottery.prize === 0 && lottery.index === 7)
        || lottery.prize === lottery.index + 1)) {
        lottery.speed += 110
      } else {
        lottery.speed += 20
      }
      if (lottery.speed < 40) {
        lottery.speed = 40
      }
      lottery.timer = setTimeout(this.robAnimation.bind(this, data, id), lottery.speed)
    }
    return false
  },

  dialogHandler (data, treasureType) {
    const self = this
    const $treasureDialog = Global.ui.dialog.show({
      anySize: '500',
      anyPosition: '210',
      body: '<div class="treasure-dialog-content"></div>',
      bodyClass: 'mc-pick-up-module-body',
    })
    const $dialogContent = $treasureDialog.find('.treasure-dialog-content')
    // 成功 / 失败
    if (data.isSuccess) {
      $dialogContent.html(new StatusModule(_.extend({
        type: 'treasure', // for render dialog template
        treasureType, // 夺宝 / 刮刮乐
        isSuccess: data.isSuccess,
      }, data)).render().el)
    } else {
      $dialogContent.html(new StatusModule(_.extend({
        type: 'treasure', // for render dialog template
        treasureType, // 夺宝 / 刮刮乐
        isSuccess: data.isSuccess,
        msg: data,
      }, data)).render().el)
    }
    $treasureDialog.on('hidden.modal', function () {
      $(this).remove()
      if (data.awardTypeId === 2) {
        self.setInfoHandler(data)
      }
    })
  },

  // 刮刮乐
  scratchHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    self.lotteryChestXhr({ id })
      .done((res) => {
        let isSuccess = true
        if (res && res.result === 0) {
          const data = res.root
          isSuccess = true
          _.extend(data, { isSuccess })
          setTimeout(() => {
            self.trigger('update:userInfo')
            self.onRender()
          }, 500)
          self.dialogHandler(data, 'scratch')
        } else {
          isSuccess = false
          self.dialogHandler(res.msg, 'scratch')
        }
        self.onRender()
      })
  },

  // 渲染获奖用户列表
  renderRewardUsers (userList) {
    const self = this
    const html = _.map(userList, (user) => {
      return `${'<li>' +
        '<span class="name">恭喜'}${user.userName}</span>` +
        `<span class="info">${user.bonusName}</span>` +
        '</li>'
    }).join('')

    self.$rewardList.html(html)
    this.rolling()
    clearTimeout(this.timer1)
    this.timer1 = setTimeout(() => {
      self.getRewredUsers()
    }, 300000)
  },
  rolling () {
    const self = this
    clearInterval(this.$rollTime)
    this.$rollTime = setInterval(() => {
      self.$rewardList.animate({
        top: '-35px',
      }, 1000, () => {
        const $items = self.$rewardList.find('li')
        self.$rewardList.css('top', '0px')
        $items.eq(0).appendTo(self.$rewardList)
      })
    }, 3000)
  },
  getRewredUsers () {
    const self = this
    this.getInitDataXhr()
      .done((res) => {
        if (res.root && res.result === 0) {
          const data = res.root
          // 获奖用户
          const recentUser = data.recentUser
          // 渲染获奖用户
          self.renderRewardUsers(recentUser)
        }
      })
  },

  // 渲染转盘
  renderAwards (awardData) {
    const self = this
    const awards = awardData.awards
    const html = _.map(_.range(1, 12), (index) => {
      let award
      const paneIndexList = [1, 2, 3, 4, 10, '', 5, 9, 8, 7, 6]
      // real award        1, 2, 3, 4, 9,      5, 8 ,7, 6,
      if (paneIndexList[index - 1] === 10) {
        award = _.findWhere(awards, { id: 9 })
      } else if (paneIndexList[index - 1] <= 9 && paneIndexList[index - 1] >= 7) {
        award = _.findWhere(awards, { id: paneIndexList[index - 1] - 1 })
      } else {
        award = _.findWhere(awards, { id: paneIndexList[index - 1] })
      }

      if (index === 6) { // 不放奖项 放控制面板
        return self.centerTpl({
          cashRob: _(awardData.cashRob).formatDiv(10000), // 夺宝所需现金
          integralRob: _(awardData.integralRob).formatDiv(10000), // 夺宝所需积分
          myLucky: awardData.myLucky, // 用户当前幸运值
        })
      }

      if (index === 11) {
        return self.awardTpl({
          awardTypeId: 0, // 谢谢惠顾
          paneIndex: paneIndexList[index - 1],
        })
      }

      return self.awardTpl({
        id: award.id,
        awardTypeId: award.awardTypeId,
        statName: award.statName,
        couponType: award.couponType,
        couponName: award.couponType ? _.findWhere(couponConfig, {
          couponType: award.couponType,
        }).name : '',
        desc: award.desc,
        validDay: award.validDay,
        rate: _(award.rate).formatDiv(100),
        itemName: award.itemName,
        picUrl: award.picUrl,
        integral: _(award.integral).formatDiv(10000),
        paneIndex: paneIndexList[index - 1],
      })
    }).join('')

    self.$turntable.html(html)
  },

  // 渲染刮刮乐
  renderChest (chests) {
    const self = this
    const html = _.map(chests, (chest) => {
      return self.chestTpl({
        id: chest.id, // 宝箱 index
        desc: chest.desc,
        awardTypeId: chest.awardTypeId, // 奖品类型
        statName: chest.statName, // 优惠券范围
        couponType: chest.couponType,
        // couponName: chest.couponType ? _.findWhere(couponConfig, {
        //   couponType: chest.couponType
        // }).name : '',
        itemName: chest.itemName, // 商品名称
        picUrl: chest.picUrl, // 礼物图片
        rate: _(chest.rate).formatDiv(100), // 中奖概率
        lucky: chest.lucky, // 幸运值
        integral: _(chest.integral).formatDiv(10000), // 积分
        validDay: chest.validDay, // 有效期
      })
    }).join('')

    self.$scratch.html(html)
  },
  setInfoHandler (data) {
    const self = this
    const $dialog = Global.ui.dialog.show({
      anySize: '500',
      anyPosition: '170',
      body: '<div class="mall-gift-form"></div>',
      bodyClass: 'mc-pick-up-module-body',
    })

    const $container = $dialog.find('.mall-gift-form')
    $container.html(new StatusModule({
      type: 'form',
      status: 0,
      title: '收货信息',
      moneyImg: false,
      seal: false,
      itemId: data.rid,
      exPhone: data.exPhone,
      exAddr: data.exAddr,
      exName: data.exName,
    }).on('hidden.dialog', () => {
      $dialog.modal('hide')
    }).on('show:myGift', () => {
      self.trigger('show:myGiftTab')
    }).render().el)

    $dialog.on('hidden.modal', function () {
      $(this).remove()
    })

    self.trigger('update:userInfo')
  },

})
module.exports = treasureView
