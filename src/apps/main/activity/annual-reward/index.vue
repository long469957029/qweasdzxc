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
          <div class="data-info">团队亏损:
            <span class="num"><animated-integer :value="teamLoss | convert2yuan"></animated-integer></span></div>
          <div class="icon-x"></div>
          <div class="data-info">奖励比例:
            <span class="num"><animated-integer :value="rewardRate | convert2yuan"></animated-integer></span></div>
          <div class="icon-equal"></div>
          <div class="data-info">奖励金额:
            <span class="num"><animated-integer :value="rewardNum | convert2yuan"></animated-integer></span></div>
        </div>
        <div class="button-program">
          <div class="get-button" :class="formateQuarterGetStatus"></div>
          <div class="quarter-program">
            <span class="icon-program"></span>
            季度奖励方案>
          </div>
        </div>
        <div class="contribution">
          贡献率=（盈亏-分红）/(投注-中奖-返点)=
          <span class="num"><animated-integer :value="profitRate | convert2yuan"></animated-integer></span>
        </div>
        <div class="datail-table">
          <div class="line"></div>
          <div class="tr">
            <div class="td">团队投注：</div>
            <div class="td">团队中奖：</div>
            <div class="td">团队返点：</div>
          </div>
          <div class="line"></div>
          <div class="tr">
            <div class="td">活动成本:  1314</div>
            <div class="td">团队盈亏:  1314</div>
            <div class="td">团队分红:  1314</div>
          </div>
          <div class="line"></div>
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
        rewardNum:0,
        quarterGetStatus:0,//0未达标1未领取2已领取
        yearGetStatus:0,//0未达标1未领取2已领取
        profitRate:0,//贡献率
      }
    },
    computed:{
      formateQuarterGetStatus(){
        return this.quarterGetStatus === 0 ? 'disable' : (this.quarterGetStatus === 1 ? 'get' : 'has-get')
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
            margin-left: 5px;
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
      .button-program{
        width: 100%;
        margin-top: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 100px;
        .get-button{
          width: 218px;
          height: 85px;
          cursor: pointer;
          &.get{
            background: url("./assets/button-get.png") no-repeat;
          }
          &.disable{
            background: url("./assets/button-disable.png") no-repeat;
          }
          &.has-get{
            background: url("./assets/button-has-get.png") no-repeat;
          }
        }
        .quarter-program{
          color: #cfb58e;
          font-size: 16px;
          display: flex;
          align-items: center;
          margin-left: 48px;
          cursor: pointer;
          text-decoration: underline;
          .icon-program{
            background: url("./assets/icon-program.png") no-repeat;
            width: 30px;
            height: 34px;
            margin-right: 9px;
          }
        }
      }
      .contribution{
        width: 100%;
        font-size: 16px;
        color: #6c6d9d;
        text-align: center;
        margin-top: 50px;
        .num{
          color: #cfb58e;
        }
      }
      .datail-table{
        width: 85%;
        margin: 22px auto 0px;
        .line{
          width: 100%;
          height: 3px;
          background: url("./assets/line.png");
        }
        .tr{
          width: 100%;
          height: 65px;
          display: flex;
          justify-content: center;
          .td{
            width: 33.3%;
            height: 65px;
            line-height: 65px;
            font-size: 16px;
            color: #656695;
          }
        }
      }
    }
  }
</style>
