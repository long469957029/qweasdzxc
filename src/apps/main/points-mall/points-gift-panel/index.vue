<template>
  <div class="points-gift-panel">
    <div class="search-bar">搜索栏</div>
    <div class="points-gift-main">
      <gift-card v-for="(gift, index) in giftList" :key="index"
                 :itemDesc="gift.itemDesc"
                 :itemName="gift.itemName"
                 :limit-level-type="gift.limitLevelType"
                 :levelLimit="gift.levelLimit"
                 :picUrl="gift.picUrl"
                 :refPrice="gift.refPrice"
                 :requireIntegral="gift.requireIntegral"
                 :useNum="gift.useNum"
                 :maxNum="gift.maxNum"
      ></gift-card>
    </div>
    <x-pagination :page-size="12" :total-size="totalSize" @page-change="getData"></x-pagination>
  </div>
</template>

<script>
  import {getGiftListApi} from 'api/points'

  import {XPagination} from 'build'

  import GiftCard from './gift-card'

  export default {
    name: 'points-gift-panel',

    components: {
      GiftCard,
      XPagination
    },

    methods: {
      getData({pageIndex = 0} = {pageIndex: 0}) {
        getGiftListApi({
          sortFlag: 3,
          sortType: 1,
          pageIndex,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.giftList = data.root.records
            this.totalSize = data.root.rowCount
          }
        })
      }
    },

    mounted() {
      this.getData()
    },

    data() {
      return {
        totalSize: 0,
        giftList: []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .points-gift-panel {
    margin-bottom: 80px;
  }
  .points-gift-main {
    display: flex;
    flex-flow: row wrap;
    align-content: space-between;
    min-height: 570px;
    padding-bottom: 80px;
  }

  .gift-card {
    margin-right: 24px;
    margin-bottom: 23px;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
  }
</style>
