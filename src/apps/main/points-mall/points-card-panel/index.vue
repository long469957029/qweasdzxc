<template>
  <div class="points-card-panel">
    <div class="search-bar">搜索栏</div>
    <div class="points-card-main">
      <points-card v-for="item in cardList" :key="item.couponId"
                   :coupon-type="item.couponType"
                   :limit-level-type="item.limitLevelType"
                   :max-num="item.maxNum"
                   :use-num="item.useNum"
                   :require-integral="item.requireIntegral"
                   :valid-start-date="item.validStartDate"
                   :valid-end-date="item.validEndDate"
                   :current-date="item.currentDate"
      ></points-card>
    </div>
  </div>
</template>

<script>
  import {PointsCard} from 'build'

  export default {
    name: 'points-card-panel',

    components: {
      PointsCard
    },

    data() {
      return {
        rowCount: 11,
        cardList: [{
          "couponId": 2616,
          "createDate": 1518418948931,
          "couponToken": "CP20180212150230Z4VY",
          "couponType": 5,
          "couponDesc": "腾讯分分彩  2元",
          "validStartDate": 1518418800000,
          "validEndDate": 1518451200000,
          "currentDate": 1518451200000,
          "requireIntegral": 300000,
          "maxNum": 10,
          "useNum": 10,
          "onStartDate": 1518418800000,
          "onEndDate": 4102416000000,
          "couponStatus": 3,
          "bigShowNum": 20000,
          "couponBonusType": 1,
          "couponDetailDesc": "返利游戏：腾讯分分彩\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 2,
          "limitRange": null,
          "name": "代金券",
          "canGive": false
        }, {
          "couponId": 2610,
          "createDate": 1518408380174,
          "couponToken": "CP20180212120630Y69B",
          "couponType": 5,
          "couponDesc": "无限分分彩  2元",
          "validStartDate": 1518411600000,
          "validEndDate": 1518451200000,
          "currentDate": 1518451400000,
          "requireIntegral": 300000,
          "maxNum": 100,
          "useNum": 84,
          "onStartDate": 1518408000000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 20000,
          "couponBonusType": 1,
          "couponDetailDesc": "返利游戏：无限分分彩\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "代金券",
          "canGive": false
        }, {
          "couponId": 2609,
          "createDate": 1518408269390,
          "couponToken": "CP20180212120430Y5RU",
          "couponType": 5,
          "couponDesc": "QQ30秒  2元",
          "validStartDate": 1518404400000,
          "validEndDate": 1518451200000,
          "requireIntegral": 300000,
          "maxNum": 100,
          "useNum": 96,
          "onStartDate": 1518400800000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 20000,
          "couponBonusType": 1,
          "couponDetailDesc": "返利游戏：QQ30秒\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "代金券",
          "canGive": false
        }, {
          "couponId": 2607,
          "createDate": 1518253592624,
          "couponToken": "CP20180210170630QKG1",
          "couponType": 1,
          "couponDesc": "充值满2999元即返",
          "validStartDate": 1518372000000,
          "validEndDate": 1518458400000,
          "requireIntegral": 390000,
          "maxNum": null,
          "useNum": 39,
          "onStartDate": 1518372110000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 180000,
          "couponBonusType": 1,
          "couponDetailDesc": "不限游戏，不限范围",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "充值券",
          "canGive": false
        }, {
          "couponId": 2606,
          "createDate": 1518253558340,
          "couponToken": "CP20180210170530QKD4",
          "couponType": 2,
          "couponDesc": "中奖满2999元即返",
          "validStartDate": 1518372000000,
          "validEndDate": 1518458400000,
          "requireIntegral": 390000,
          "maxNum": null,
          "useNum": 47,
          "onStartDate": 1518372085000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 180000,
          "couponBonusType": 1,
          "couponDetailDesc": "返利游戏：所有彩票\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "加奖券",
          "canGive": false
        }, {
          "couponId": 2605,
          "createDate": 1518253537871,
          "couponToken": "CP20180210170530QKBR",
          "couponType": 3,
          "couponDesc": "亏损满2999元即返",
          "validStartDate": 1518372000000,
          "validEndDate": 1518458400000,
          "requireIntegral": 390000,
          "maxNum": null,
          "useNum": 23,
          "onStartDate": 1518372082000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 180000,
          "couponBonusType": 1,
          "couponDetailDesc": "返利游戏：所有彩票\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "补贴券",
          "canGive": false
        }, {
          "couponId": 2604,
          "createDate": 1518253508125,
          "couponToken": "CP20180210170530QKA4",
          "couponType": 4,
          "couponDesc": "投注满2999元即返",
          "validStartDate": 1518372000000,
          "validEndDate": 1518458400000,
          "requireIntegral": 390000,
          "maxNum": 42,
          "useNum": 42,
          "onStartDate": 1518372073000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 180000,
          "couponBonusType": 1,
          "couponDetailDesc": "返利游戏：所有彩票\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "返水券",
          "canGive": false
        }, {
          "couponId": 2603,
          "createDate": 1518253484017,
          "couponToken": "CP20180210170430QK7T",
          "couponType": 4,
          "couponDesc": "按投注额0.8%返",
          "validStartDate": 1518372000000,
          "validEndDate": 1518458400000,
          "requireIntegral": 390000,
          "maxNum": null,
          "useNum": 9,
          "onStartDate": 1518372069000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 80,
          "couponBonusType": 2,
          "couponDetailDesc": "返利游戏：彩票外游戏\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "返水券",
          "canGive": false
        }, {
          "couponId": 2602,
          "createDate": 1518253448003,
          "couponToken": "CP20180210170430QK5S",
          "couponType": 5,
          "couponDesc": "QQ30秒  10元",
          "validStartDate": 1518372000000,
          "validEndDate": 1518458400000,
          "requireIntegral": 1990000,
          "maxNum": 80,
          "useNum": 45,
          "onStartDate": 1518372063000,
          "onEndDate": 4102416000000,
          "couponStatus": 1,
          "bigShowNum": 100000,
          "couponBonusType": 1,
          "couponDetailDesc": "返利游戏：QQ30秒\n返利范围：全平台",
          "levelLimit": null,
          "limitLevelType": 0,
          "limitRange": null,
          "name": "代金券",
          "canGive": false
        }]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .points-card-main {
    display: flex;
    flex-flow: row wrap;
    align-content: space-between;
    justify-content: space-between;
    height: 570px;
    padding-bottom: 80px;
  }
</style>
