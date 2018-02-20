<template>
  <div class="points-card-panel">
    <div class="search-bar">搜索栏</div>
    <div class="points-card-main">
      <points-card v-for="(item, index) in cardList" :key="index"
                   :coupon-info="item"
                   @exchange="openExchangeModal(arguments[0], item)"
      ></points-card>
    </div>
    <x-pagination :page-size="12" :total-size="totalSize" @page-change="getData"></x-pagination>
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
        <div slot="head-main">兑换确认</div>
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
  import {PointsCard, XPagination, formatCoupon} from 'build'

  import {getCouponListApi, exchangeCouponListApi} from 'api/points'

  export default {
    name: 'points-card-panel',

    components: {
      PointsCard,
      XPagination,
    },

    data() {
      return {
        totalSize: 0,
        currentCardInfo: {},
        formatCouponInfo: {},
        isShowGetCard: false,
        cardList: []
      }
    },

    computed: {
      actualRequireIntegral() {
        return _.chain(this.currentCardInfo.requireIntegral).mul(this.mallBasicInfo.fCurrentDiscount).formatDiv(100000, {fixed: 0}).value()
      },
      ...mapGetters([
        'mallBasicInfo'
      ])
    },

    methods: {
      getData({pageIndex = 0} = {pageIndex: 0}) {
        getCouponListApi({
          sortFlag: 3,
          sortType: 1,
          pageIndex,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.cardList = data.root.records
            this.totalSize = data.root.rowCount
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
          } else {
            if (data.msg.includes('抢光')) {
              Global.ui.notification.show('该优惠券已被抢光')
            } else {
              Global.ui.notification.show(data.msg)
            }
          }
        }, () => {
          this.isShowGetCard = false
        })
      },

      openExchangeModal(formatCouponInfo, cardInfo) {
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
    padding-bottom: 80px;
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
</style>
