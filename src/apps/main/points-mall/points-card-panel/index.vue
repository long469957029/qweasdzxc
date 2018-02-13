<template>
  <div class="points-card-panel">
    <div class="search-bar">搜索栏</div>
    <div class="points-card-main">
      <points-card v-for="item in cardList" :key="item.couponId"
                   :coupon-type="item.couponType"
                   :limit-level-type="item.limitLevelType"
                   :levelLimit="item.levelLimit"
                   :max-num="item.maxNum"
                   :use-num="item.useNum"
                   :require-integral="item.requireIntegral"
                   :sys-time="item.sysTime"
                   :valid-start-date="item.validStartDate"
                   :valid-end-date="item.validEndDate"
                   :current-date="item.currentDate"
      ></points-card>
    </div>
  </div>
</template>

<script>
  import {PointsCard} from 'build'

  import {getCouponListApi} from 'api/points'

  export default {
    name: 'points-card-panel',

    components: {
      PointsCard
    },

    mounted() {
      getCouponListApi({
        sortFlag: 3,
        sortType: 1,
      }, ({data}) => {
        if (data && data.result === 0) {
          this.cardList = data.root.records
          this.rowCount = data.root.rowCount
        }
      })
    },

    data() {
      return {
        rowCount: 0,
        cardList: []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .points-card-main {
    display: flex;
    flex-flow: row wrap;
    align-content: space-between;
    height: 570px;
    padding-bottom: 80px;
  }
  .points-card {
    padding-right: 26px;
    &:nth-of-type(4n) {
      padding-right: 0;
    }
  }
</style>
