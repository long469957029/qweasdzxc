<template>
  <div class="arena-activity">
    <div class="bg-top"></div>
    <div class="bg-opacity"></div>
    <div class="cloud"></div>
    <div class="float-rule-toolbar" @click="scrollToRule"></div>
    <div class="main-content">
      <div class="activity-date">
        [ 活动时间：2018年3月1日-3月31日 ]
      </div>
      <div class="activity-tip"></div>

      <div class="ticket-container">
        <div class="ticket-unit" v-for="ticket in formatTicketList">
          <div class="ticket-icon">
            <div class="ticket-name" v-html="ticket.info.showName"></div>
          </div>
          <template v-if="ticket.info.id === receiveCoupon">
            <div class="ticket-btn ticket-btn-received">已领完</div>
          </template>
          <template v-else>
            <div class="ticket-btn" @click="getTicket(ticket.info.id)">免费领券</div>
          </template>
        </div>
      </div>

      <div class="daily-container">
        <div class="daily-title"></div>
        <div class="daily-content">
          <div class="daily-table-wrapper">
            <div class="daily-top">
              <div class="daily-left">
                <span class="arrow"></span>
                昨日排行
              </div>
              <div class="daily-right">
                今日排行
                <span class="arrow right"></span>
              </div>
            </div>
            <div class="daily-table flex-table">
              <div class="flex-title flex-row">
                <div class="flex-td" style="width: 98px">排名</div>
                <div class="flex-td" style="width: 170px">用户名</div>
                <div class="flex-td" style="width: 170px">投注金额</div>
                <div class="flex-td" style="width: 170px">奖励金额</div>
              </div>
              <div class="flex-body flex-row" v-for="userInfo in currentTop10">
                <div class="flex-td" style="width: 98px">
                  <template v-if="userInfo.ranking > 3">{{userInfo.ranking}}</template>
                  <template v-else>
                    <span :class="`top-${userInfo.ranking}`"></span>
                  </template>
                </div>
                <div class="flex-td" style="width: 170px" v-html="userInfo.userName"></div>
                <div class="flex-td" style="width: 170px" v-html="userInfo.bet"></div>
                <div class="flex-td point-money" style="width: 170px" v-html="userInfo.amount"></div>
              </div>
              <div class="flex-body flex-row">
                <div class="flex-td" style="width: 98px">29</div>
                <div class="flex-td" style="width: 170px">polo</div>
                <div class="flex-td" style="width: 170px">1560.000</div>
                <div class="flex-td point-money" style="width: 170px">1563.000</div>
              </div>
            </div>
          </div>
          <div class="yesterday-history" :class="{'prized-top-empty': _.isEmpty(yesterdayTop3)}">
            <div class="yesterday-top-3" v-if="!_.isEmpty(yesterdayTop3)">
              <div class="yesterday-unit" v-for="(topUser, index) in yesterdayTop3">
                <div class="top-unit-left">
                  <img :src="userAvatar" class="user-avatar"/>
                </div>
                <div class="top-unit-right">
                  <div class="top-unit-cell">冠军：{{topUser.userName}}</div>
                  <div class="top-unit-cell">中奖金额：<span class="point-money">{{topUser.prize | fixedConvert2yuan}}</span>元</div>
                  <div class="top-unit-cell">奖励金额：<span class="point-money">{{topUser.amount | fixedConvert2yuan}}</span>元</div>
                </div>
                <div class="top-unit-cheat light" :class="`top-unit-cheat-${index + 1}`" @click="getCheat(topUser)"></div>
              </div>
              <div class="yesterday-unit yesterday-self-unit">
                <div class="top-unit-left">
                  <img :src="userAvatar" class="user-avatar"/>
                </div>
                <div class="top-unit-right">
                  <div class="top-unit-cell">我的排名：NO.12</div>
                  <div class="top-unit-cell">中奖金额：<span class="point-money">38000.000</span>元</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="weekly-container">
        <div class="weekly-title"></div>
        <div class="weekly-content">
          <div class="weekly-content-inner">
            <div class="flex-table">
              <div class="flex-title flex-row">
                <div class="flex-td" style="width: 98px">排名</div>
                <div class="flex-td" style="width: 136px">用户名</div>
                <div class="flex-td" style="width: 136px">总额投注</div>
                <div class="flex-td" style="width: 136px">奖励金额</div>
              </div>
              <div class="flex-body flex-row" v-for="userInfo in formatWeeklyTop10">
                <div class="flex-td" style="width: 98px">
                  <template v-if="userInfo.ranking > 3">{{userInfo.ranking}}</template>
                  <template v-else>
                    <span :class="`top-${userInfo.ranking}`"></span>
                  </template>
                </div>
                <div class="flex-td" style="width: 136px" v-html="userInfo.userName"></div>
                <div class="flex-td" style="width: 136px" v-html="userInfo.bet"></div>
                <div class="flex-td" style="width: 136px"><span class="point-money" v-html="userInfo.amount"></span></div>
              </div>
              <div class="flex-body flex-row">
                <div class="flex-td" style="width: 98px">29</div>
                <div class="flex-td" style="width: 136px">polo</div>
                <div class="flex-td" style="width: 136px">1620.000</div>
                <div class="flex-td" style="width: 136px"><span class="point-money">1563.000</span></div>
              </div>
            </div>
            <div class="flex-table table-right">
              <div class="flex-title flex-row">
                <div class="flex-td" style="flex: 0 0 136px">周日投注额</div>
                <div class="flex-td" style="flex: 0 0 136px">周六投注额</div>
                <div class="flex-td" style="flex: 0 0 136px">周五投注额</div>
                <div class="flex-td" style="flex: 0 0 136px">周四投注额</div>
                <div class="flex-td" style="flex: 0 0 136px">周三投注额</div>
                <div class="flex-td" style="flex: 0 0 136px">周二投注额</div>
                <div class="flex-td" style="flex: 0 0 136px">周一投注额</div>
              </div>
              <div class="flex-body flex-row" v-for="i in 10">
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">
                  <span class="no-val"></span>
                  <span class="no-val"></span>
                </div>
              </div>
              <div class="flex-body flex-row">
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">15620.000</div>
                <div class="flex-td" style="flex: 0 0 136px">
                  <span class="no-val"></span>
                  <span class="no-val"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rule-container">
        <div class="rule-title" ref="ruleTitle"></div>
        <ul class="rules">
          <li class="rule">
            本期参与擂台的彩种包括：无限秒秒彩、QQ30秒、无限分分彩、11选5分分彩、无限三分彩、韩国乐透1.5、东京1.5分彩、新加坡2分彩！<br>
            以上8个彩种每天综合的投注额将作为活动条件；
          </li>
          <li class="rule">
            每天在以上8个彩种中的投注额之和达到前十的用户都将登上TOP10榜单，并在次日获得对应的彩金奖励；
          </li>
          <li class="rule">
            每天在这8个彩种中中奖最高的三位用户将获得额外加奖奖励，并受所有用户膜拜，获得中奖秘籍（最多中奖的投注号码）；
          </li>
          <li class="rule">
            每天参与活动前都可在活动页免费领取一张您想投注的彩种的代金券，代金券金额随机发放；
          </li>
          <li class="rule">
            除了每日排名外，活动中还将同时推出周榜单，七天为一周，周榜单累积过去七天中投注前十的用户，但只为周榜单前三的用户发放高额的奖励。
          </li>
        </ul>
      </div>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="getTicketModal" styles="">
        <div class="modal-receive-success" slot="all">
          <a data-dismiss="modal" class="modal-close btn-close"></a>
          <div class="receive-container">
            <div class="receive-content">
              亲爱的用户，您已成功领取【{{receivedCoupon.ticketName}}】<br>
              代金券<span class="text-money">{{receivedCoupon.fAmount}}元</span>，快去使用吧！
            </div>
            <div class="modal-btn-group">
              <div class="btn-cancel" data-dismiss="modal">再想想</div>
              <router-link tag="div" class="btn-confirm" :to="{path: `/bc/0/${receivedCoupon.ticketId}`}">去使用</router-link>
            </div>
          </div>
        </div>
      </x-dialog>

      <x-dialog v-model="getCheatModal" styles="">
        <div class="modal-cheat" slot="all">
          <a data-dismiss="modal" class="modal-close btn-close"></a>
          <div class="cheat-container">
            <div class="cheat-cell">
              大神投注彩种：{{currentCheat.ticketName}}
            </div>
            <div class="cheat-cell">
              大神玩法：{{currentCheat.playName}}
            </div>
            <div class="cheat-cell">
              神投注参考：
            </div>
            <div class="betting-number">
              {{currentCheat.betNum}}
            </div>
            <div class="modal-btn-group">
              <router-link tag="div" class="btn-confirm" :to="{path: `/bc/0/${currentCheat.ticketId}`}">立即投注</router-link>
            </div>
            <div class="cheat-tip">
              * 注：大神投注情况每天都在变化，该投注仅供参考
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getTicketListApi,
    getTicketCouponApi,
    getDailyListApi,
    getWeeklyListApi,
    getYesterdayTop3Api
  } from 'api/activity'

  export default {
    name: 'arena-activity',

    data() {
      return {
        ticketList: [1, 10, 18, 8],
        receiveCoupon: null,
        amount: 0,


        //昨日中奖大神
        /**
         * "ticketName": "无限分分彩",
         * "groupName": "中三",
         * "playName": "直选复式",
         * "betNum": "-,5 6 7 8 9,0 1 2 3 4,0 1 2 3 4,-",
         * "userName": "son*",
         * "prize": 78240000,
         * "amount": 1110000,
         * "userId": 100058,
         * "ticketPlayId": 10040101
         */
        yesterdayTop3: [],
        week10: {},
        top10: [],
        currentCheat: {},

        currentTop: 'today',

        getTicketModal: false,
        getCheatModal: false
      }
    },

    computed: {
      formatTicketList() {
        return _.map(this.ticketList, ticketId => {
          return ticketConfig.getComplete(ticketId)
        })
      },

      receivedCoupon() {
        if (this.receiveCoupon && this.amount) {
          return  {
            ticketName: ticketConfig.getComplete(this.receiveCoupon).info.zhName,
            fAmount: _.convert2yuan(this.amount),
            ticketId: this.receiveCoupon
          }
        } else {
          return {}
        }
      },

      formatWeeklyTop10() {
        if (this.week10) {
          _.map(this.week10.week, (userBetInfo, index) => {
            return this.formatUserInfo(userBetInfo, index)
          })
        } else {
          return {

          }
        }
      },
      currentTop10() {
        if (this.top10) {
          return _.map(this.top10, (userBetInfo, index) => {
            return this.formatUserInfo(userBetInfo, index)
          })
        } else {
          return {

          }
        }

      },
      ...mapGetters([
        'userAvatar',
      ])
    },

    methods: {
      formatUserInfo(userBetInfo, index) {
        return {
          ranking: index + 1,
          userName: userBetInfo.userName,
          bet: _.fixedConvert2yuan(userBetInfo.bet),
          amount: _.fixedConvert2yuan(userBetInfo.amount)
        }
      },
      getTicket(ticketId) {
        getTicketCouponApi({
          ticketId
        }, ({data}) => {
          if (data && data.result === 0) {
            this.amount = data.root.amount
            this.receiveCoupon = data.root.ticketId

            this.getTicketModal = true
          } else {
            Global.ui.notification.show(`<div class="m-bottom-lg">领取失败！${data.msg}</div>`)
          }
        })
      },

      getCheat(topUser) {
        this.currentCheat = {
          ticketName: topUser.ticketName,
          playName: `${topUser.groupName}_${topUser.playName}`,
          betNum: topUser.betNum,
          //todo 等待后端数据
          ticketId: topUser.ticketId
        }
        this.getCheatModal = true
      },

      scrollToRule() {
        Velocity(document.body, 'scroll', {
          offset: this.$refs.ruleTitle.offsetTop,
          mobileHA: false
        })
      },

      getDailyList() {
        getDailyListApi(({data}) => {
          if (data && data.result === 0) {
            this.top10 = data.root.dataList
          }
        })
      },

      getWeeklyList() {
        getWeeklyListApi(({data}) => {
          if (data && data.result === 0) {
            this.week10 = data.root
          } else {
            Global.ui.notification.show(`<div class="m-bottom-lg">获取周投注富豪榜top10失败！${data.msg}</div>`)
          }
        })
      }
    },

    mounted() {
      getTicketListApi(({data}) => {
        if (data && data.result === 0) {
          this.ticketList = data.root.tickets
          this.receiveCoupon = data.root.receiveCoupon
        } else {
          Global.ui.notification.show(`<div class="m-bottom-lg">${data.msg}</div>`)
        }
      })

      this.getDailyList()

      this.getWeeklyList()

      getYesterdayTop3Api(({data}) => {
        if (data && data.result === 0) {
          this.yesterdayTop3 = data.root
        } else {
          Global.ui.notification.show(`<div class="m-bottom-lg">获取昨日前三失败！${data.msg}</div>`)
        }
      })

    }
  }
</script>

<style lang="scss" scoped>
  .arena-activity {
    height: 3067px;
    background: url(./assets/bg-square.png) repeat;
    position: relative;

    //bg

    .bg-top {
      position: absolute;
      background: url(./assets/bg-top.png) top center no-repeat;
      width: 100%;
      height: 916px;
      top: 0;
    }
    .bg-opacity {
      position: absolute;
      background: url(./assets/bg-opacity.png) top center no-repeat;
      width: 100%;
      height: 901px;
      bottom: 0;
    }

    .main-content {
      position: relative;
      padding-top: 325px;
      text-align: center;
    }

    .activity-tip {
      background-image: url(./assets/top-tip.png);
      width: 357px;
      height: 21px;
      margin: 200px auto 0 auto;
    }

    .activity-date {
      color: #731e46;
      font-size: 16px;
    }

    //tickets
    .ticket-container {
      display: flex;
      justify-content: center;
      margin-top: 40px;
      .ticket-icon {
        background-image: url(./assets/ticket-icon.png);
        width: 113px;
        height: 112px;
        margin: 0 auto 22px auto;
        transition: all .3s;
        &:hover {
          transform: translateY(-10px);
        }
      }

      .ticket-unit {
        padding: 0 10px;
      }

      .ticket-name {
        color: #ffeee0;
        font-size: 16px;
        padding-top: 35px;
      }

      .ticket-btn {
        background-image: url(./assets/ticket-btn.png);
        width: 120px;
        height: 40px;
        color: #ffeee0;
        font-size: 16px;
        line-height: 40px;
        cursor: pointer;

        &:hover {
          background-image: url(./assets/ticket-btn-hover.png);
          color: #eaeae9;
        }

        &.ticket-btn-received {
          background-image: url(./assets/ticket-btn-received.png);
          cursor: not-allowed;
        }
      }
    }

    //daily
    .daily-container {
      .daily-title {
        background-image: url(./assets/daily-title.png);
        width: 985px;
        height: 66px;
        margin: 50px auto 15px;
      }

      .daily-table-wrapper {
        flex: 0 0 616px;
        margin: 40px 20px;
      }

      .daily-top {
        height: 75px;
        line-height: 75px;
        display: flex;
        position: relative;
      }

      .daily-content {
        background-image: url(./assets/prized-daily.png);
        width: 1100px;
        height: 810px;
        margin: 0 auto;
        display: flex;

        .daily-left {
          flex: 1 0 0;
          padding-left: 15px;
          left: 0;
        }
        .daily-right {
          padding-right: 15px;
          right: 0;
        }

        .daily-left, .daily-right {
          cursor: pointer;
          display: flex;
          color: #afd2f4;
          font-size: 14px;
          align-items: center;
          flex: 0 0 80px;
          position: absolute;
        }

        .arrow {
          background-image: url(./assets/arrow-left.png);
          width: 12px;
          height: 18px;
          margin-bottom: 2px;
          margin-right: 4px;

          &.right {
            margin-bottom: 2px;
            margin-left: 4px;
            transform: rotate(180deg);
          }
        }

        .yesterday-history {
          background-image: url(./assets/prized-top3.png);
          width: 430px;
          height: 752px;
          margin: 40px 0;
          position: relative;

          &.prized-top-empty {
            background-image: url(./assets/prized-top-empty.png);
          }

          .top-unit-cheat {
            width: 96px;
            height: 106px;
            cursor: pointer;
          }

          @for $i from 1 through 3 {
            .top-unit-cheat-#{$i} {
              background-image: url(./assets/book-#{$i}.png);
            }
          }

          .yesterday-top-3 {
            padding-top: 84px;
          }

          .yesterday-unit {
            display: flex;
            padding-top: 58px;

            &.yesterday-self-unit {
              position: absolute;
              bottom: 29px;
              left: -1px;

              .top-unit-left {
                margin-left: 37px;
              }
              .top-unit-right {
                margin-top: 10px;
              }
            }
          }

          .top-unit-left {
            margin-left: 39px;
          }

          .top-unit-right {
            text-align: left;
            margin-left: 22px;
            width: 180px;
            font-size: 14px;
            line-height: 29px;
            color: #b5d9fb;
            /*margin-right: 30px;*/
          }
        }
      }

      .flex-body {
        &:hover {
          .flex-td {
            background-color: #0e1329;
          }
        }

        &:last-of-type {
          .flex-td {
            background-color: #1c3161;
          }
        }
      }
    }

    .weekly-container {
      .weekly-title {
        background-image: url(./assets/weekly-title.png);
        width: 985px;
        height: 73px;
        margin: 45px auto 15px;
      }
      .weekly-content {
        background-image: url(./assets/prized-weely-wrapper.png);
        width: 1100px;
        height: 726px;
        margin: 0 auto;
      }
      .weekly-content-inner {
        padding: 20px 17px 20px 21px;
        display: flex;
      }

      .table-right {
        width: 552px;
        overflow-x: auto;
      }
      .no-val {
        width: 17px;
        height: 1px;
        margin-right: 5px;
        background-color: #fbb5b5;

        &:last-of-type {
          margin-right: 0;
        }
      }

      .flex-table {
        .flex-td {
          color: #eba9a9;
        }
        .flex-body {
          background-color: #6a2c33;
          &:last-of-type {
            .flex-td {
              background-color: #491c20;
            }
          }
        }
      }

      .table-right {
        .flex-body {
          background-color: #5a252b;
          &:last-of-type {
            .flex-td {
              background-color: #3e181b;
            }
          }
        }
      }
    }
  }

  //rule-container

  .rule-container {

    .rule-title {
      background-image: url(./assets/activity-rule.png);
      width: 985px;
      height: 66px;
      margin: 45px auto;
    }

    .rules {
      width: 1100px;
      list-style: none;
      text-align: left;
      margin: 0 auto;
      .rule {
        font-size: 16px;
        line-height: 30px;
        color: #7b9ab8;
        padding-left: 30px;
        margin-bottom: 16px;
        position: relative;

        &:before {
          position: absolute;
          content: '';
          left: 0;
          top: 8px;
          background-image: url(./assets/rule-list-style.png);
          width: 14px;
          height: 14px;
        }
      }
    }
  }

  .point-money {
    color: #e9e195;
  }

  @for $i from 1 through 3 {
    .top-#{$i} {
      background-image: url(./assets/top-#{$i}.png);
      width: 27px;
      height: 34px;
      display: inline-block;
    }
  }

  .flex-table {
    .flex-row {
      display: flex;
    }

    .flex-td {
      border: 1px solid #071632;
      text-align: center;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all .3s;
    }

    .flex-title {
      .flex-td {
        background-color: #13366f;
        height: 35px;
        line-height: 35px;
      }
    }
  }

  .modal-receive-success {
    background-image: url(./assets/modal-receive-success.png);
    width: 552px;
    height: 378px;
    position: relative;

    .receive-content {
      color: #163c7b;
      font-size: 16px;
      line-height: 34px;
    }

    .receive-container {
      padding-top: 130px;
      padding-left: 43px;
      text-align: center;
    }
    .text-money {
      color: #8c3444;
    }
  }

  .modal-cheat {
    background-image: url(./assets/modal-cheats.png);
    width: 522px;
    height: 368px;
    position: relative;

    .cheat-container {
      padding-top: 90px;
      padding-left: 220px;
      text-align: left;
      color: #163c7b;
    }

    .cheat-cell {
      font-size: 16px;
      line-height: 34px;
    }

    .betting-number {
      font-size: 12px;
      line-height: 18px;
      width: 284px;
      height: 68px;
      background-color: rgba(9, 13, 41, 0.2);
      padding: 8px;
      box-sizing: border-box;
      overflow-y: auto;
      word-wrap: break-word;
    }

    .cheat-container .modal-btn-group {
      margin: 10px 0;
      justify-content: start;
      text-align: center;
    }

    .cheat-tip {
      color: #163c7b;
      margin-left: -30px;
    }
  }

  .modal-btn-group {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    line-height: 46px;
    margin-top: 50px;
  }

  .modal-close {
    background-image: url(./assets/modal-close.png);
    width: 22px;
    height: 22px;
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .btn-cancel {
    background-image: url(./assets/btn-gold.png);
    width: 140px;
    height: 46px;
    margin-right: 40px;
    cursor: pointer;
  }

  .btn-confirm {
    background-image: url(./assets/btn-blue.png);
    width: 140px;
    height: 46px;
    cursor: pointer;
  }

  .float-rule-toolbar {
    background-image: url(./assets/float-rule-toolbar.png);
    width: 129px;
    height: 265px;
    position: fixed;
    right: 0;
    top: 300px;
    z-index: 1;
    cursor: pointer;
  }

  .cloud {
    background: url(./assets/cloud.png) repeat-x;
    width: 1899px;
    height: 705px;
    position: absolute;

    animation: cloud-float 15s linear infinite;
  }

  @keyframes cloud-float {
    from {
    }

    to {
      background-position-x: 1899px;
    }
  }

  .light {
    position: relative;
    display: inline-block;

    &:hover {
      &:before {
        position: absolute;
        left: 10%;
        top: 10%;
        width: 80%;
        height: 80%;
        background: #fff;
        filter: blur(20px);
        content: "";
        opacity: 0;
        animation: flash 3s ease-out alternate infinite;
      }
    }
  }

  @keyframes flash{
    0% {
      opacity: .1;
    }
    20% {
      opacity: .2;
    }
    30% {
      opacity: .1;
    }
    40% {
      opacity: .2;
    }
    50% {
      opacity: .1;
    }
    70% {
      opacity: .2;
    }
    80% {
      opacity: .1;
    }
    90% {
      opacity: .2;
    }
    100% {
      opacity: .1;
    }
  }
</style>
