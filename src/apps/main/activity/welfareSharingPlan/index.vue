<template>
  <div class="welfareSharingPlan">
    <div class="ws-header">
      <div class="ws-header-img">
        <div class="ws-header-container">
          <div class="ws-header-logo1"></div>
          <div class="ws-header-logo2"></div>
          <div class="ws-header-logo3"></div>
          <div class="ws-header-time">活动时间：<span v-model="fromTime">{{fromTime}}</span>-<span v-model="endTime">{{endTime}}</span>
          </div>

        </div>
      </div>
    </div>
    <div class="ws-desc">
      <div class="ws-desc-left">
      </div>
      <div class="ws-desc-right">
      </div>
      <div class="ws-desc-container">
        <div class="ws-desc-text">好福利齐分享，天天有钱天天分享！为答谢广大总代对平台的支持，
          也使平台能有序健康发展，无限娱乐特别为您定制这份福利分享活动，让你在为平台贡献力量时能享受丰厚的奖励
        </div>
      </div>
    </div>
    <div class="ws-body">
      <div class="ws-content">
        <div class="content-container">
          <div class="content-myReward">
            <div class="content-myReward-title">
              <div class="title-left inline-block"></div>
              <div class="title-word inline-block"></div>
              <div class="title-right inline-block"></div>
            </div>
            <div class="content-myReward-container">
              <div class="myReward-container-top">
                <div class="myReward-item top left inline-block">日期</div>
                <div class="myReward-item top inline-block">团队销量</div>
                <div class="myReward-item top inline-block">团队亏损</div>
                <div class="myReward-item top inline-block">可得奖励</div>
              </div>
              <div class="myReward-container-value">
                <div class="myReward-item left inline-block">{{_(myBonusList.date).toDate('YYYY-MM-DD')}}</div>
                <div class="myReward-item inline-block">{{_(myBonusList.betAmount).formatDiv(10000)}}</div>
                <div class="myReward-item inline-block">{{_(myBonusList.profit).formatDiv(10000)}}</div>
                <div class="myReward-item inline-block">{{_(myBonusList.bonus).formatDiv(10000)}}</div>
              </div>
              <div class="myReward-receive receive" v-if="(!activityList.getBonus)&&myBonusList.bonus>0"
                   @click="recevieBonus">确认领取
              </div>
              <div class="myReward-receive recevied" v-else-if="activityList.getBonus"></div>
              <div class="myReward-receive unRecevie" v-else-if="(!activityList.getBonus)&&myBonusList.bonus<=0">
              </div>
            </div>
          </div>
          <div class="content-welfare">
            <div class="content-welfare-title">
              <div class="title-left inline-block"></div>
              <div class="title-word inline-block"></div>
              <div class="title-right inline-block"></div>
            </div>
            <div class="content-welfare-calculation">
              <span class="welfare-calculation-title">福利计算器：</span>
              <span class="welfare-calculation-text">团队日销量</span>
              <input class="welfare-calculation-input" data-parsley-type="integer" required v-model="teamAmount">
              <span class="welfare-calculation-text">团队日亏损</span>
              <input class="welfare-calculation-input" data-parsley-type="integer" required v-model="teamProfit">
              <button class="btn btn-welfare-calculation" @click="curBonus">计算</button>
            </div>
            <div class="content-welfare-container">
              <div class="content-welfare-top">
                <div class="welfare-top-item inline-block item1">团队日销量</div>
                <div class="welfare-top-item inline-block item2">保底奖励</div>
                <div class="welfare-top-item inline-block item2">团队亏损</div>
                <div class="welfare-top-item inline-block item3">奖励</div>
                <div class="welfare-top-item inline-block item2">团队亏损</div>
                <div class="welfare-top-item inline-block item3">奖励</div>
                <div class="welfare-top-item inline-block item2">团队亏损</div>
                <div class="welfare-top-item inline-block item3">奖励</div>
              </div>
              <div class="content-welfare-value">
                <div class="content-welfare-value-item" v-for="bonus in bonusList" ref="welfareRows">
                  <div class="welfare-item inline-block item1">{{_(bonus.betAmount).formatDiv(10000)}}</div>
                  <div class="welfare-item inline-block item2"
                       :class="{active:bonus.bonus===curResult&&curAmount===bonus.betAmount}">
                    {{_(bonus.bonus).formatDiv(10000)}}
                  </div>
                  <div class="welfare-item inline-block item3">{{_(bonus.profit1).formatDiv(10000)}}</div>
                  <div class="welfare-item inline-block item4"
                       :class="{active:bonus.bonus1===curResult&&curAmount===bonus.betAmount}">
                    {{_(bonus.bonus1).formatDiv(10000)}}
                  </div>
                  <div class="welfare-item inline-block item3">{{_(bonus.profit2).formatDiv(10000)}}</div>
                  <div class="welfare-item inline-block item4"
                       :class="{active:bonus.bonus2===curResult&&curAmount===bonus.betAmount}">
                    {{_(bonus.bonus2).formatDiv(10000)}}
                  </div>
                  <div class="welfare-item inline-block item3">{{_(bonus.profit3).formatDiv(10000)}}</div>
                  <div class="welfare-item inline-block item4"
                       :class="{active:bonus.bonus3===curResult&&curAmount===bonus.betAmount}">
                    {{_(bonus.bonus3).formatDiv(10000)}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ws-content-logo1"></div>
        <div class="ws-content-logo2"></div>
        <div class="ws-content-logo3"></div>
        <div class="ws-content-logo4"></div>
        <div class="ws-content-logo5"></div>
        <div class="ws-content-logo6"></div>
      </div>
      <div class="ws-footer">
        <div class="ws-footer-title">活动说明</div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">1</div>
          活动仅限12.8总代享受参与（不含平级）。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">2</div>
          活动统计周期为：根据团队前一天的销售与亏损情况， 按下表标准收到领取奖励，逾期作废。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">3</div>
          在同等销量的情况下，贡献的亏损值不同，所获取的奖励也不同。
          如在销量10000的情况下， 亏损300获得100元，亏损500获得120元，亏损1000则可获得160元奖励，以此类推。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">4</div>
          每天销量封顶100万，亏损奖励最高16000元，无限娱乐享有活动的最终解释和修改权。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">5</div>
          该活动的最终解释权归无限娱乐所有。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import activityInfo from 'api/activity'
  export default{
    name: 'index',

    data () {
      return {
        myBonusList: '',
        fromTime: '',
        endTime: '',
        activityList: '',
        bonusList: '',
        teamAmount: 0,
        teamProfit: 0,
        curResult: 0,
        curAmount: 0,
      }
    },

    props: {},

    components: {},

    mounted () {
      this.initActivityData()
    },

    watch: {
      curResult() {
          this.$nextTick(() => {
            //找到active节点
            //移动到这个位置中间
            //屏幕一半高度 $(window).height() / 2

            Velocity(document.body, 'scroll', {
              offset: $(this.$refs.welfareRows).find('.active')[0].getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top - $(window).height() / 2,
              mobileHA: false
            })
          })

      }
    },

    computed: {},

    filters: {},

    methods: {
      recevieBonus(){
        activityInfo.doWelfareSharingPlan(
          ({data}) => {
            if (data && data.result === 0) {
              Global.ui.notification.show('领取成功！今天再接再厉哦！')
              this.initActivityData()
            } else {
              Global.ui.notification.show(data.msg)
            }
          }
        )
      },
      curBonus(){
        activityInfo.curWelfare({
          amount: this.teamAmount,
          profit: this.teamProfit
        }, ({data}) => {
          if (data && data.result === 0) {
            this.curResult = data.root.bonus
            this.curAmount = this.getCurAmount(this.teamAmount)
            this.initActivityData()
          } else {
            Global.ui.notification.show(data.msg)
          }
        })
      },
      getCurAmount(teamAmount){
        const amountList = []
        _(this.bonusList).each((item) => {
          if (_(item.betAmount).formatDiv(10000) <= teamAmount) {
            amountList.push(item.betAmount)
          }
        })
        return amountList.sort(function (a, b) {
          return a < b ? 1 : -1
        })[0]
      },
      initActivityData(){
        activityInfo.getWelfareSharingPlanInfo(
          ({data}) => {
            if (data && data.result === 0) {
              if (data.root.avaliable) {
                if (_.isNull(data.root.yesterdayData)) {
                  Global.ui.notification.show('您的账号暂时无法参与该活动，请与上级联系确认！')
                } else {
                  this.fromTime = _(data.root.fromDate).toDate('YYYY年M月D日')
                  this.endTime = _(data.root.endDate).toDate('YYYY年M月D日')
                  this.myBonusList = data.root.yesterdayData
                  this.activityList = data.root
                  this.bonusList = data.root.wages
                }
              } else {
                Global.ui.notification.show('您的账号暂时无法参与该活动，请与上级联系确认！')
              }
            }
          }
        )
      },
    }
  }
</script>

<style lang="scss" scoped>
  .welfareSharingPlan {
    overflow: hidden;
    font-family: "Microsoft Yahei", "Microsoft YaHei UI", sans-serif;
    display: block;
    position: relative;
    background-color: #ffffff;
    .ws-header {
      width: 100%;
      height: 479px;
      .ws-header-img {
        background-image: url('./misc/ws-header.png');
        width: 1920px;
        height: 100%;
        position: relative;
        top: 0;
        max-width: 1920px;
        left: 50%;
        margin-left: -960px;
      }
      .ws-header-container {
        width: 1200px;
        margin: 0 auto;
        padding: 30px 0;
        position: relative;
        .ws-header-logo1 {
          background-image: url('./misc/ws-header-logo1.png');
          width: 467px;
          height: 349px;
          margin: 0 auto;
        }
        .ws-header-logo2 {
          position: absolute;
          width: 191px;
          height: 114px;
          top: 30px;
          left: 83px;
          background-image: url('./misc/ws-header-logo2.png');
        }
        .ws-header-logo3 {
          width: 295px;
          height: 167px;
          position: absolute;
          top: 230px;
          right: 127px;
          background-image: url('./misc/ws-header-logo3.png');
        }
        .ws-header-time {
          font-size: 18px;
          color: #506660;
          left: 50%;
          position: relative;
          bottom: 114px;
          margin-left: -162px;
        }

      }
    }
    .ws-desc {
      width: 100%;
      height: 233px;
      position: relative;
      margin-top: -60px;
      .ws-desc-left {
        position: absolute;
        left: 0;
        width: 455px;
        height: 233px;
        background-image: url('./misc/ws-desc-left.png');
      }
      .ws-desc-right {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 400px;
        height: 153px;
        background-image: url('./misc/ws-desc-right.png');
      }
      .ws-desc-container {
        width: 1920px;
        height: 100%;
        position: absolute;
        margin-top: -10px;
        /* text-align: center; */
        left: 50%;
        margin-left: -276px;
        .ws-desc-text {
          position: absolute;
          font-size: 14px;
          color: #75aa9c;
          line-height: 25px;
          width: 565px;
          margin: -15px auto 0;
        }
      }
    }
    .ws-body {
      width: 100%;
      position: relative;
      padding-bottom: 55px;
      background: linear-gradient(to bottom, #d7f1e2, #9eccbc);
      .ws-content {
        margin: 0 auto;
        position: relative;
        width: 1060px;
        height: 1250px;
        .content-container {
          background-image: url('./misc/ws-body.png');
          width: 866px;
          height: 1344px;
          margin: 0 auto;
          position: absolute;
          top: -185px;
          padding: 65px 116px;
          .title-right {
            background-image: url('./misc/content-title-right.png');
            width: 146px;
            height: 26px;
          }
          .title-left {
            background-image: url('./misc/content-title-left.png');
            width: 146px;
            height: 26px;
          }
          .content-myReward {
            .content-myReward-title {
              text-align: center;
              .title-word {
                background-image: url('./misc/ws-content-word2.png');
                width: 135px;
                height: 34px;
                margin: -8px 25px;
              }
            }
            .content-myReward-container {
              font-size: 0;
              .myReward-container-top {
                margin-top: 30px;
              }
              .myReward-item {
                width: 215px;
                height: 50px;
                background: #e3eff5;
                color: #4884aa;
                font-size: 12px;
                text-align: center;
                border-right: 1px solid #9dc0d5;
                border-bottom: 1px solid #9dc0d5;

                vertical-align: top;
                line-height: 50px;
                &.left {
                  border-left: 1px solid #9dc0d5;;
                }
                &.top {
                  line-height: 47px;
                  font-size: 16px;
                  color: #ffffff;
                  background: #4780a2;
                  border-top: 1px solid #9dc0d5;
                  border-right: 1px solid #9dc0d5;
                  border-bottom: 1px solid #9dc0d5;
                }
              }
              .myReward-receive {
                margin: 25px auto;
                width: 121px;
                height: 49px;
                color: #ffffff;
                font-size: 18px;
                text-align: center;
                line-height: 49px;
                &.receive {
                  cursor: pointer;
                  background-image: url('./misc/ws-myReward-bottom.png');
                }
                &.recevied {
                  background-image: url('./misc/ws-myReward-recevied.png');
                }
                &.unRecevie {
                  background-image: url('./misc/ws-myReward-unRecevie.png');
                }
              }
            }
          }
          .content-welfare {
            margin-top: 40px;
            .content-welfare-title {
              text-align: center;
              .title-word {
                background-image: url('./misc/ws-content-word1.png');
                width: 135px;
                height: 34px;
                margin: -8px 25px;
              }
            }
            .content-welfare-calculation {
              margin: 30px auto;
              color: #4780a2;
              font-size: 16px;
              .welfare-calculation-title {
                font-size: 18px;
                font-weight: 600;
                margin-left: 33px;
                margin-right: 10px;
              }
              .welfare-calculation-text {
                margin-right: 23px;
              }
              .welfare-calculation-input {
                height: 12px;
                margin-right: 30px;
                background: #e3eff5;
                color: #666666;
                padding: 6px 5px;
                width: 144px;
                outline-width: 0;
                border: 1px solid #cccccc;
                &.active, &:focus {
                  border: 1px solid #14b1bb;
                }
              }
              .btn-welfare-calculation {
                background: #a5d7ba;
                font-size: 14px;
                width: 86px;
                height: 26px;
                line-height: 16px;
                text-align: center;
                border-radius: 15px;
                border: 0;
              }

            }
            .content-welfare-container {
              font-size: 0;
              .content-welfare-value {
                border-bottom: 1px solid #407392;
                overflow: hidden;
              }
              .welfare-top-item {
                vertical-align: top;
                width: 138px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                font-size: 18px;
                color: #ffffff;
                background: #4780a2;
                border: 1px solid #5799c0;
                &.item1 {
                  width: 114px;
                }
                &.item2 {
                  width: 109px;
                }
                &.item3 {
                  width: 100px;
                }
              }
              .welfare-item {
                vertical-align: top;
                background: #e3eff5;
                color: #30739e;
                font-size: 14px;
                width: 138px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                border-right: 1px solid #d2e2eb;
                border-bottom: 1px solid #d2e2eb;
                &.item1 {
                  border-left: 1px solid #407392;
                  border-right: 1px solid #407392;
                  width: 114px;
                }
                &.item2 {
                  width: 110px;
                  border-right: 1px solid #407392;
                }
                &.item3 {
                  width: 110px;
                }
                &.item4 {
                  width: 101px;
                  border-right: 1px solid #407392;
                }
                &.active {
                  background: #a5d7ba;
                  color: #ffffff;
                }
              }
            }
          }
        }
      }
      .ws-content-logo1 {
        background-image: url('./misc/ws-content-logo1.png');
        width: 139px;
        height: 128px;
        position: absolute;
        margin-top: -176px;
        margin-left: -90px;
      }
      .ws-content-logo2 {
        background-image: url('./misc/ws-content-logo2.png');
        width: 95px;
        height: 120px;
        position: absolute;
        margin-left: -250px;
        margin-top: 500px;
      }
      .ws-content-logo3 {
        background-image: url('./misc/ws-content-logo3.png');
        width: 68px;
        height: 64px;
        position: absolute;
        right: -150px;
        margin-top: 1000px;
      }
      .ws-content-logo4 {
        background-image: url('./misc/ws-content-logo4.png');
        width: 305px;
        height: 107px;
        position: absolute;
        right: -402px;
        margin-top: 700px;
      }
      .ws-content-logo5 {
        background-image: url('./misc/ws-content-logo5.png');
        width: 187px;
        height: 66px;
        margin-left: -300px;
        position: absolute;
        margin-top: 200px;
      }
      .ws-content-logo6 {
        background-image: url('./misc/ws-content-logo6.png');
        width: 50px;
        height: 74px;
        position: absolute;
        right: -200px;
        margin-top: 300px;
      }
      .ws-footer {
        width: 1050px;
        margin: 0 auto;
        background: transparent;
        .ws-footer-title {
          font-size: 20px;
          color: #2e8a72;
          font-weight: 600;
          margin-top: 100px;
          margin-bottom: 12px;
        }
        .ws-footer-text {
          color: #427769;
          font-size: 12px;
          line-height: 17px;
          margin: 6px 0;
          .ws-text-circle {
            width: 17px;
            height: 17px;
            background: #2e8a72;
            border-radius: 50px;
            color: #95cebf;
            font-size: 10px;
            text-align: center;
            line-height: 17px;
            float: left;
            margin-right: 12px;
          }
        }
      }
    }
  }
</style>

