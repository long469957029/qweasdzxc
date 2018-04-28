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
        <div class="tab active">
          <div class="mask"></div>
          <div class="tip"></div>
          <div class="title">第一季度</div>
        </div>
        <div class="tab"></div>
        <div class="tab"></div>
        <div class="tab"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'annual-reward',
    data(){
      return{

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
    }
  }
</style>
