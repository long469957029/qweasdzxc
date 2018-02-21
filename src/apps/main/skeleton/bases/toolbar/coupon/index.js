import './index.scss'
import store from "../../../../../store";

// import couponConfig from './couponConfig'
import {PointsCard} from 'build'

import * as couponConfig from './couponConfig'

const CouponView = Base.ItemView.extend({

  template: require('./index.html'),

  couponTpl: _(require('./coupon.html')).template(),

  events: {},

  // 获取我的优惠券列表
  getMyCouponListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/coupon/couponList.json',
      data,
    })
  },
  // // 获取商城优惠券列表
  // getSystemCouponListXhr (data) {
  //   return Global.sync.ajax({
  //     url: '/mall/coupon/newItemList.json',
  //     data,
  //   })
  // },

  initialize() {
  },

  serializeData() {
  },

  onRender() {
    const self = this
    // self.$myCoupon = self.$('.js-sidebar-mycoupon')
    // self.$systemCoupon = self.$('.js-sidebar-systemCoupon')
    self.fetchMyCoupon()
    // self.fetchSystemCoupon()
  },

  fetchMyCoupon() {
    const self = this
    self.getMyCouponListXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root || {}
          if (data.rowCount > 0) {
            self.renderMyCoupon(data.records)
          } else {
            this.$('.js-mall-coupon-container-empty').removeClass('hidden')
          }
        } else {
          Global.ui.notification.show('加载失败，请稍后再试')
        }
      })
  },
  // fetchSystemCoupon() {
  //   const self = this
  //   self.getSystemCouponListXhr()
  //     .always(() => {
  //       self.loadingFinish()
  //     })
  //     .done((res) => {
  //       if (res && res.result === 0) {
  //         const data = res.root || {}
  //         if (data.rowCount > 0) {
  //           self.renderSystemCoupon(data.records)
  //         } else {
  //           // this.$('.js-sidebar-systemCoupon-empty').removeClass('hidden')
  //         }
  //       } else {
  //         Global.ui.notification.show('加载失败，请稍后再试')
  //       }
  //     })
  // },

  renderMyCoupon(couponList) {
    const self = this

    this.app = new Vue({
      template: `<div><points-card v-for="(item, index) in cardList" :key="index" :coupon-info="item" display-type="show"></points-card></div>`,
      components: {
        PointsCard
      },
      data: {
        // cardList: []
        cardList: couponList
      },
      store: window.store,
      el: this.$el.find('#pointsWrapper')[0],
    })

    // const couponHtml = _.map(couponList, (coupon) => {
    //   return self.couponTpl({
    //     from: 1, // 1 我的优惠券 0 优惠券兑换
    //     couponStatus: coupon.couponStatus || coupon.status || 0, // 0:即将开始, 1:可兑换, 2:已兑换, 3:已抢完
    //     couponId: coupon.couponId,
    //     couponType: coupon.couponType,
    //     // 1充值 blue-green 2加奖 green 3补贴 purple 4返水 blue 5代金 yellow 6现金 red
    //     couponName: _.findWhere(couponConfig, {
    //       couponType: coupon.couponType,
    //     }).name,
    //     couponToken: coupon.couponToken,
    //     couponDesc: coupon.couponDesc,
    //     couponDetailDesc: coupon.couponDetailDesc.replace('\n', '<br>'),
    //     requireIntegral: _(coupon.requireIntegral).formatDiv(10000, {
    //       fixed: 2,
    //       clear: true,
    //     }),
    //     validStartDate: _(coupon.validStartDate).toTime('YYYY.MM.DD HH:mm'),
    //     validEndDate: _(coupon.validEndDate).toTime('YYYY.MM.DD HH:mm'),
    //     bigShowNum: _(coupon.bigShowNum).formatDiv(coupon.couponBonusType === 1 ? 10000 : 100),
    //     couponBonusType: coupon.couponBonusType, // 返利类型 (1:直接是元, 2:%)
    //     levelLimit: coupon.levelLimit, // Lv. 以上
    //     limitLevelType: coupon.limitLevelType,
    //     limitRange: coupon.limitRange, // 0: 新手, 1:老手
    //     styleClass: (coupon.status === 0 ? 'no' : _.findWhere(couponConfig, {
    //       couponType: coupon.couponType,
    //     }).styleClass),
    //     lastNum: (_.isNull(coupon.maxNum) ||
    //     _.isUndefined(coupon.maxNum)) ?
    //       null :
    //       _(coupon.maxNum).sub(coupon.useNum),
    //   })
    // }).join('')
    // self.$myCoupon.html(`${couponHtml}<div class="text-center"><a href="/" class="recent-more">更多记录 ></a></div>`)
  },
  // renderSystemCoupon(couponList) {
  //   const self = this
  //   const couponHtml = _.map(couponList, (coupon) => {
  //     if(coupon.couponType===0){
  //       return ''
  //     }else{
  //       return self.couponTpl({
  //         from: 1, // 1 我的优惠券 0 优惠券兑换
  //         couponStatus: coupon.couponStatus || coupon.status || 0, // 0:未使用, 1:已使用, 2:已过
  //         couponId: coupon.couponId,
  //         couponType: coupon.couponType,
  //         // 1充值 blue-green 2加奖 green 3补贴 purple 4返水 blue 5代金 yellow 6现金 red
  //         couponName: _.findWhere(couponConfig, {
  //           couponType: coupon.couponType,
  //         }).name,
  //         couponToken: coupon.couponToken,
  //         couponDesc: coupon.couponDesc,
  //         couponDetailDesc: coupon.couponDetailDesc.replace('\n', '<br>'),
  //         requireIntegral: _(coupon.requireIntegral).formatDiv(10000, {
  //           fixed: 2,
  //           clear: true,
  //         }),
  //         validStartDate: _(coupon.validStartDate).toTime('YYYY.MM.DD HH:mm'),
  //         validEndDate: _(coupon.validEndDate).toTime('YYYY.MM.DD HH:mm'),
  //         bigShowNum: _(coupon.bigShowNum).formatDiv(coupon.couponBonusType === 1 ? 10000 : 100),
  //         couponBonusType: coupon.couponBonusType, // 返利类型 (1:直接是元, 2:%)
  //         levelLimit: coupon.levelLimit, // Lv. 以上
  //         limitLevelType: coupon.limitLevelType,
  //         limitRange: coupon.limitRange, // 0: 新手, 1:老手
  //         styleClass: (coupon.couponStatus === 0 ? 'no' : _.findWhere(couponConfig, {
  //           couponType: coupon.couponType,
  //         }).styleClass),
  //         lastNum: (_.isNull(coupon.maxNum) ||
  //         _.isUndefined(coupon.maxNum)) ?
  //           null :
  //           _(coupon.maxNum).sub(coupon.useNum),
  //       })
  //     }
  //
  //   }).join('')
  //   // self.$systemCoupon.html(couponHtml)
  // },

  // renderMyCoupon(couponList) {
  //   const self = this
  //   const couponHtml = _.map(couponList, (coupon) => {
  //     return self.couponTpl({
  //       from: 1, // 1 我的优惠券 0 优惠券兑换
  //       couponStatus: coupon.couponStatus || coupon.status || 0, // 0:即将开始, 1:可兑换, 2:已兑换, 3:已抢完
  //       couponId: coupon.couponId,
  //       couponType: coupon.couponType,
  //       // 1充值 blue-green 2加奖 green 3补贴 purple 4返水 blue 5代金 yellow 6现金 red
  //       couponName: _.findWhere(couponConfig, {
  //         couponType: coupon.couponType,
  //       }).name,
  //       couponToken: coupon.couponToken,
  //       couponDesc: coupon.couponDesc,
  //       couponDetailDesc: coupon.couponDetailDesc.replace('\n', '<br>'),
  //       requireIntegral: _(coupon.requireIntegral).formatDiv(10000, {
  //         fixed: 2,
  //         clear: true,
  //       }),
  //       validStartDate: _(coupon.validStartDate).toTime('YYYY.MM.DD HH:mm'),
  //       validEndDate: _(coupon.validEndDate).toTime('YYYY.MM.DD HH:mm'),
  //       bigShowNum: _(coupon.bigShowNum).formatDiv(coupon.couponBonusType === 1 ? 10000 : 100),
  //       couponBonusType: coupon.couponBonusType, // 返利类型 (1:直接是元, 2:%)
  //       levelLimit: coupon.levelLimit, // Lv. 以上
  //       limitLevelType: coupon.limitLevelType,
  //       limitRange: coupon.limitRange, // 0: 新手, 1:老手
  //       styleClass: (coupon.status === 0 ? 'no' : _.findWhere(couponConfig, {
  //         couponType: coupon.couponType,
  //       }).styleClass),
  //       lastNum: (_.isNull(coupon.maxNum) ||
  //       _.isUndefined(coupon.maxNum)) ?
  //         null :
  //         _(coupon.maxNum).sub(coupon.useNum),
  //     })
  //   }).join('')
  //   // self.$myCoupon.html(`${couponHtml}<div class="text-center"><a href="/" class="recent-more">更多记录 ></a></div>`)
  //   self.$myCoupon.html(`${couponHtml}`)
  // },
  // renderSystemCoupon(couponList) {
  //   const self = this
  //   const couponHtml = _.map(couponList, (coupon) => {
  //     return self.couponTpl({
  //       from: 1, // 1 我的优惠券 0 优惠券兑换
  //       couponStatus: coupon.couponStatus || coupon.status || 0, // 0:未使用, 1:已使用, 2:已过
  //       couponId: coupon.couponId,
  //       couponType: coupon.couponType,
  //       // 1充值 blue-green 2加奖 green 3补贴 purple 4返水 blue 5代金 yellow 6现金 red
  //       couponName: _.findWhere(couponConfig, {
  //         couponType: coupon.couponType,
  //       }).name,
  //       couponToken: coupon.couponToken,
  //       couponDesc: coupon.couponDesc,
  //       couponDetailDesc: coupon.couponDetailDesc.replace('\n', '<br>'),
  //       requireIntegral: _(coupon.requireIntegral).formatDiv(10000, {
  //         fixed: 2,
  //         clear: true,
  //       }),
  //       validStartDate: _(coupon.validStartDate).toTime('YYYY.MM.DD HH:mm'),
  //       validEndDate: _(coupon.validEndDate).toTime('YYYY.MM.DD HH:mm'),
  //       bigShowNum: _(coupon.bigShowNum).formatDiv(coupon.couponBonusType === 1 ? 10000 : 100),
  //       couponBonusType: coupon.couponBonusType, // 返利类型 (1:直接是元, 2:%)
  //       levelLimit: coupon.levelLimit, // Lv. 以上
  //       limitLevelType: coupon.limitLevelType,
  //       limitRange: coupon.limitRange, // 0: 新手, 1:老手
  //       styleClass: (coupon.couponStatus === 0 ? 'no' : _.findWhere(couponConfig, {
  //         couponType: coupon.couponType,
  //       }).styleClass),
  //       lastNum: (_.isNull(coupon.maxNum) ||
  //       _.isUndefined(coupon.maxNum)) ?
  //         null :
  //         _(coupon.maxNum).sub(coupon.useNum),
  //     })
  //   }).join('')
  //   self.$systemCoupon.html(couponHtml)
  // },
})

module.exports = CouponView
