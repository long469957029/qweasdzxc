<template>
  <!--<div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="novicePackageModal">-->
  <!--<div v-transfer-dom>-->
  <!--<x-dialog v-model="novicePackageModal">-->
  <!--<div class="x-modal-novicePackage" v-if="novicePackageModal" slot="all">-->
  <!--<div class="modal-dialog modal-novicePackage">-->
  <div>
    <div class="novice-header">
      <a class="btn-close btn-np" data-dismiss="modal" @click="closeDialog"></a>
    </div>
    <div class="novice-body">
      <div class="novice-item">
        <div class="item-num">01
        </div>
        <div class="novice-item-panel">
          <div class="novice-item-panel-header">
          </div>
          <div class="novice-item-panel-body">
            <div class="item-panel-body">
              <div class="panel-header">
                <span class="header-text1">¥</span>
                <span class="header-text2">{{couponsAmount}}</span>
                <span class="header-text3">代金券</span>
              </div>
              <div class="panel-content">
                <div class="panel-content-coupons" :class="{first:index===0,second:index===1}"
                     v-for="(item,index) in couponsList">
                  <div class="coupons-text1">{{item.ticketName}}</div>
                  <div class="panel-content-coupons-value">
                    <span class="coupons-text2">¥</span>
                    <span class="coupons-text3">{{_(item.amount).formatDiv(10000)}}</span>
                  </div>
                </div>
              </div>
              <div class="panel-footer" @click="reviceCoupons">立即领取</div>
            </div>
          </div>
        </div>
        <div class="novice-item-recived-panel" v-if="couponsStatus===1">
          <div class="empty-left"></div>
          <div class="empty-right"></div>
          <div class="novice-item-recived-body">
          </div>
        </div>
      </div>
      <div class="novice-item">
        <div class="item-num">02
        </div>
        <div class="novice-item-panel">
          <div class="novice-item-panel-header">
          </div>
          <div class="novice-item-panel-body">
            <div class="item-panel-body">
              <div class="panel-header">
                <span class="header-text1">¥</span>
                <span class="header-text2">{{rechargeBonus}}</span>
                <span class="header-text3">首充奖励</span>
              </div>
              <div class="panel-content">
                <div class="panel-content-img-panel">
                  <div class="panel-content-img recharge"></div>
                </div>
                <div class="panel-content-text-panel">
                  <div class="panel-content-text">首次充值任意金额即可返<span
                    class="panel-content-text red">{{rechargeBonus}}元，</span></div>
                  <div class="panel-content-text">该奖励自首次登录之日起</div>
                  <div class="panel-content-text"><span class="panel-content-text red">3天</span>内有效</div>
                </div>
              </div>
              <div class="js-header-recharge panel-footer" @click="closeDialog">立即充值</div>
            </div>
          </div>
        </div>
        <div class="novice-item-recived-panel" v-if="rechargeStatus===1">
          <div class="empty-left"></div>
          <div class="empty-right"></div>
          <div class="novice-item-recived-body">

          </div>
        </div>
      </div>
      <div class="novice-item">
        <div class="item-num">03
        </div>
        <div class="novice-item-panel">
          <div class="novice-item-panel-header">
          </div>
          <div class="novice-item-panel-body">
            <div class="item-panel-body">
              <div class="panel-header">
                <span class="header-text2">{{betLimit}}</span>
                <span class="header-text1">%</span>
                <span class="header-text3">投注返水</span>
              </div>
              <div class="panel-content">
                <div class="panel-content-img-panel">
                  <div class="panel-content-img bet"></div>
                </div>
                <div class="panel-content-text-panel">
                  <div class="panel-content-text">自首次登录之日起<span class="panel-content-text red">3天</span>内的投注</div>
                  <div class="panel-content-text">额，平台将按<span class="panel-content-text red">{{betLimit}}%</span>的比例
                  </div>
                  <div class="panel-content-text">结算奖励（仅计算彩票投注）</div>
                </div>
              </div>
              <div class="panel-footer"><a href="#/bc/0/19" @click="closeDialog">立即投注</a></div>
            </div>
          </div>
        </div>
        <div class="novice-item-recived-panel" v-if="betStatus===1">
          <div class="empty-left"></div>
          <div class="empty-right"></div>
          <div class="novice-item-recived-body">
          </div>
        </div>
      </div>
      <div class="novice-item">
        <div class="item-num">04
        </div>
        <div class="novice-item-panel">
          <div class="novice-item-panel-header">
          </div>
          <div class="novice-item-panel-body">
            <div class="item-panel-body">
              <div class="panel-header">
                <span class="header-text1">¥</span>
                <span class="header-text2">{{bindBonus}}</span>
                <span class="header-text3">额外奖励</span>
              </div>
              <div class="panel-content">
                <div class="panel-content-img-panel">
                  <div class="panel-content-img add"></div>
                </div>
                <div class="panel-content-text-panel">
                  <div class="panel-content-text">1、手机号码认证：<span
                    class="panel-content-text red">奖励{{phoneBonus}}元</span></div>
                  <div class="panel-content-text">2、电子邮箱认证：<span
                    class="panel-content-text red">奖励{{emailBonus}}元</span></div>
                  <div class="panel-content-text">3、绑定银行卡：<span
                    class="panel-content-text red">奖励{{cardBonus}}元</span>
                  </div>
                  <div class="panel-content-text">注：完成首充24小时内发放</div>
                </div>
              </div>
              <div class="panel-footer" @click="closeDialog"><a href="#/uc/pl" @click="closeDialog">去完善资料</a></div>
            </div>
          </div>
        </div>
        <div class="novice-item-recived-panel" v-if="bindStatus===1">
          <div class="empty-left"></div>
          <div class="empty-right"></div>
          <div class="novice-item-recived-body">
          </div>
        </div>
      </div>
    </div>
    <div class="novice-footer"></div>
    <!--</div>-->
    <!--</x-dialog>-->
    <!--</div>-->
  </div>
</template>
<script>
  import activityInfo from 'api/activity'

  export default {
    name: 'novice-package',

    data() {
      return {
        couponsList: [],
        couponsAmount: 0,
        rechargeBonus: 0,
        betLimit: 0,
        phoneBonus: 0,
        emailBonus: 0,
        cardBonus: 0,
        bindBonus: 0,
        couponsStatus: 0,
        rechargeStatus: 0,
        betStatus: 0,
        bindStatus: 0,


        userId: Global.memoryCache.get('acctInfo').userId,
        localStorage: new Base.Storage({
          name: 'appstorage',
          type: 'local',
        }),
        data: '',
        novicePackageModal: false,
      }
    },

    props: {
//      needCallBack: {   // 用户首次登录的时候  关闭弹窗 需要回调父级
//        type: Boolean,
//        default: false
//      },

    },

    components: {},

    mounted() {
      this.getActivityData()
    },

    watch: {
//      novicePackageStatus(){
//        if (this.novicePackageStatus) {
//          this.novicePackageModal = true
//        }
//      },
//      novicePackageStatus: {
//        handler(){
//          if (this.novicePackageStatus && !this.novicePackageModal) {
//            this.openActivityDialog()
//          }
//        },
//        immediate: true
//      },
    },

    computed: {
      ...mapGetters([
        'novicePackageStatus'
      ])
    },

    filters: {},

    methods: {
      getActivityData() {
        activityInfo.getNovicePackageInfo(
          ({data}) => {
            if (data && data.result === 0) {
              // status:是否属于新手，0:已领取 1; 可领取  2:不展示
              if (data.root.status === 1 || data.root.status === 0) {
                // 活动相关，新手活动首次登录
                this.data = data
                this.openActivityDialog()
//                const hasShow = this.localStorage.get(this.userId + 'NovicePackageActivity')
//                if (!hasShow) {
//                  /** valid 是否首次登录,首次登录会自动弹出活动界面 */
//                  this.localStorage.set(this.userId + 'NovicePackageActivity', true)
//
//                }
              } else if (data.root.status === 2) {
                this.novicePackageModal = false
                this.$store.commit(types.TOGGLE_NOVICE_PACKAGE, false)
              }
            }
//            else {
//              if (e) {//通过点击事件调用时才弹窗，否则不用弹出消息
//                Global.ui.notification.show(data.msg, {
//                  modalDialogShadow: 'modal-dialog-shadow',
//                })
//              }
//              this.$emit('next')
//            }
          }
        )
      },
      openActivityDialog() {
        this.novicePackageModal = true
        this.initActivityData(this.data.root)
//          $(this.$refs.novicePackageModal).modal({
//            backdrop: 'static',
//          })
//            .on('hidden.modal', () => {
//              this.novicePackageModal = false
//              this.$store.commit(types.TOGGLE_NOVICE_PACKAGE, false)
//              if (this.needCallBack) {
//                this.$emit('next')
//              }
//            })
      },
      initActivityData(data) {
        let couponsHeight = data.itemList.length
        let coupons = []
        if (couponsHeight <= 2) {
          coupons = data.itemList.slice(0, couponsHeight)
        } else {
          coupons = data.itemList.slice(0, 2)
        }
        this.couponsList = coupons
        let couponsAmount = 0
        _(coupons).each((item) => {
          item.ticketName = ticketConfig.getById(item.ticketId).zhName
          couponsAmount = couponsAmount + item.amount
        })
        this.couponsAmount = _(couponsAmount).formatDiv(10000)
        this.rechargeBonus = _(data.rechargeAmount).formatDiv(10000)
        this.betLimit = _(data.betRate).formatDiv(10000)
        this.phoneBonus = _(data.bindPhoneBonus).formatDiv(10000)
        this.emailBonus = _(data.bindMailBonus).formatDiv(10000)
        this.cardBonus = _(data.bindBankCardBonus).formatDiv(10000)
        this.bindBonus = _(data.bindPhoneBonus + data.bindMailBonus + data.bindBankCardBonus).formatDiv(10000)
        this.rechargeStatus = data.rechargeStatus
        this.betStatus = data.betStatus
        this.bindStatus = data.bindStatus
        this.couponsStatus = data.couponStatus
      },
      reviceCoupons() {
        activityInfo.doNovicePackage(
          ({data}) => {
            if (data && data.result === 0) {
//              this.getActivityData(e)
              this.couponsStatus = 1
              Global.ui.notification.show('代金券领取成功！', {
                size: 'modal-dialog-shadow',
              })
            } else {
              Global.ui.notification.show(data.msg, {
                size: 'modal-dialog-shadow',
              })
            }
          })
      },
      closeDialog() {
//        this.novicePackageModal = false
        this.$store.commit(types.TOGGLE_NOVICE_PACKAGE, false)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .x-modal-novicePackage {
    z-index: 1050;
    border: 0;
    width: 979px;
    height: 625px;
    min-height: 621px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    position: relative;
    padding: 0;

    .novice-header {
      background: url('./misc/np-header.png');
      width: 980px;
      height: 179px;
      .btn-np {
        background: url('./misc/np-close.png');
        width: 35px;
        height: 35px;
        top: 17px;
        right: 20px;
        transition: transform .5s, -webkit-transform .5s;
        text-align: center;
        cursor: pointer;
        position: absolute;
        z-index: 2;
      }
    }
    .novice-body {
      padding: 0 34px;
      position: relative;
      z-index: 2;
      height: 442px;
      .novice-item {
        vertical-align: top;
        margin: 0 11px;
        text-align: center;
        display: inline-block;
        width: 200px;
        position: relative;
        .item-num {
          font-size: 28px;
          color: #dfd2bf;
          width: 60px;
          padding: 16px 0;
          border-bottom: 4px solid #e4dfd5;
          margin: 0 auto;
        }
        .novice-item-panel {
          margin-top: 23px;
          width: 200px;
          background: #ffffff;
          /*box-shadow: 0 4px 10px rgba(0, 0, 0, .1);*/
          .novice-item-panel-header {
            background: url('./misc/np-panel-header.png');
            width: 217px;
            margin-left: -8px;
            z-index: 1;
            position: relative;
            height: 50px;
          }
          .novice-item-panel-body {
            height: 270px;
            box-shadow: 0 0px 15px rgba(0, 0, 0, .2);
            margin-top: -2px;
            width: 201px;
            bottom: 44px;
            .item-panel-body {
              position: absolute;
              bottom: -7px;
              z-index: 2;
              .panel-header {
                border-bottom: 1px dashed #f2e3c8;
                padding: 13px 0;
                height: 23px;
                margin: 0 14px;
                width: 174px;
                .header-text1 {
                  font-size: 18px;
                  color: #a1895f;
                  vertical-align: top;
                  line-height: 14px;
                  text-align: left;
                  margin-right: 3px;
                }
                .header-text2 {
                  display: inline-block;
                  margin-left: -5px;
                  font-size: 32px;
                  color: #c9a76d;
                  /*font-style: italic;*/
                  /*font-family: "黑体";*/
                  font-weight: 500;
                  transform: skew(-12deg, 0deg);
                }
                .header-text3 {
                  font-size: 16px;
                  color: #cdc2b0;
                  margin-left: 3px;
                }
              }
              .panel-content {
                height: 167px;
                border-bottom: 1px dashed #f2e3c8;
                margin: 0 14px;
                width: 174px;
                padding-top: 0px;
                .panel-content-img-panel {
                  width: 64px;
                  height: 64px;
                  border-radius: 50px;
                  background: #f4f2ee;
                  margin: 15px auto;
                  .panel-content-img {
                    width: 64px;
                    height: 64px;
                    &.recharge {
                      background: url('./misc/np-recharge.png')
                    }
                    &.bet {
                      background: url('./misc/np-bet.png')
                    }
                    &.add {
                      background: url('./misc/np-activity.png')
                    }
                  }
                }
                .panel-content-text-panel {
                  .panel-content-text {
                    font-size: 12px;
                    text-align: left;
                    color: #333333;
                    &.red {
                      color: #e84c4c;
                    }
                  }
                }
                .panel-content-coupons {
                  height: 55px;
                  color: #ffffff;
                  padding: 0 18px;
                  margin: 13px auto;
                  width: 83px;
                  .coupons-text1 {
                    text-align: left;
                    font-size: 12px;
                    padding: 3px;

                  }
                  .panel-content-coupons-value {
                    text-align: left;
                    margin-left: 5px;
                  }
                  .coupons-text2 {
                    font-size: 12px;
                    vertical-align: top;
                    float: left;
                    line-height: 14px;
                  }
                  .coupons-text3 {
                    font-size: 20px;
                    font-style: italic;
                  }
                  &.first {
                    background: url('./misc/np-coupons-red.png');
                  }
                  &.second {
                    background: url('./misc/np-coupons-blue.png');
                  }
                }
              }
              .panel-footer {
                cursor: pointer;
                margin: 23px auto;
                width: 150px;
                height: 32px;
                border-radius: 20px;
                color: #ffffff;
                line-height: 32px;
                font-size: 14px;
                background: linear-gradient(to right, #efdbaf, #aa8b5b);
                bottom: 4px;
                position: relative;
                &.active, &:hover {
                  box-shadow: rgba(0, 0, 0, 0.2) 3px 3px 10px;
                }
              }
            }
          }
        }
      }
      .novice-item-recived-panel {
        margin-top: 23px;
        z-index: 4;
        position: absolute;
        top: 62px;
        background-color: rgba(50, 50, 50, .3);
        height: 312px;
        width: 201px;
        .novice-item-recived-body {
          background: url('./misc/np-recevied-img.png');
          width: 170px;
          height: 73px;
          margin-top: 97px;
          margin-left: 17px;
        }
        .empty-left {
          width: 7px;
          height: 14px;
          border-radius: 0 50px 50px 0;
          background: #f9f9f9;
          margin-top: 27px;
          position: absolute;
        }
        .empty-right {
          width: 7px;
          height: 14px;
          right: 0;
          border-radius: 50px 0 0 50px;
          background: #f9f9f9;
          margin-top: 27px;
          position: absolute;
        }
      }
    }
    .novice-footer {
      background: url('./misc/np-footer.png');
      width: 329px;
      height: 145px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
</style>

