<template>
  <div class="points-card-panel">
    <x-toolbar>
      <tool-cell type="dropdown" v-model="couponType" :options="typeOps"></tool-cell>
      <tool-cell type="select-group" v-model="couponStatus" :options="statusOps" title="兑换状态"></tool-cell>
      <tool-cell type="sort" v-model="sort" :options="sortOps" title="排序"></tool-cell>
    </x-toolbar>
    <status-cell :has-data="cardList.length" :status="loadingStatus">
      <div class="points-card-main">
        <points-card v-for="(item, index) in cardList" :key="index"
                     :coupon-info="item"
                     @exchange="openExchangeModal(arguments[0], item)"
        ></points-card>
      </div>
      <x-pagination :page-size="12" :total-size="totalSize" v-model="pageIndex"></x-pagination>
    </status-cell>
    <div class="points-tip">
      <div class="tip-title">优惠券说明</div>
      <ul class="tip-main">
        <li>1、每个优惠券都相当于是一个活动，领取优惠券即表示开始参加活动，活动计算周期为券领取时间至券有效期截止时间</li>
        <li>2、返利方式为满返类的优惠券（如投注满XX元即返），在完成返利条件后及时发放奖励至账户</li>
        <li>3、返利方式为按比奖返的优惠券（如按投注额X%比例返），最迟会在截止日期第二天的凌晨2点统计发放奖励至账户</li>
        <li>4、代金券在满足条件时可用于抵减对应彩种的投注额，代金券兑换成功即可在对应彩种的投注界面勾选使用</li>
        <li>5、现金券兑换成功即直接加币至平台账户</li>
      </ul>
    </div>

    <div v-transfer-dom>
      <x-dialog v-if="isShowGetCard" @modal-hidden="isShowGetCard = false" width="482px">
        <div slot="head-main" class="text-center">兑换确认</div>
        <div class="modal-main">
          <div class="card-info">
            <div class="card-title">{{formatCouponInfo.couponName}}</div>
            <template v-if="formatCouponInfo.secondDesc">
              <div class="card-cell">
              <span class="card-cell-title">
                返利游戏：
              </span>
                <span class="card-cell-val">
                <span class="text-prominent">{{formatCouponInfo.mainDesc}}</span>
              </span>
              </div>
              <div class="card-cell">
              <span class="card-cell-title">
                返利条件：
              </span>
                <template v-if="formatCouponInfo.conditionType === 2">
                <span class="card-cell-val">
                  按{{formatCouponInfo.zhType}}额<span class="text-prominent">{{formatCouponInfo.conditionNumber}}</span>%比例返
                </span>
                </template>
                <template v-else>
                  {{formatCouponInfo.zhType}}满<span class="text-prominent">{{formatCouponInfo.conditionNumber}}</span>元即返
                  <span class="text-prominent">{{formatCouponInfo.bigShowNum}}</span>元</span>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="card-cell">
                <span class="card-cell-val">
                <span class="text-prominent">{{formatCouponInfo.mainDesc}}</span>
              </span>
              </div>
            </template>
          </div>
          <div class="card-brief">
            本次兑换将花费 <span class="text-prominent">{{actualRequireIntegral}}</span> 积分
            <template v-if="mallBasicInfo.fCurrentDiscount < 10">
              （享{{mallBasicInfo.fCurrentDiscount}}折优惠）
            </template>
          </div>
          <div class="btn-panel">
            <button class="btn confirm-btn" @click="exchangeCoupon">确定</button>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {PointsCard, XPagination, XToolbar, ToolCell} from 'build'

  import {getCouponListApi, exchangeCouponListApi} from 'api/points'

  const CARD_TYPE = [
    {
      id: '',
      name: '全部券类型',
    },
    {
      id: 1,
      name: '充值券',
      type: 'blue'
    },
    {
      id: 2,
      name: '加奖券',
      type: 'green'
    },
    {
      id: 3,
      name: '补贴券',
      type: 'green'
    },
    {
      id: 4,
      name: '返水券',
      type: 'green'
    },
    {
      id: 5,
      name: '代金券',
      type: 'gold'
    },
    {
      id: 6,
      name: '现金券',
      type: 'red'
    },
  ]

  export default {
    name: 'points-card-panel',

    components: {
      ToolCell,
      XToolbar,
      PointsCard,
      XPagination,
    },

    data() {
      return {
        couponType: '',
        typeOps: CARD_TYPE,
        couponStatus: '',
        statusOps: [
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
          sortFlag: 3,
          sortType: 1
        },
        sortOps: [
          {
            sortFlag: 1,
            name: '热门',
            sortType: 1,
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
            sortType: 1,
            type: 'arrow',
          },
        ],
        pageIndex: 0,
        loadingStatus: 'loading',

        totalSize: 0,
        currentCardInfo: {},
        formatCouponInfo: {},
        isShowGetCard: false,
        cardList: []
      }
    },

    computed: {
      actualRequireIntegral() {
        return _.chain(this.currentCardInfo.requireIntegral).mul(this.mallBasicInfo.fCurrentDiscount).convert2Point().value()
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
      couponType() {
        this.pageIndex = 0
        this.getData()
      },
      couponStatus() {
        this.pageIndex = 0
        this.getData()
      },
      pageIndex() {
        this.getData()
      }
    },

    methods: {
      getData({loading = true} = {loading: true}) {
        if (loading) {
          this.loadingStatus = 'loading'
        }
        getCouponListApi({
          sortFlag: this.sort.sortFlag,
          sortType: this.sort.sortType,
          couponType: this.couponType,
          couponStatus: this.couponStatus,
          pageIndex: this.pageIndex,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.cardList = data.root.records
            this.totalSize = data.root.rowCount
          }
        })
          .finally(() => {
            if (loading) {
              this.loadingStatus = 'completed'
            }
          })
      },
      exchangeCoupon() {
        exchangeCouponListApi({
          couponId: this.currentCardInfo.couponId,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.isShowGetCard = false
            Global.ui.notification.show('<div class="m-bottom-lg">兑换成功!</div>', {
              type: 'success',
              hasFooter: false,
              displayTime: 1000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })

            this.getData({loading: false})

            this.$store.dispatch(types.GET_USER_MALL_INFO)
          } else {
            if (data.msg.includes('抢光')) {
              Global.ui.notification.show('该优惠券已被抢光')
            } else {
              Global.ui.notification.show(data.msg)
            }
            this.isShowGetCard = false
          }
        }, () => {
          this.isShowGetCard = false
        })
      },

      openExchangeModal(formatCouponInfo, cardInfo) {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进行此操作，请先注册正式游戏账号',{modalDialogShadow:'modal-dialog-shadow'})
          return false
        }
        this.formatCouponInfo = formatCouponInfo
        this.currentCardInfo = cardInfo
        this.isShowGetCard = true
      }
    },

    mounted() {
      this.getData()
    },
  }
</script>

<style lang="scss" scoped>
  .points-card-main {
    display: flex;
    flex-flow: row wrap;
    padding-bottom: 40px;
  }

  .points-card-wrapper {
    margin-right: 26px;
    margin-bottom: 40px;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
  }

  .points-tip {
    margin-top: 85px;
  }

  .tip-title {
    font-size: 30px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    line-height: 30px;
    position: relative;

    &:after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 51px;
      height: 3px;
      background-color: #14b1bb;
    }
  }

  .tip-main {
    margin-left: 22px;
    margin-bottom: 80px;
    li {
      font-size: 14px;
      line-height: 35px;
      color: #666666;
    }
  }

  .modal-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
  }

  .card-info {
    box-sizing: border-box;
    padding: 20px 23px;
    margin-bottom: 20px;
    min-width: 275px;
    height: 110px;
    background-color: #f8f8f8;
    border-radius: 5px;
  }

  .card-title {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333333;
  }

  .card-cell-title {
    line-height: 25px;
  }

  .card-brief {
    color: #666666;
    font-size: 14px;
    margin-bottom: 20px;
  }

  button.btn.confirm-btn {
    width: 108px;
    height: 36px;
    background-color: #14b1bb;
    border-radius: 3px;
    border: solid 1px #13a6af;
  }

  .card-cell {
    font-size: 14px;
  }

  .x-toolbar {
    padding: 30px 30px 40px;
  }

</style>
