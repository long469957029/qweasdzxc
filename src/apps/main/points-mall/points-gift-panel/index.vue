<template>
  <div class="points-gift-panel">
    <x-toolbar>
      <tool-cell type="dropdown" v-model="itemType" :options="itemTypeOps"></tool-cell>
      <tool-cell type="select-group" v-model="itemStatus" :options="itemStatusOps" title="兑换状态"></tool-cell>
      <tool-cell type="sort" v-model="sort" :options="sortOps" title="排序"></tool-cell>
    </x-toolbar>
    <status-cell class="points-gift-main" :has-data="giftList.length" :status="loadingStatus">
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
    </status-cell>
    <x-pagination :page-size="12" :total-size="totalSize" v-model="pageIndex"></x-pagination>

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
                      @modal-hidden="isShowAddressModal = false"
                      @address-selected="exchange"
      ></points-address>
    </div>
  </div>
</template>

<script>
  import {getGiftListApi, giftExchangeConfirmApi, giftExchangeApi} from 'api/points'

  import {XPagination, XToolbar, ToolCell} from 'build'

  import PointsAddress from '../points-address'
  import GiftCard from './gift-card'

  export default {
    name: 'points-gift-panel',

    components: {
      GiftCard,
      PointsAddress,
      XPagination,
      XToolbar,
      ToolCell
    },

    data() {
      return {
        itemType: '',
        itemTypeOps: [{
          id: '',
          name: '全部类型',
        }, {
          id: 1,
          name: '电子产品',
        }, {
          id: 2,
          name: '汽车',
        }, {
          id: 3,
          name: '生活用品',
        }, {
          id: 4,
          name: '定制珍藏品',
        }],
        itemStatus: '',
        itemStatusOps: [
          {
            id: '',
            name: '全部',
          },
          {
            id: 1,
            name: '有货',
          },
          {
            id: 2,
            name: '我可兑换的',
          },
        ],

        sort: {
          sortFlag:1,
          sortType:0,
        },
        sortOps: [
          {
            sortFlag: 1,
            name: '热门',
            sortType: 0,
            type: 'arrow',
          },
          {
            sortFlag: 2,
            name: '所需积分',
            type: 'sort',
          },
          {
            sortFlag: 3,
            name: '上架时间',
            sortType: 0,
            type: 'arrow',
          },
        ],

        totalSize: 0,
        pageIndex: 0,
        loadingStatus: 'loading',
        giftList: [],
        isShowExchangeModal: false,
        isShowAddressModal: false,
        currentGift: {},
        //兑换数量
        count: 1,
        addressModalType: 'select',
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

    watch: {
      sort() {
        this.pageIndex = 0
        this.getData()
      },
      itemType() {
        this.pageIndex = 0
        this.getData()
      },
      itemStatus() {
        this.pageIndex = 0
        this.getData()
      },
      pageIndex() {
        this.getData()
      }
    },

    methods: {
      getData() {
        this.loadingStatus = 'loading'
        getGiftListApi({
          sortFlag: this.sort.sortFlag,
          sortType: this.sort.sortType,
          itemType: this.itemType,
          itemStatus: this.itemStatus,
          pageIndex: this.pageIndex,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.giftList = data.root.records
            this.totalSize = data.root.rowCount
          }
        })
          .finally(() => {
            this.loadingStatus = 'completed'
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

      exchange(addressInfo) {
        giftExchangeApi({
          itemId: this.currentGift.itemId,
          count: this.count,
          addressId: addressInfo.rid,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.isShowAddressModal = false
            this.isShowExchangeModal = false
            this.$store.dispatch(types.GET_USER_MALL_INFO)

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
    /*min-height: 570px;*/
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

  .x-toolbar {
    padding: 30px 30px 40px;
  }
</style>
