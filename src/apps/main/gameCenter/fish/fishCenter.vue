<template>
  <div class="fc-bg-dark">
    <div class="fc-bg">
      <div class="fc-container">
        <div class="fc-item ag">
          <div class="fc-item-container">
            <div class="fc-item-amount">
              AG余额：<span class="js-fc-agAmount">{{_(agAmount).formatDiv(10000, { fixed: 2 })}}</span>
            </div>
            <div :class="['fc-item-link', {'js-header-recharge':getLoginStatus}]" data-name="jsFcTransfer" @click="showLogin">
              余额转帐
              <span class="fc-right-icon"></span>
            </div>
            <div class="fc-item-btn primary ripple-btn" @click="startGame(1,1,5)">立即游戏</div>
            <div class="fc-item-btn secondary ripple-btn" @click="showDownLoad(5)">手机版</div>
          </div>
        </div>
        <div class="fc-item gg">
          <div class="fc-item-container">
            <div class="fc-item-amount">
              GG余额：<span class="js-fc-ggAmount">{{_(ggAmount).formatDiv(10000, { fixed: 2 })}}</span>
            </div>
            <div :class="['fc-item-link', {'js-header-recharge':getLoginStatus}]" data-name="jsFcTransfer" @click="showLogin">
              余额转帐
              <span class="fc-right-icon"></span>
            </div>
            <div class="fc-item-btn primary ripple-btn" @click="startGame(4,6,6)">立即游戏</div>
            <div class="fc-item-btn secondary ripple-btn" @click="showDownLoad(6)">手机版</div>
          </div>
        </div>
      </div>
      <div class="fc-bubble-wrap">
        <div class="bubble x1"></div>
        <div class="bubble x2"></div>
        <div class="bubble x3"></div>
        <div class="bubble x4"></div>
        <div class="bubble x5"></div>
        <div class="bubble x6"></div>
        <div class="bubble x7"></div>
        <div class="bubble x8"></div>
        <div class="bubble x9"></div>
        <div class="bubble x10"></div>
      </div>
      <div class="fc-enviroment"></div>
    </div>
  </div>
</template>
<script>
  import {
    getGameListApi,
    getSummaryApi,
    getGameUrlApi
  } from 'api/gameCenter'
  export default{
    name: 'fish-center',
    data(){
      return{
        agAmount:0,
        ggAmount:0
      }
    },
    watch: {
      getLoginStatus: function () {
        if(this.getLoginStatus){
          this.getGameList()
        }
      }
    },
    computed: {
      ...mapGetters([
        'getLoginStatus'
      ])
    },
    methods:{
      getGameList(){
        getSummaryApi(
          ({data}) => {
            if(data && data.result === 0){
              const { gameBalance } = data.root
              this.agAmount = _.find(gameBalance, { channelId: 1 }).balance
              this.ggAmount = _.find(gameBalance, { channelId: 6 }).balance
            }else{
              Global.ui.notification.show('获取资金余额失败')
            }
          }
        )
      },
      startGame(type,channelId,gameId){
        if(!this.getLoginStatus){
          this.showLogin()
        }else{
          let flag = false
          getGameListApi()
            .done((data) => {
                if (data && data.result === 0) {
                  _(data.root).find((item) => {
                    if (item.channelId === channelId && item.type === type) {
                      if (item.status === 0) {
                        flag = true
                        return true
                      } else if (item.status === 1) {
                        Global.ui.notification.show('当前游戏处于关闭状态，您可以尝试其他游戏')
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
          if(flag){
            let url = ''
            getGameUrlApi({gameId})
              .done((data) => {
                if (data && data.result === 0) {
                  if (data.root && data.root.url && !_.isEmpty(data.root.url)) {
                    url = data.root.url
                  }
                }
              })
            window.open(`./game.html?type=${gameId - 1}&src=${url}`)
          }
        }
      },
      showLogin(){
        if(!this.getLoginStatus){
          this.$store.commit(types.TOGGLE_LOGIN_DIALOG,true)
        }
      },
      showDownLoad(gameId){
        this.$store.commit(types.TOGGLE_GMAE_DOWN_LOAD,{showDialog:true,gameId})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../misc/mixin';

  [class*="col-"] {
    background: transparent !important;
  }

  .fc-bg-dark {
    @include border-box();
    @include banner-background('./images/fc-bg-dark.png');
    width: 100%;
    height: 852px;
    overflow: hidden;
  }

  .fc-enviroment {
    width: 716px;
    height: 790px;
    background: url('./images/fc-enviroment.png');
    position: absolute;
    left: 42px;
    bottom: -164px;
    z-index: 0;
    transform: translateY(80%);
    animation: moveUp 2s .5s forwards ease-in;
  }

  .fc-bg {
    @include banner-background('./images/fc-bg.png');
    width: 100%;
    height: 852px;
    opacity: 0;
    animation: fadeIn 1s forwards ease-in;
  }

  .fc-container {
    @include center-center();
    width: 1200px;
    z-index: 2;

    .fc-item {
      float: left;
      position: relative;
      z-index: 1;

      .fc-item-amount {
        color: white;
        font-size: 14px;
        margin-bottom: 11px;

        span {
          font-size: 18px;
        }
      }

      .fc-item-link {
        font-size: 14px;
        text-decoration: underline;
        color: white;
        margin-bottom: 39px;
        cursor: pointer;

        &:hover, &:active {
          text-decoration: none;
        }
      }

      .fc-item-btn {
        width: 141px;
        height: 41px;
        text-align: center;
        color: white;
        font-size: 14px;
        line-height: 41px;
        border-radius: 20px / 20px;
        box-shadow: 0 1px 1px 0 #046186;
        cursor: pointer;
        transition: all .3s;

        &.primary {
          background: $prominent-color;
          margin-bottom: 17px;

          &:hover, &:active {
            background: $prominent-hover-color;
            box-shadow: none;
          }
        }

        &.secondary {
          background: $new-main-deep-color;

          &:hover, &:active {
            background: $new-main-deep-hover-color;
            box-shadow: none;
          }
        }
      }

      &.ag {
        width: 520px;
        height: 730px;
        background: url('./images/fc-item-gg.png');
        margin: -373px -60px 0 130px;

        .fc-item-container {
          position: absolute;
          width: 289px;
          height: 358px;
          bottom: 46px;
          left: 113px;
          padding: 108px 30px;
        }
      }

      &.gg {
        width: 500px;
        height: 698px;
        background: url('./images/fc-item-ag.png');
        margin-top: -340px;

        .fc-item-container {
          position: absolute;
          width: 289px;
          height: 358px;
          bottom: 46px;
          left: 112px;
          padding: 108px 30px;
        }
      }

      .fc-right-icon {
        background: url('./images/fc-right-icon.png');
        width: 15px;
        height: 15px;
        display: inline-block;
        vertical-align: text-bottom;
      }
    }
  }

  .fc-bubble-wrap {
    @include center-container(1200px);
    z-index: 1;
  }

  @keyframes moveUp {
    0% {
      transform: translateY(80%)
    }

    100% {
      transform: translateY(0%)
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  /* KEYFRAMES */

  @keyframes animateBubble {
    0% {
      margin-top: 1000px;
    }
    100% {
      margin-top: -100%;
    }
  }

  @keyframes sideWays {
    0% {
      margin-left:0px;
    }
    100% {
      margin-left:50px;
    }
  }

  /* ANIMATIONS */

  .x1 {
    animation: animateBubble 25s linear infinite, sideWays 2s ease-in-out infinite alternate;
    left: -5%;
    top: 5%;
    transform: scale(0.6);
  }

  .x2 {
    animation: animateBubble 20s linear infinite, sideWays 4s ease-in-out infinite alternate;
    left: 5%;
    top: 80%;
    transform: scale(0.4);
  }

  .x3 {
    animation: animateBubble 28s linear infinite, sideWays 2s ease-in-out infinite alternate;
    left: 10%;
    top: 40%;
    transform: scale(0.7);
  }

  .x4 {
    animation: animateBubble 22s linear infinite, sideWays 3s ease-in-out infinite alternate;
    left: 20%;
    top: 0;
    transform: scale(0.3);
  }

  .x5 {
    animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
    left: 30%;
    top: 50%;
    transform: scale(0.5);
  }

  .x6 {
    animation: animateBubble 21s linear infinite, sideWays 2s ease-in-out infinite alternate;
    left: 50%;
    top: 0;
    transform: scale(0.8);
  }

  .x7 {
    animation: animateBubble 20s linear infinite, sideWays 2s ease-in-out infinite alternate;
    left: 65%;
    top: 70%;
    transform: scale(0.4);
  }

  .x8 {
    animation: animateBubble 22s linear infinite, sideWays 3s ease-in-out infinite alternate;
    left: 80%;
    top: 10%;
    transform: scale(0.3);
  }

  .x9 {
    animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
    left: 90%;
    top: 50%;
    transform: scale(0.6);
  }

  .x10 {
    animation: animateBubble 26s linear infinite, sideWays 2s ease-in-out infinite alternate;
    left: 80%;
    top: 80%;
    transform: scale(0.3);
  }

  /* OBJECTS */

  .bubble {
    border-radius: 50%;
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2), inset 0px 10px 30px 5px rgba(255, 255, 255, .8);
    height: 100px;
    position: absolute;
    width: 100px;
    opacity: .9;
  }

  .bubble:after {
    background: radial-gradient(ellipse at center,  rgba(255,255,255,0.4) 0%,rgba(255,255,255,0) 60%); /* W3C */
    //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#80ffffff', endColorstr='#00ffffff',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    border-radius: 50%;
    box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.2);
    content: "";
    height: 90px;
    left: 10px;
    position: absolute;
    width: 90px;
  }

</style>
