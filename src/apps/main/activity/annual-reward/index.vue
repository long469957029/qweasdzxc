<template>
  <div class="annual-main">
    <div class="main-head">
      <div class="head-content clearfix">
        <div class="logo"></div>
        <div class="time">活动时间:2018.13.14 ---- 2018.05.21</div>
        <div class="money money1"></div>
        <div class="money money2"></div>
        <div class="money money3"></div>
      </div>
    </div>
    <div class="container">
      <div class="nav-tab">
        <div class="tab" :class="{active:item === 2}" v-for="item in 4" :key="item">
          <div class="mask" v-if="item === 1"></div>
          <div class="tip" :class="{on:item === 1,over:item === 2,'not-open': item === 3,'expired':item === 4}"></div>
          <div class="title">第一季度</div>
          <div class="time">时间：2017.11.14～2017.11.14</div>
          <div class="money">亏损：-- --</div>
          <div class="money">奖励：-- --</div>
        </div>
      </div>
      <div class="content-info clearfix">
        <div class="data-formula">
          <div class="data-info">团队亏损:<span class="num">1314</span></div>
          <div class="icon-x"></div>
          <div class="data-info">奖励比例:<span class="num">1314</span></div>
          <div class="icon-equal"></div>
          <div class="data-info">奖励金额:<span class="num">1314</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'annual-reward',
    data(){
      return{
        startTime:'',
        endTime:'',
        teamLoss:0,
        rewardRate:0,
        rewardNum:0
      }
    }
  }
</script>
<style lang="scss" scoped>

  .annual-main{
    width: 100%;
    height: 100%;
    min-width: 1100px;
    background: url("./assets/main-bg.png");
  }
  .main-head{
    width: 100%;
    height: 524px;
    background: url("./assets/header-bg.png") no-repeat center;
    .head-content{
      width: 1100px;
      height: 524px;
      margin: 0 auto;
      position: relative;
    }
    .logo{
      width: 540px;
      height: 200px;
      background: url("./assets/head-logo.png") no-repeat;
      margin-top: 80px;
      margin-left: 120px;
    }
    .time{
      font-size: 15px;
      color: #fefefe;
      margin-left: 220px;
    }
    .money{
      position: absolute;
      &.money1{
        width: 122px;
        height: 107px;
        background: url("./assets/money1.png") no-repeat;
        top: 285px;
      }
      &.money2{
        width: 170px;
        height: 174px;
        background: url("./assets/money2.png") no-repeat;
        top: 236px;
        left: 568px;
      }
      &.money3{
        width: 100px;
        height: 143px;
        background: url("./assets/money3.png") no-repeat;
        right: 0;
        top: 150px;
      }
    }
  }
  .container{
    width: 1100px;
    margin: 0 auto;
    .nav-tab{
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: space-between;
    }
    .tab{
      width: 252px;
      height: 185px;
      background: url("./assets/tab-bg.png") no-repeat;
      position: relative;
      &.active{
        &:after{
          content: '';
          display: block;
          background: url("./assets/tab-active-arrow.png") no-repeat;
          position: absolute;
          width: 21px;
          height: 15px;
          bottom: -14px;
          left: 50%;
          margin-left: -10.5px;
        }
        .title{
          color: #70180a;
        }
        .time,.money{
          color: #cfb58e;
        }
      }
      .title{
        width: 100%;
        height: 45px;
        line-height: 50px;
        font-size: 26px;
        color: transparent;
        background-image: linear-gradient(to bottom,#66454f 10%,#201e39 90%);
        background-clip: text;
        -webkit-background-clip: text;
        font-family: ltthj;
        text-align: center;
      }
      .mask{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.2);
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 20px;
      }
      .time{
        width: 100%;
        font-size: 12px;
        color: #656695;
        text-align: center;
        margin-top: 17px;
        margin-bottom: 10px;
      }
      .money{
        width: 168px;
        height: 40px;
        background-color: #141428;
        border-radius: 3px;
        margin: 2px auto;
        font-size: 16px;
        line-height: 40px;
        color: #656695;
        text-align: center;
      }
      .tip{
        position: absolute;
        width: 70px;
        height: 74px;
        left: 0;
        top: 0;
        &.on{
          background: url("./assets/tab-tip-on.png") no-repeat;
        }
        &.over{
          background: url("./assets/tab-tip-over.png") no-repeat;
        }
        &.not-open{
          background: url("./assets/tab-tip-not-open.png") no-repeat;
        }
        &.expired{
          background: url("./assets/tab-tip-expired.png") no-repeat;
        }
      }
    }
    .content-info{
      width: 1100px;
      height: 458px;
      //background-color: #3b3b6d;
      background: rgba(59,59,109,.45);
      box-shadow: 0px 4px 16px 0px
      rgba(21, 21, 46, 0.72);
      border-radius: 20px;
      .data-formula{
        display: flex;
        width: 100%;
        height: 63px;
        margin-top: 42px;
        justify-content: center;
        align-items: center;
        .data-info{
          width: 270px;
          height: 62px;
          background-color: rgba(101, 102, 149, 0.1);
          border-radius: 5px;
          color: #cfb58e;
          font-size: 20px;
          text-align: center;
          line-height: 62px;
          .num{
            font-size: 24px;
          }
        }
        .icon-x{
          width: 24px;
          height: 24px;
          background: url("./assets/icon-X.png") no-repeat;
          margin: 0 17px;
        }
        .icon-equal{
          width: 29px;
          height: 11px;
          background: url("./assets/icon-=.png") no-repeat;
          margin: 0 17px;
        }
      }
    }
  }
</style>
