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
                 @exchange="openExchangeModal(gift)"
      ></gift-card>
    </div>
    <x-pagination :page-size="12" :total-size="totalSize" @page-change="getData"></x-pagination>

    <div v-transfer-dom>
      <x-dialog v-if="isShowExchangeModal" @modal-hidden="isShowExchangeModal = false">
        <div slot="head-main" class="text-center">兑换确认</div>
        <div class="modal-main">
          <div class="gift-main">
            <div class="gift-icon">
              <img :src="currentGift.picUrl" />
            </div>
            <div class="gift-right">
              <div class="gift-title">{{currentGift.itemName}}</div>
              <div class="gift-price">参考价：<span class="text-prominent">{{currentGift.refPrice | convert2yuan}}</span></div>
              <div class="gift-num">
                <div class="gift-num-title">兑换数量：</div>
                <div class="gift-range" ref="numRange"></div>
              </div>
            </div>
          </div>
          <div class="card-brief">
            本次兑换将花费 <animated-integer class="text-prominent" :value="actualRequireIntegral"></animated-integer> 积分
            <template v-if="mallBasicInfo.fCurrentDiscount < 10">
              （享{{mallBasicInfo.fCurrentDiscount}}折优惠）
            </template>
          </div>
          <div class="btn-panel">
            <button class="btn confirm-btn" @click="prepareExchange">确定</button>
          </div>
        </div>
      </x-dialog>
    </div>

    <div v-transfer-dom>
      <points-address v-if="isShowAddressModal" type="select"
                      @operate-complete="refresh" @modal-hidden="isShowAddressModal = false"
                      @address-selected="exchangeCoupon"
      ></points-address>
    </div>
  </div>
</template>

<script>
  import {getGiftListApi, giftExchangeConfirmApi, giftExchangeApi} from 'api/points'

  import {XPagination} from 'build'

  import PointsAddress from '../points-address'
  import GiftCard from './gift-card'

  export default {
    name: 'points-gift-panel',

    components: {
      GiftCard,
      PointsAddress,
      XPagination,
    },

    data() {
      return {
        totalSize: 0,
        giftList: [],
        isShowExchangeModal: false,
        isShowAddressModal: false,
        currentGift: {},
        //兑换数量
        count: 1,
        addressModalType: 'select'
      }
    },

    computed: {
      actualRequireIntegral() {
        return Number(_.chain(this.currentGift.requireIntegral).mul(this.mallBasicInfo.fCurrentDiscount).mul(this.count).formatDiv(100000, {fixed: 0}).value())
      },
      ...mapGetters([
        'mallBasicInfo'
      ])
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
      },

      openExchangeModal(giftInfo) {
        this.currentGift = giftInfo
        this.isShowExchangeModal = true
        this.count = 1
        this.$nextTick(() => {
          $(this.$refs.numRange).numRange({
            min: 1,
            max: giftInfo.maxNum ? giftInfo.maxNum - giftInfo.useNum : 9999,
            onChange: (num) => {
              this.count = num
            },
          })
        })
      },

      /**
       * 1.确认当前是否可以兑换
       * 2.确认收货地址，没有则先进行添加
       */
      prepareExchange() {
        giftExchangeConfirmApi({
          itemId: this.currentGift.itemId,
          count: this.count,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.isShowAddressModal = true
          } else {
            Global.ui.notification.show(data.msg)
          }
        })
      },

      exchangeCoupon(addressInfo) {
        giftExchangeApi({
          itemId: this.currentGift.itemId,
          count: this.count,
          address: addressInfo,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.isShowAddressModal = false
            this.isShowExchangeModal = false
            this.$store.dispatch(types.GET_USER_MALL_INFO)
            //todo 在当前页刷新
            this.getData()

            Global.ui.notification.show(`<div class="m-bottom-lg">兑换成功!</div>`, {
              type: 'success',
              hasFooter: false,
              displayTime: 1000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })
          } else {
            Global.ui.notification.show(data.msg)
          }
        })
      },

      refresh() {

      }
    },

    mounted() {
      this.getData()
    },
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


  .modal-main {
    width: 480px;
  }

  .gift-icon {
    width: 94px;
    height: 99px;
    margin-right: 40px;
  }

  .gift-right {
    font-size: 14px;
    color: #333333;
  }

  .gift-main {
    display: flex;
    justify-content: center;
    margin: 39px 0 20px;
  }

  .gift-title {
    margin-bottom: 8px;
  }

  .gift-price {
    margin-bottom: 15px;
  }

  .gift-num {
    display: flex;
    align-items: center;
  }

  .card-brief {
    font-size: 14px;
    text-align: center;
    color: #666666;
    margin-bottom: 20px;
  }

  .confirm-btn {
    width: 108px;
    height: 36px;
    background-color: #14b1bb;
    border-radius: 3px;
    border: solid 1px #13a6af;
  }

  .btn-panel {
    text-align: center;
    margin-bottom: 30px;
  }
</style>
