<template>
  <div class="rc-bg">

    <div class="rc-main-container">
      <div :class="['rc-main-item', {active: activeIndex === 1}]" @mouseenter="activeIndex = 1">
        <div class="ag">
          <div class="rc-item-title">AG娱乐厅</div>
          <div class="rc-item-subtitle">
            AV女优荷官，零距离接触，感受不一样的娱乐体验
          </div>
          <div class="rc-item-hr"></div>
          <div class="rc-item-amount">
            AG余额：
            <span>{{_(agAmount).formatDiv(10000, { fixed: 2 })}}</span>
          </div>
          <div :class="['rc-item-link', {'js-header-recharge':getLoginStatus}]" data-name="jsFcTransfer" @click="showLogin">余额转帐></div>
          <div class="rc-item-hint-btn">GO<span class="go-arrow"></span></div>
          <div class="rc-item-primary-btn ripple-btn" @click="startGame(1,1,1)">立即游戏</div>
          <div class="rc-item-secondary-btn ripple-btn" @click="showDownLoad(1)">手机版</div>
          <div class="rc-item-mask"></div>
        </div>
      </div>
      <div :class="['rc-main-item', {active: activeIndex === 2}]" @mouseenter="activeIndex = 2">
        <div class="ebet">
          <div class="rc-item-title">EBET娱乐厅</div>
          <div class="rc-item-subtitle">
            动感娱乐，简洁快速，移动领先
          </div>
          <div class="rc-item-hr"></div>
          <div class="rc-item-amount">
            EBET余额：
            <span>{{_(ebetAmount).formatDiv(10000, { fixed: 2 })}}</span>
          </div>
          <div :class="['rc-item-link', {'js-header-recharge':getLoginStatus}]" data-name="jsFcTransfer" @click="showLogin">余额转帐></div>
          <div class="rc-item-hint-btn">GO<span class="go-arrow"></span></div>
          <div class="rc-item-primary-btn ripple-btn" @click="startGame(1,2,2)">立即游戏</div>
          <div class="rc-item-secondary-btn ripple-btn" @click="showDownLoad(2)">手机版</div>
          <div class="rc-item-mask"></div>
        </div>
      </div>
      <div :class="['rc-main-item', {active: activeIndex === 3}]" @mouseenter="activeIndex = 3">
        <div class="tip-info">
          <span class="text">即将上线</span>
        </div>
        <div class="bbin">
          <div class="rc-item-title">BBIN娱乐厅</div>
          <div class="rc-item-subtitle">
            亚洲老牌娱乐场，超高限额，自有非凡之处
          </div>
          <div class="rc-item-hr"></div>
          <div class="rc-item-amount">
            BBIN余额：
            <span>{{_(bbinAmount).formatDiv(10000, { fixed: 2 })}}</span>
          </div>
          <div :class="['rc-item-link', {'js-header-recharge':getLoginStatus}]" data-name="jsFcTransfer" @click="showLogin">余额转帐></div>
          <div class="rc-item-hint-btn">GO<span class="go-arrow"></span></div>
          <div class="rc-item-primary-btn ripple-btn" @click="startGame(1,3,3)">立即游戏</div>
          <div class="rc-item-secondary-btn ripple-btn" @click="showDownLoad(3)">手机版</div>
          <div class="rc-item-mask"></div>
        </div>
      </div>

      <div class="rc-reward-container">
        <div class="rc-reward-icon"></div>
        <div class="rc-reward-title">最新中奖信息：</div>
        <div class="rc-reward-list">
          <!--<li v-for="(item,index) in prizeList" :key="index">-->
            <!--恭喜{{item.userName}}在{{item.gameName}}中奖<span class="amount">{{_(item.prize).convert2yuan()}}</span>元-->
          <!--</li>-->
          <marquee :content="formatePrizeList"></marquee>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getGameListApi,
    getSummaryApi,
    getGameUrlApi,
    getPrizeListApi
  } from 'api/gameCenter'
  import Marquee from 'com/vue-marquee'
  export default {
    name:'real-center',
    components:{
      Marquee
    },
    data(){
      return{
        agAmount:0,
        bbinAmount:0,
        ebetAmount:0,
        activeIndex:1,
        prizeList:[]
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
      ]),
      formatePrizeList:function () {
        let list = ''
        this.prizeList.forEach((item) => {
          list += `恭喜${item.userName}在${item.gameName}中奖<span class="amount">${_(item.prize).convert2yuan()}</span>元 /`
        })
        return list
      }
    },
    methods:{
      getGameList(){
        getSummaryApi(
          ({data}) => {
            if(data && data.result === 0){
              const { gameBalance } = data.root
              this.agAmount = _.find(gameBalance, { channelId: 1 }).balance
              this.bbinAmount = _.find(gameBalance, { channelId: 3 }).balance
              this.ebetAmount = _.find(gameBalance, { channelId: 2 }).balance
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
        if(gameId === 3){
          Global.ui.notification.show('暂未开放，敬请期待')
        }else{
          this.$store.commit(types.TOGGLE_GMAE_DOWN_LOAD,{showDialog:true,gameId})
        }
      },
      getPrizeList(){
        getPrizeListApi({ gameType:1 },
          ({data}) => {
            if(data && data.result === 0){
              this.prizeList = [...this.prizeList, ...data.root.records]
            }
          },
          ({data}) => {

          }
        )
        setTimeout(() => {
          this.getPrizeList()
        },300000)
      }
    },
    mounted(){
      if(this.getLoginStatus){
        this.getGameList()
      }
      this.getPrizeList()
    }
  }
</script>
<style lang="scss" scoped>
  @import '../misc/mixin';

  [class*="col-"] {
    background: transparent !important;
  }

  .rc-bg {
    @include banner-background('./images/rc-bg.png');
    width: 100%;
    height: 850px;

    * {
      box-sizing: border-box;
    }

    .rc-main-container {
      @include center-center();
      width: 1200px;
      height: 480px;
    }

    .rc-main-item {
      width: 240px;
      height: 100%;
      float: left;
      position: relative;
      overflow: hidden;
      .tip-info{
        width: 88px;
        height: 82px;
        background: url("./images/tip-bg.png") no-repeat;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        .text{
          color: $def-white-color;
          font-size: $font-sm;
          transform: rotate(-44deg);
          display: block;
          margin-top: 12px;
        }
      }
      > div > div {
        position: relative;
        z-index: 1;
      }

      .rc-item-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .8);
        top: 0;
        left: 0;
        z-index: 0;
        transition: all 1s;
      }

      .rc-item-hr {
        margin: 0;
        border-top: 1px solid #495962;
        width: 130px;
        height: 1px;
        opacity: 0;
      }


      .rc-item-title {
        font-size: 24px;
        color: white;
        margin-bottom: 15px;
        transition: margin-top 1s;
      }

      .rc-item-subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, .6);
        margin-bottom: 34px;
        transition: margin-top 1s;
      }

      .rc-item-amount {
        font-size: 14px;
        color: white;
        margin-bottom: 18px;
        transition: margin-top 1s;

        span {
          color: $prominent-color;
          font-size: 18px;
        }
      }

      .rc-item-link {
        color: white;
        text-decoration: underline;
        font-size: 14px;
        cursor: pointer;
        margin-bottom: 62px;
        transition: margin-top 1s;

        &:hover, &:active {
          text-decoration: none;
        }
      }

      .rc-item-hint-btn {
        width: 110px;
        height: 40px;
        border-radius: 20px / 20px;
        border: 1px solid #939292;
        font-size: 18px;
        color: rgba(255, 255, 255, .5);
        text-align: center;
        line-height: 40px;
        .go-arrow{
          width: 18px;
          height: 13px;
          display: inline-block;
          background: url("./images/go-arrow.png") no-repeat;
          margin-left: 10px;
        }
      }

      .rc-item-primary-btn, .rc-item-secondary-btn {
        position: absolute;
        bottom: 141px;
        left: 61px;
        width: 220px;
        height: 40px;
        cursor: pointer;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        border-radius: 5px;
        z-index: -1;
        opacity: 0;
      }

      .rc-item-primary-btn {
        background: $prominent-color;

        &:hover, &:active {
          background: $prominent-hover-color;
        }
      }

      .rc-item-secondary-btn {
        background: $new-main-deep-color;
        bottom: 81px;

        &:hover, &:active {
          background: $new-main-deep-hover-color;
        }
      }


      & .ag {
        background: url('./images/rc-item-ag.png');
        background-position: center;
        width: 240px;
        transition: width 1s, padding-left .5s;
        padding: 85px 27px 0 0;
        padding-left: 31px;
        height: 480px;
      }

      & .bbin {
        background: url('./images/rc-item-bbin.png');
        background-position: 65%;
        width: 240px;
        transition: width 1s, padding-left .5s;
        padding: 85px 27px 0 0;
        padding-left: 31px;
        height: 480px;
      }

      & .ebet {
        background: url('./images/rc-item-ebet.png');
        background-position: center;
        width: 240px;
        transition: width 1s, padding-left .5s;
        padding: 85px 27px 0 0;
        padding-left: 31px;
        height: 480px;
      }

      // 会因为鼠标移入而改变样式的元件
      &.active {
        width: 720px;

        & .ag, & .bbin, & .ebet {
          width: 720px;
          height: 480px;
          padding: 77px 0 0 66px;
        }

        .rc-item-title {
          font-size: 30px;
          margin-bottom: 13px;
        }

        .rc-item-subtitle {
          font-size: 16px;
          margin-bottom: 19px;
        }

        .rc-item-hr {
          opacity: 1;
          margin-bottom: 43px;
        }

        .rc-item-hint-btn {
          opacity: 0;
        }

        .rc-item-primary-btn, .rc-item-secondary-btn {
          opacity: 1;
          z-index: 1;
        }

        .rc-item-mask {
          background: rgba(26, 102, 155, 0.2);
        }
      }
    }

    .rc-reward-container {
      position: absolute;
      width: 1200px;
      height: 50px;
      bottom: -98px;
      background: url('./images/rc-reward-container.png');
      padding-left: 54px;
      line-height: 50px;

      .rc-reward-icon {
        width: 28px;
        height: 32px;
        background: url('./images/rc-reward-icon.png');
        float: left;
        margin-top: 10px;
        margin-right: 10px;
      }

      .rc-reward-title {
        font-size: 18px;
        color: white;
        margin-right: 7px;
        float: left;
      }

      .rc-reward-list {
        width: 975px;
        height: 50px;
        float: left;
        line-height: 50px;
        padding-left: 16px;

        li {
          display: inline-block;
          font-size: 14px;
          color: white;
        }

        .amount {
          color: $prominent-color;
        }
      }
    }
  }
</style>
