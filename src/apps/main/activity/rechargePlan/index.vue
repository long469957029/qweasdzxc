<template>
  <div class="rechargePlan">
    <div class="rp-header">
      <div class="ws-header-img">
        <div class="bp-header-time">活动时间：<span v-model="fromTime">{{fromTime}}</span>-<span
          v-model="endTime">{{endTime}}</span></div>
        <div class="rp-header-shadow">
        </div>
        <div class="rp-header-text">
          先领取任务，默认领取任务后的第一笔金额大于{{minRecharge}}的充值为奖励返还的值，充值不累计流水可累计。 在完成一轮充值任务并领取奖励后，可领取下一轮的充值任务。
        </div>
      </div>
    </div>
    <div class="rp-process" v-show="showDoingTask">
      <div class="rp-process-panel">
        <div class="rp-process-back"></div>
        <div class="rp-process-title">当前任务进度</div>
        <div class="rp-process-content">
          <div class="rp-process-task inline-block">
            <div class="rp-task-title">当前任务</div>
            <div class="rp-task-text">{{curItem.betMulti}}倍流水返{{_(curItem.bonusRate).formatDiv(100)}}%充值额</div>
          </div>
          <div class="rp-process-task-detail inline-block">
            <div class="detail-value">
              <div class="detail-value-item">
                <div class="rp-task-title">您的充值额</div>
                <div class="rp-value-text">{{rechargeTotal}}</div>
              </div>
              <div class="detail-value-item">
                <div class="rp-task-title">奖励金额</div>
                <div class="rp-value-text">{{curBonus}}</div>
              </div>
              <div class="detail-value-item claim">
                <div class="rp-task-title">流水要求</div>
                <div class="rp-value-text">{{rechargeTotal === '0.00' ? '0.00' : _(rechargeTotal).formatMul(Number(curItem.betMulti))}}</div>
              </div>
            </div>
            <div class="detail-process">
              <div class="rp-task-title inline-block">流水进度</div>
              <div class="rp-task-img inline-block">
                <div class="rp-task-process" ref="process"
                     v-is-in-view="{callback: visibilityChanged}"></div>
              </div>
              <div class="rp-task-text inline-block">{{betTotal}}/{{rechargeTotal * curItem.betMulti}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rp-plan">
      <div class="rp-plan-panel">
        <div class="rp-plan-back"></div>
        <div class="rp-plan-title">充值计划</div>
        <div class="rp-plan-item" v-for="(item,index) in planList">
          <div class="item-img inline-block"
               :class="{one:index===0,two:index===1,three:index===2,four:index===3,five:index===4}"></div>
          <div class="item-text-container inline-block">
            <div class="item-text"><span class="item-text-value">{{item.betMulti}}</span>倍流水返<span
              class="item-text-value">{{_(item.bonusRate).formatDiv(100)}}%</span>充值额（最高<span class="item-text-value">{{_(item.maxBonus).formatDiv(10000)}}</span>元)
              +{{item.ticketCoupon.ticketName}}<span
                class="item-text-value">{{_(item.ticketCoupon.amount).formatDiv(10000)}}</span>元代金券
            </div>
            <div class="item-desc">
              如：充{{rechargeExp}}，流水{{rechargeExp * item.betMulti}}，返{{rechargeExp * _(item.bonusRate).formatDiv(10000)}}元
            </div>
          </div>
          <div class="item-receive" v-if="item.status===0"
               @click="confirmTask(item.betMulti,_(item.bonusRate).formatDiv(100),item.index)">立即领取
          </div>
          <div class="item-status" :class="{doing:item.status===1,done:item.status===2}" v-else></div>
        </div>
      </div>
    </div>
    <div class="rp-footer">
      <div class="rp-footer-panel">
        <div class="rp-footer-title">活动规则</div>
        <div class="rp-footer-text">1、单次充值金额需大于{{minRecharge}}元，小于{{minRecharge}}元充值活动资格无效。</div>
        <div class="rp-footer-text">
          2、仅计算在领取任务后的首笔金额大于{{minRecharge}}的充值为返奖充值，流水可累积，充值不累积。如领取任务后充值1000元，打满8倍流水则奖励为1000*5%=50元，未打满8倍流水，
          再次充值1000元（不再计算为奖励），打够此前1000元的8倍流水，则依然可享50元充值奖励。
        </div>
        <div class="rp-footer-text">3、充值奖励在达到目标后自动返还，在完成一个任务后可领取其他的充值任务。</div>
      </div>
    </div>
    // 任务确认弹窗
    <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="rechargePlanModal"
         v-show="showConfirmModal">
      <div class="modal-dialog modal-recharge">
        <div class="confirm-header">
          任务确认
          <a class="close btn-close" data-dismiss="modal">×</a>
        </div>
        <div class="confirm-text1"><span class="confirm-text3">{{curAmount}}</span>倍流水返<span class="confirm-text3">{{curLimit}}%充值额</span>
        </div>
        <div class="confirm-text2">领取任务后再完成该任务后，才可继续领取下一轮的充值任务哟～</div>
        <div class="confirm-footer" @click="taskRecevie(curIndex)">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
  import activityInfo from 'api/activity'

  import VueIsInView from 'vue-is-in-view';
  Vue.use(VueIsInView);

  export default{
    name: 'index',

    data () {
      return {
        showDoingTask: false,
        planList: '',
        minRecharge: 0.00,
        curItem: {
          betMulti: 0,
          bonusRate: 0,
          index: 0,
          maxBonus: 0,
          status: 0,
        },
        betTotal: 0,
        rechargeTotal: 0,
        rechargeExp: 10000,
        process: 0,
        curBonus: 0,
        fromTime: '',
        endTime: '',
        showConfirmModal: false,
        curAmount: 0,
        curLimit: 0,
        curIndex: -1,
      }
    },

    props: {},

    components: {},

    mounted () {
      activityInfo.getRechargePlanInfo(
        ({data}) => {
          if (data && data.result === 0) {
            this.initActivityData(data)
          }
        }
      )
    },

    watch: {},

    computed: {
      loginStatus(){
        return this.$store.getters.getLoginStatus
      },
    },

    filters: {},

    methods: {
      showLogin() {
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
//        this.openLoginDialog()
      },
      confirmTask(amount, limit, index){
        if(!this.loadingStatus){
          this.showLogin()
          return false
        }
        if(_(this.planList).findIndex((item) => {return item.status === 1}) > -1){
          Global.ui.notification.show('当前任务未完成，不可领取新任务')
          return false
        }
        this.showConfirmModal = true
        this.curAmount = amount
        this.curLimit = limit
        this.curIndex = index
        this.$nextTick(() => {
          $(this.$refs.rechargePlanModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.showConfirmModal = false
            })
        })
      },
      taskRecevie(index){
        $(this.$refs.rechargePlanModal).modal('hide')
        activityInfo.doRechargePlan({
            index: index
          },
          ({data}) => {
            if (data.result === 0) {
              this.initActivityData(data)
              Global.ui.notification.show('任务领取成功！<br><div style="margin-top: 34px;font-size: 12px;color: #666666;    margin-bottom: -15px;">只要努力，没有什么是不可能的～</div>', {
                type: 'success',
              })
            } else {
              Global.ui.notification.show(data.msg)
            }
          })
      },

      visibilityChanged() {
        Velocity(this.$refs.process, {
          width: this.process
        })
      },
      initActivityData(data){
        const flag = false
        this.planList = data.root.itemList
        this.rechargeTotal = data.root.rechargeTotal === 0 ? '0.00' : _(data.root.rechargeTotal).convert2yuan()
        this.betTotal = data.root.betTotal ? '0.00' : _(data.root.betTotal).convert2yuan()
        this.minRecharge = _(data.root.recharge).convert2yuan()
        this.fromTime = _(data.root.fromDate).toDate('M月D日')
        this.endTime = _(data.root.endDate).toDate('M月D日')

        //status -1：不可领取，0 可领取且未领取，1，已领取且进行中，2，已完成
        _(data.root.itemList).each((item) => {
          if (item.status === 1) {
            this.showDoingTask = true
            this.curItem = _(data.root.itemList).findWhere({
              index: item.index
            })
//            this.process = 50 + '%'
            let curBonus = _(_(data.root.rechargeTotal).formatDiv(10000) * _(item.bonusRate).formatDiv(10000)).formatDiv(1,{fixed:2})
            if (curBonus > _(item.maxBonus).formatDiv(10000)) {
              curBonus = _(item.maxBonus).formatDiv(10000)
            }
            this.curBonus = curBonus
            let process = _((data.root.betTotal / (data.root.rechargeTotal * item.betMulti)) * 100).formatDiv(1, {fixed: 0}) + '%'
            if (process > 100) {
              process = 100
            }
            this.process = process
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rechargePlan {
    overflow: hidden;
    font-family: "Microsoft Yahei", "Microsoft YaHei UI", sans-serif;
    display: block;
    position: relative;
    background-color: #f9f9f9;
    .rp-header {
      width: 100%;
      height: 600px;
      .ws-header-img {
        margin-top: -1px;
        background-image: url('./misc/rp-header.png');
        width: 1920px;
        height: 100%;
        position: relative;
        top: 0;
        max-width: 1920px;
        left: 50%;
        margin-left: -960px;
        .rp-header-text {
          background: #ffffff;
          color: #544934;
          font-size: 16px;
          width: 624px;
          height: 55px;
          left: 50%;
          margin-left: -400px;
          padding: 39px 89px;
          line-height: 27px;
          top: 480px;
          position: absolute;
          z-index: 2;
          text-align: center;
        }
        .bp-header-time {
          font-size: 22px;
          color: #d2a550;
          position: absolute;
          left: 50%;
          top: 378px;
          margin-left: -120px;
        }
        .rp-header-shadow {
          background: #ffffff;
          color: #544934;
          font-size: 16px;
          width: 622px;
          height: 55px;
          position: relative;
          left: 50%;
          margin-left: -400px;
          padding: 39px 89px;
          line-height: 27px;
          top: 480px;
          z-index: 1;
        }

        .rp-header-shadow:before {
          position: absolute;
          z-index: -1;
          left: 20px;
          bottom: 17px;
          width: 80%;
          height: 30px;
          content: "";
          transform: skew(-18deg) rotate(-3deg);
          -webkit-transform: skew(-18deg) rotate(-3deg);
          -moz-transform: skew(-18deg) rotate(-3deg);
          box-shadow: 0 20px 20px #8f8f8f;
        }
        .rp-header-shadow:after {
          position: absolute;
          z-index: -2;
          right: 20px;
          bottom: 17px;
          width: 80%;
          height: 30px;
          content: "";
          transform: skew(18deg) rotate(3deg);
          -webkit-transform: skew(18deg) rotate(3deg);
          -moz-transform: skew(18deg) rotate(3deg);
          box-shadow: 0 20px 20px #8f8f8f;
        }
      }

    }
    .rp-process {
      width: 100%;
      position: relative;
      padding-top: 60px;
      height: 345px;
      background-color: #ffffff;
      .rp-process-panel {
        margin: 0 auto;
        position: relative;
        width: 1200px;
        .rp-process-back {
          position: absolute;
          background-image: url('./misc/rp-taskProgress.png');
          width: 462px;
          height: 73px;
        }
        .rp-process-title {
          font-size: 47px;
          color: #333333;
          padding-top: 33px;
          position: relative;
          line-height: 47px;
          font-weight: 600;
        }
        .rp-process-content {
          margin-top: 43px;
          .rp-process-task {
            vertical-align: top;
            background-image: url('./misc/rp-task.png');
            width: 294px;
            height: 128px;
            padding-top: 44px;
            margin-right: 150px;
            text-align: center;
            box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
            .rp-task-title {
              margin-bottom: 35px;
            }
          }
          .rp-process-task-detail {
            .detail-value {
              margin-top: 10px;
              .detail-value-item {
                width: 190px;
                height: 83px;
                display: inline-block;
                text-align: center;
                border-right: 1px solid #e5e5e5;
                .rp-task-title {
                  margin-bottom: 40px;
                  vertical-align: top;
                }
                .rp-value-text {
                  font-size: 20px;
                  color: #f3ba2e;
                }
                &.claim {
                  border-right: 0;
                }
              }
            }
            .detail-process {
              margin-top: 50px;
              margin-left: 38px;
              .rp-task-title {
                margin-right: 10px;
              }
              .rp-task-img {
                position: relative;
                width: 365px;
                background: #dfdfdf;
                height: 17px;
                border-radius: 20px;
                .rp-task-process {
                  position: absolute;
                  left: 0;
                  width: 0;
                  background: #e0bd77;
                  height: 17px;
                  border-radius: 20px;
                }
              }
              .rp-task-text {
                margin-left: 25px;
              }
            }
          }
          .rp-task-title {
            font-size: 22px;
            color: #665d3e;
            text-align: center;
            font-weight: 600;
          }
          .rp-task-text {
            color: #665d3e;
            font-size: 22px;
          }
        }
      }
    }
    .rp-plan {
      width: 100%;
      position: relative;
      background: #f9f9f9;
      .rp-plan-panel {
        margin: 0 auto 300px;
        position: relative;
        width: 1200px;
        padding-top: 40px;
        z-index: 1;
        .rp-plan-back {
          position: absolute;
          background-image: url('./misc/rp-rechargePlan.png');
          width: 473px;
          height: 73px;
        }
        .rp-plan-title {
          font-size: 47px;
          color: #333333;
          padding-top: 33px;
          position: relative;
          line-height: 47px;
          font-weight: 600;
          margin-bottom: 40px;
        }
        .rp-plan-item {
          width: 1190px;
          height: 90px;
          padding: 30px 0 30px 30px;
          margin-top: 25px;
          box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
          background: #ffffff;
          position: relative;
          .item-img {
            width: 90px;
            height: 90px;
            margin-right: 95px;
            vertical-align: top;
            &.one {
              background-image: url('./misc/rs-plan-logo1.png');
            }
            &.two {
              background-image: url('./misc/rs-plan-logo2.png');
            }
            &.three {
              background-image: url('./misc/rs-plan-logo3.png');
            }
            &.four {
              background-image: url('./misc/rs-plan-logo4.png');
            }
            &.five {
              background-image: url('./misc/rs-plan-logo5.png');
            }
          }
          .item-text-container {
            margin-top: 15px;
            color: #4a340f;
            vertical-align: top;
            .item-text {
              font-size: 22px;
              margin-bottom: 25px;
              .item-text-value {
                color: #c4a25d;
                font-size: 26px;
              }
            }
            .item-desc {
              font-size: 16px;
            }
          }
          .item-receive {
            right: 60px;
            text-align: center;
            color: #ffffff;
            font-size: 22px;
            background: #e0bd77;
            width: 147px;
            height: 54px;
            line-height: 54px;
            position: absolute;
            top: 45px;
            border-radius: 4px;
            box-shadow: 0 3px 5px #e0bd77;
            cursor: pointer;
          }
          .item-status {
            position: absolute;
            right: -14px;
            top: -14px;
            width: 156px;
            height: 165px;
            &.doing {
              background-image: url('./misc/rs-plan-doing.png');
            }
            &.done {
              background-image: url('./misc/rs-plan-done.png');
            }
          }
        }
      }

    }
    .rp-footer {
      width: 100%;
      background-image: url('./misc/rs-footer.png');
      height: 485px;
      bottom: 0;
      position: absolute;
      .rp-footer-panel {
        padding-top: 220px;
        width: 1200px;
        margin: 0 auto;
        text-align: left;
        .rp-footer-title {
          font-size: 29px;
          margin-bottom: 20px;
          color: #333333;
        }
        .rp-footer-text {
          line-height: 45px;
          font-size: 18px;
          color: #666666;
        }
      }
    }
    .modal-recharge {
      z-index: 1050;
      background: #ffffff;
      width: 480px;
      height: 310px;
      .confirm-header {
        background: #f0f0f0;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #333333;
        text-align: center;
      }
      .confirm-text1 {
        font-size: 16px;
        color: #666666;
        margin: 65px auto 40px;
        text-align: center;
      }
      .confirm-text2 {
        font-size: 14px;
        color: #666666;
        width: 263px;
        text-align: center;
        margin: 0 auto;
        line-height: 26px;
      }
      .confirm-text3 {
        font-size: 16px;
        color: #333333;
      }
      .confirm-footer {
        margin: 20px auto;
        background: #14b1bb;
        color: #ffffff;
        font-size: 12px;
        border-radius: 5px;
        width: 110px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
</style>

