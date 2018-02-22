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
            <li :class="{active: gameIndex === 1}" @click="gameGoTo(1)"></li>
            <li :class="{active: gameIndex === 2}" @click="gameGoTo(2)"></li>
          </ol>
          <div class="dashboard-carousel-table  carousel-inner">
            <!-- 优惠讯息 真人-->
            <transition name="game-contant">
              <div class="dashboard-row-contant clearfix" v-show="gameIndex === 1">
                <router-link to="rc" class="db-game-ad db-ah-ad"></router-link>
                <div class="carousel-table-content">
                  <div class="dashboard-row-inner">
                    <div class=" content-item-2x db-ah-bjl clearfix">
                      <router-link to="rc" class="db-ah-play-btn db-ah-play-btn-blue">立即游戏</router-link>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="dashboard-row-inner">
                    <div class="db-ah-sb clearfix">
                      <router-link to="rc" class="db-ah-play-btn db-ah-play-btn-green ">立即游戏</router-link>
                    </div>
                    <div class="db-ah-lp clearfix">
                      <router-link to="rc" class="db-ah-play-btn db-ah-play-btn-purple ">立即游戏</router-link>
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
                <router-link to="aa" class="db-game-ad db-slot-ad "></router-link>
                <div class="carousel-table-content">
                  <!--<div class="dashboard-row-inner">-->
                  <div class="col-md-6" v-for="item in PTGameList" :key="item.gameId">
                    <div class="content-item-1x">
                      <span class="db-slot-icon new"></span>
                      <div class="db-slot-name">{{item.gameName}}</div>
                      <img class="db-slot-img" :src="locUrl + item.imageUrl"/>
                      <div class="db-slot-mask">
                        <router-link to="aa" class="db-slot-play-btn"></router-link>
                      </div>
                    </div>
                  </div>
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
            <div class="db-activity-content"></div>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getIndexGameApi, getMallHotListApi } from 'api/dashboard'
  import slideShow from './slideShow'
  import notice from './notice'
  import ticketHot from './ticket-hot'
  import dashboardMall from './dashboard-mall'
  export default {
    name: "dashboard",
    components: {
      slideShow,
      notice,
      ticketHot,
      dashboardMall
    },
    data () {
      return {
        gameIndex: 1,
        gameInvTime: 5000,
        gameCount: 2,
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
      gameGoTo(index){
        this.gameIndex = index > this.gameCount ? 1 : index
      },
      runGameInv(){
        this.gameInv = setInterval(() => {
          this.gameGoTo(this.gameIndex + 1)
        }, this.gameInvTime)
      },
      clearGameInv(){
        clearInterval(this.gameInv)
      },
      showTicket(type){
        this.ticketCount = type === 1 ? this.handicapTicketList.length : this.classicTicketLIst.length
        this.ticketType = type
      },
      showArrow(){
        this.showArrowBtn = !this.showArrowBtn
      },
      ticketSwitch(type){
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
      progressWidth(num){
        const width = num > 4000 ? '100%' : (num > 1000 ? `${_(num).div(4000)}%` : '25%')
        return `width:${width}`
      },
    },
    computed: {
      ...mapGetters([
        'topClassicalTicket',
        'topHandicapTicket'
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
      // getMallHotListApi(
      //   ({data}) => {
      //     if (data && data.result === 0) {
      //       this.mallList = data.root.records || this.mallList
      //     }
      //   }
      // )
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
      padding: 8px;
      background: rgba(0, 0, 0, .4);
      border-radius: 20px;
      position: absolute;
      display: block;
      z-index: 2;
      bottom: 10px;
      li {
        display: inline-block;
        margin-left: 7px;
        margin-right: 7px;
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
      &.db-ah-ad {
        background: url('./misc/db-ah-ad.png') no-repeat center;
      }
      &.db-slot-ad {
        background: url('./misc/db-slot-ad.png') no-repeat center;
      }
    }
    .dashboard-row-contant {
      font-size: 0;
      /*display: inline-block;*/
      margin: 9px;
      position: absolute;
    }

    .carousel-table-content {
      width: 609px;
      height: 442px;
      border-left: 9px solid #fff;
      float: left;
      .content-item-1x {
        background: url('./misc/db-slot-bg.png') no-repeat center;
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
          padding: 10px 20px;
          font-size: $font-md;
          color: $def-white-color;
          background-color: #414a5c;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          position: absolute;
          bottom: 0px;
        }
        .db-slot-img {
          display: block;
          width: 100%;
          height: 100%;
        }
        .db-slot-mask {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .4);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity .5s;
          .db-slot-play-btn {
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
    .db-ah-play-btn {
      position: relative;
      width: 120px;
      height: 38px;
      margin-top: 140px;
      margin-left: 27px;
      border: 1px solid #fff;
      border-radius: 19px;
      line-height: 34px;
      text-align: center;
      background: transparent;
      display: block;
      font-size: $font-md;
      transition: color, background .5s;
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
