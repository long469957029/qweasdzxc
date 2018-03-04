<template>
  <div>
    <!--  banner区 -->
    <div class="dashboard-banner">
      <slide-show></slide-show>
    </div>

    <!-- 快报 news -->
    <div class="db-bulletin-container">
      <div class="dashboard-bulletin">
        <div class="bulletin-logo"></div>
        <div class="bulletin-content js-bulletin-marquee">
          <notice></notice>
        </div>
      </div>
    </div>
    <div class="dashboard-container">
      <div class="dashboard-row">
        <!-- 讯息轮播区块 -->
        <div class="col-md-9 db-shadow carousel slide" @mouseover="clearGameInv"
             @mouseout="runGameInv">
          <ol class="db-carousel-indicators">
            <li v-for="item in gameCount" :class="{active: gameIndex === item}" @click="gameGoTo(item)"
                :key="item"></li>
          </ol>
          <div class="dashboard-carousel-table  carousel-inner">
            <!-- 优惠讯息 真人-->
            <transition name="game-contant">
              <div class="dashboard-row-contant clearfix" v-show="gameIndex === 1">
                <router-link to="rc" class="db-game-ad db-ah-ad"></router-link>
                <div class="carousel-table-content">
                  <div class="dashboard-row-inner">
                    <div class="content-item-2x db-ah-bjl clearfix">
                      <div class="content-text">
                        <div>百家乐游戏规则简单，是世界各地赌场中最受欢迎</div>
                        <div>的扑克游戏</div>
                      </div>
                      <div class="db-ah-play-btn db-ah-play-btn-blue" @click="startGame(1,1,1)">立即游戏</div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="dashboard-row-inner">
                    <div class="db-ah-sb clearfix">
                      <div class="content-text">
                        <div>游戏节奏明快，投注组合丰富</div>
                        <div>深受亚洲人喜爱</div>
                      </div>
                      <div class="db-ah-play-btn db-ah-play-btn-green " @click="startGame(1,2,2)">立即游戏</div>
                    </div>
                    <div class="db-ah-lp clearfix">
                      <div class="content-text">
                        <div>游戏规则简单，投注方式多样</div>
                        <div>趣味十足</div>
                      </div>
                      <div class="db-ah-play-btn db-ah-play-btn-purple " @click="startGame(1,2,2)">立即游戏</div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                </div>
                <div class="clearfix"></div>
              </div>
            </transition>
            <!-- 优惠讯息 老虎机-->
            <transition name="game-contant">
              <div class="dashboard-row-contant clearfix" v-show="gameIndex === 2">
                <router-link to="sc" class="db-game-ad db-slot-ad "></router-link>
                <div class="carousel-table-content">
                  <!--<div class="dashboard-row-inner">-->
                  <div class="col-md-6" v-for="item in PTGameList" :key="item.gameId">
                    <div class="content-item-1x">
                      <!--<span class="db-slot-icon new"></span>-->
                      <div class="db-slot-name">{{item.gameName}}</div>
                      <img class="db-slot-img" :src="locUrl + item.imageUrl"/>
                      <div class="db-slot-mask">
                        <div class="db-slot-play-btn" @click="startGame(3,item.channelId,item.gameId)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
            <transition name="game-contant">
              <div class="dashboard-row-contant clearfix" v-show="gameIndex === 3">
                <router-link to="fh" class="db-game-ad db-gg-ad "></router-link>
                <div class="carousel-table-content">
                  <div class="game-gg" @click="startGame(1,1,5)"></div>
                </div>
              </div>
            </transition>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-md-3">
          <dashboard-mall></dashboard-mall>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="dashboard-row">
        <!-- 动态区块 -->
        <div class="col-md-9">
          <div class="db-ticket db-shadow">
            <div class="db-block-border"></div>
            <div class="db-ticket-ad"></div>
            <div class="db-ticket-game">
              <ticket-hot></ticket-hot>
            </div>
          </div>
        </div>
        <!-- 新人大礼包 -->
        <div class="col-md-3">
          <div class="db-activity db-shadow">
            <div class="db-block-border"></div>
            <router-link to="/aa">
              <div class="db-activity-content"></div>
            </router-link>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {getIndexGameApi} from 'api/dashboard'
  import slideShow from './slideShow'
  import notice from './notice'
  import ticketHot from './ticket-hot'
  import dashboardMall from './dashboard-mall'
  import {
    getGameListApi,
    getGameUrlApi,
  } from 'api/gameCenter'

  export default {
    name: "dashboard",
    components: {
      slideShow,
      notice,
      ticketHot,
      dashboardMall
    },
    data() {
      return {
        gameIndex: 1,
        gameInvTime: 5000,
        gameCount: 3,
        PTGameList: [],
        mallList: [],
        handicapTicketList: [],
        classicTicketLIst: [],
        ticketType: 1,
        ticketCount: 0,
        ticketIndex: 1,
        showArrowBtn: false,
        locUrl: 'http://' + window.location.host,
      }
    },
    methods: {
      gameGoTo(index) {
        this.gameIndex = index > this.gameCount ? 1 : index
      },
      runGameInv() {
        this.gameInv = setInterval(() => {
          this.gameGoTo(this.gameIndex + 1)
        }, this.gameInvTime)
      },
      clearGameInv() {
        clearInterval(this.gameInv)
      },
      showTicket(type) {
        this.ticketCount = type === 1 ? this.handicapTicketList.length : this.classicTicketLIst.length
        this.ticketType = type
      },
      showArrow() {
        this.showArrowBtn = !this.showArrowBtn
      },
      ticketSwitch(type) {
        const arr = this.ticketType === 1 ? this.handicapTicketList : this.classicTicketLIst
        if (type === 'left') {
          arr.unshift(arr.pop())
        } else {
          arr.push(arr.shift())
        }
        if (this.ticketType === 1) {
          this.handicapTicketList = arr
        } else {
          this.classicTicketLIst = arr
        }
      },
      progressWidth(num) {
        const width = num > 4000 ? '100%' : (num > 1000 ? `${_(num).div(4000)}%` : '25%')
        return `width:${width}`
      },
      showLogin() {
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
      },
      startGame(type, channelId, gameId) {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进入该游戏，请先注册正式游戏账号', {modalDialogShadow: 'modal-dialog-shadow'})
          return false
        }
        if (!this.getLoginStatus) {
          this.showLogin()
        } else {
          let flag = false
          if (channelId === 3) {
            Global.ui.notification.show('暂未开放，敬请期待')
            return false
          }
          if (Global.memoryCache.get('acctInfo').foundsLock) {
            Global.ui.notification.show('资金已锁定，暂不能进入游戏')
            return false
          }
          getGameListApi()
            .done((data) => {
                if (data && data.result === 0) {
                  _(data.root).find((item) => {
                    if (item.channelId === channelId && item.type === type) {
                      if (item.status === 0) {
                        flag = true
                        return true
                      } else if (item.status === 1) {
                        Global.ui.notification.show('当前游戏处于关闭状态，您可以尝试其他游戏！')
                      } else if (item.status === 2) {
                        Global.ui.notification.show(`平台官方维护中，维护时间：${
                          _(item.mStart).toTime()}至${_(item.mEnd).toTime()}`)// ,{displayTime:2000}
                      }
                      return false
                    }
                  })
                }
              }
            )
          if (flag) {
            let url = ''
            getGameUrlApi({gameId})
              .done((data) => {
                if (data && data.result === 0) {
                  if (data.root && data.root.url && !_.isEmpty(data.root.url)) {
                    url = data.root.url
                  }
                }
              })
            let gameType = 0
            if (type === 3) {
              gameType = channelId === 4 ? 3 : 6
            } else {
              gameType = gameId - 1
            }
            window.open(`./game.html?type=${gameType}&src=${url}`)
          }
        }
      },
    },
    computed: {
      ...mapGetters([
        'topClassicalTicket',
        'topHandicapTicket',
        'getLoginStatus'
      ])
    },
    mounted() {
      getIndexGameApi(
        ({data}) => {
          if (data && data.result === 0) {
            this.PTGameList = data.root.indexGames || this.PTGameList
            this.runGameInv()
          }
        }
      )
    },
    destroyed() {
      this.clearGameInv()
    }
  }
</script>
<style lang="scss" scoped>
  @mixin transition-cfg {
    transition: all .5s;
  }

  .game-contant-enter {
    transform: translateX(900px);
  }

  .game-contant-enter-active {
    transition: all .5s;
  }

  .game-contant-leave-active {
    transform: translateX(-900px);
    @include transition-cfg;
  }

  body, .carousel-table-content {
    background: $def-white-color;
  }

  @mixin center-container {
    position: relative;
    box-sizing: border-box;
    width: 1200px;
    margin: 0 auto;
  }

  @mixin inline-block {
    display: inline-block;
    vertical-align: top;
  }

  .dashboard-banner {
    width: 100%;
    height: 450px;
    overflow: hidden;
    position: relative;
  }

  .db-bulletin-container {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 30px;
  }

  .dashboard-bulletin {
    @include center-container;
    height: 50px;
    line-height: 50px;
    color: #707070;
    font-size: 14px;

    > div {
      @include inline-block;
    }

    .bulletin-logo {
      width: 140px;
      height: 50px;
      line-height: 50px;
      text-align: right;
      background: url('./misc/db-notice.png') no-repeat center;
      position: relative;
      &:after {
        content: '';
        display: block;
        height: 100%;
        width: 40px;
        position: absolute;
        background: linear-gradient(to right, $def-white-color, transparent);
        right: -44px;
        z-index: 2;
      }
    }

    .bulletin-content {
      width: 1055px;
      height: 50px;
    }
  }

  .dashboard-container {
    @include center-container();
    margin-bottom: 130px;
    * {
      box-sizing: border-box;
    }
    .db-carousel-indicators {
      left: 11%;
      /*width: 10%;*/
      margin-left: 0;
      padding: 8px 15.5px;
      background: rgba(0, 0, 0, .4);
      border-radius: 13px;
      position: absolute;
      display: block;
      z-index: 2;
      bottom: 20px;
      li {
        display: inline-block;
        margin-left: 7.5px;
        margin-right: 7.5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .5);
        cursor: pointer;
        &.active {
          background: rgba(255, 255, 255, 1);
        }
      }
    }
  }

  .dashboard-carousel-table {
    height: 460px;
    font-size: 0;
    background: $def-white-color;
    position: relative;
    .db-game-ad {
      width: 273px;
      height: 442px;
      float: left;
      display: block;
      margin-top: 9px;
      margin-left: 9px;
      &.db-ah-ad {
        background: url('./misc/db-ah-ad.png') no-repeat center;
      }
      &.db-slot-ad {
        background: url('./misc/db-slot-ad.png') no-repeat center;
      }
      &.db-gg-ad {
        background: url('./misc/db-gg-ad.png') no-repeat center;
      }
    }
    .dashboard-row-contant {
      /*font-size: 0;*/
      /*display: inline-block;*/
      /*margin: 9px;*/
      position: absolute;
    }

    .carousel-table-content {
      width: 609px;
      height: 442px;
      float: left;
      margin-top: 9px;
      margin-left: 9px;
      .content-item-1x {
        /*background: url('./misc/db-slot-bg.png') no-repeat center;*/
        width: 295px;
        height: 216px;
        display: inline-block;
        vertical-align: top;
        margin-right: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        position: relative;
        .db-slot-name {
          /*padding: 10px 20px;*/
          position: absolute;
          bottom: 0px;
          left: 83px;
          width: 128px;
          height: 33px;
          text-align: center;
          line-height: 33px;
          font-size: $font-md;
          color: $def-white-color;
          background-color: #42495c;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;

        }
        .db-slot-img {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
        }
        .db-slot-mask {
          position: absolute;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .4);
          display: block;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity .5s;
          .db-slot-play-btn {
            margin: 50px 0 0 108px;
            width: 80px;
            height: 80px;
            background: url("./misc/db-slot-btn.png") no-repeat;
            border-radius: 50%;
            cursor: pointer;
            transition: transform .5s;
          }
        }
        .db-slot-icon {
          position: absolute;
          width: 45px;
          height: 25px;
          left: -3px;
          top: -3px;
          z-index: 2;
          font-size: $font-xs;
          color: $def-white-color;
          padding-left: 5px;
          line-height: 20px;
          &.new {
            background: url("./misc/db-slot-new.png") no-repeat;
          }
          &.hot {
            background: url("./misc/db-slot-hot.png") no-repeat;
          }
        }
        &:hover {
          .db-slot-mask {
            opacity: 1;
          }
          .db-slot-play-btn {
            transform: rotate(360deg);
          }
        }
      }
      .game-gg {
        display: block;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: url("./misc/gg-game-bg.png") no-repeat;
      }
    }

  }

  .dashboard-row {
    margin-bottom: 30px;
  }

  .dashboard-row-inner {
    font-size: 0;
    display: inline-block;
    .content-item-2x {
      width: 600px;
    }
    .db-ah-bjl {
      background: url('./misc/db-ah-bjl.png') no-repeat center;
      height: 236px;
      margin-bottom: 9px;
    }
    .db-ah-sb {
      display: inline-block;
      background: url('./misc/db-ah-sb.png') no-repeat center;
      margin-right: 9px;
      width: 296px;
      height: 197px;
    }
    .db-ah-lp {
      display: inline-block;
      background: url('./misc/db-ah-lp.png') no-repeat center;
      width: 295px;
      height: 197px;
    }
    .content-text {
      display: block;
      font-size: $font-xs;
      color: $new-inverse-color;
      margin-top: 60px;
      margin-left: 29px;
      line-height: 18px;
    }
    .db-ah-play-btn {
      position: relative;
      width: 120px;
      height: 38px;
      margin-top: 45px;
      margin-left: 27px;
      border: 1px solid #fff;
      border-radius: 19px;
      line-height: 34px;
      text-align: center;
      background: transparent;
      display: block;
      font-size: $font-md;
      transition: color, background .5s;
      cursor: pointer;
      &:hover {
        color: $def-white-color;
      }
    }
    .db-ah-play-btn-blue {
      color: #4f84da;
      border: 1px solid #4f84da;
      &:hover {
        background: #4f84da;
      }
    }
    .db-ah-play-btn-green {
      color: #14b1bb;
      border: 1px solid #14b1bb;
      &:hover {
        background: #14b1bb;
      }
    }
    .db-ah-play-btn-purple {
      color: #9f6ec5;
      border: 1px solid #9f6ec5;
      &:hover {
        background: #9f6ec5;
      }
    }
  }

  .db-ticket {
    height: 330px;
    background: #fff;

    .db-ticket-ad {
      width: 214px;
      height: 326px;
      float: left;
      background: url('./misc/db-ticket-ad.png') no-repeat center;

    }
    .db-ticket-game {
      float: left;
      margin: 9px 0;
      padding: 0 9px;
      position: relative;
      border-left: 1px solid $sec-line-color;
    }
  }

  .db-activity {
    height: 330px;
    margin-left: 12px;
    background: #fff;
  }

  .db-block-border {
    height: 2px;
    width: 100%;
    background: linear-gradient(to right, #4fbab0, #598bee);
  }

  .db-activity-content {
    height: 328px;
    background: url('./misc/db-new-activity.png');
  }

  .db-shadow {
    box-shadow: 0 1px 15px -2px #ccc;
  }
</style>
