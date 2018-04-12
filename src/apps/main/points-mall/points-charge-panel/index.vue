<template>
  <div class="points-charge-panel">
    <div class="nav-list-charge">
      <div class="nav" :class="{active: item.id === rechargeType}" v-for="item in navList" :key="item.id"
           @click="rechargeType = item.id">
        <span class="sfa m-right-smd" :class='`sfa-${item.icon}`'></span>
        {{item.name}}
      </div>
    </div>
    <div class="container-charge">
      <div class="main">
        <div>
          <label class="title">手机号码：</label>
          <input type="text" name="number" class="number-input" v-model="rechargeNum"
                 :placeholder="rechargeType === 3 ? '请输入QQ号' : '支持移动／联通／电信／京东通信'">
        </div>
        <div class="m-top-lg" v-if="rechargeType === 3">
          <label class="title">选择种类：</label>
        </div>
        <div class="m-top-lg">
          <label class="title">{{rechargeType === 2 ? '流量面值' : '充值面值'}}：</label>
          <div class="amount-list">
            <div class="amount-info">300元</div>
          </div>
        </div>
        <div class="m-top-lg" v-if="rechargeType === 2">
          <label class="title">流量类型：</label>
        </div>
        <div class="m-top-lg">
          <label class="title">兑换积分：</label>
          <label class="integral-text"><span><animated-integer :value="999"></animated-integer></span>积分</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getRechargeCfgApi,
    setRechargeApi
  } from 'api/points'
  export default {
    name: 'points-charge-panel',
    data() {
      return {
        navList: [
          {
            id: 1,
            name: '话费充值',
            icon: 'phone-money'
          },
          {
            id: 2,
            name: '流量充值',
            icon: 'phone-flow'
          },
          {
            id: 3,
            name: 'QQ充值',
            icon: 'qq-charge'
          }
        ],
        rechargeType: 1,
        typeList:[],
        amountList:[], //充值面值列表
        rechargeNum:'',
        integral:0,
      }
    },
    mounted(){
      getRechargeCfgApi({rechargeType: this.rechargeType})
    }
  }
</script>

<style lang="scss" scoped>
  .points-charge-panel {
    height: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*flex-direction: column;*/
    border: 1px solid #e6e6e6;
    margin-top: 30px;
    margin-bottom: 100px;
    background: #ffffff;
  }

  .nav-list-charge {
    width: 260px;
    height: 100%;
    background-color: #ecf0f8;
    .nav {
      width: 100%;
      height: 130px;
      box-sizing: border-box;
      border-bottom: 1px solid #d3d7e0;
      text-align: center;
      line-height: 130px;
      background-color: transparent;
      transition: background-color .5s;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active{
        background-color: $def-white-color;
        &:before{
          content: '';
          width: 2px;
          height: 100%;
          background-color: $new-main-deep-color;
          display: block;
          position: absolute;
          left: 0;
        }
      }
    }
  }

  .container-charge {
    width: 940px;
    height: 100%;
    .main{
      margin-top: 92px;
      margin-left: 154px;
    }
    .title{
      font-size: 14px;
      color: #333333;
    }
    .number-input{
      width: 426px;
      height: 30px;
      background-color: #ffffff;
      border: solid 1px #cccccc;
    }
    .integral-text{
      font-size: 14px;
      color: #e84c4c;
      border-radius: 0;
      span{
        font-size: 20px;
        margin-right: 5px;
      }
    }
    .amount-list{
      display: inline-flex;
    }
    .amount-info{
      width: 94px;
      height: 38px;
      background-color: #ffffff;
      border: solid 1px #cccccc;
      text-align: center;
      line-height: 40px;
      font-size: 18px;
      color: #333333;
      cursor: pointer;
    }
  }

</style>
