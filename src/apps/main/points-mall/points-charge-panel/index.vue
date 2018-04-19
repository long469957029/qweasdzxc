<template>
  <div class="points-charge-panel">
    <div class="nav-list-charge">
      <div class="nav" :class="{active: item.id === rechargeType}" v-for="item in navList" :key="item.id"
           @click="changeRechargeType(item.id)">
        <span class="sfa m-right-smd" :class='`sfa-${item.icon}`'></span>
        {{item.name}}
      </div>
    </div>
    <div class="container-charge">
      <div class="main">
        <div class="m-bottom-lg">
          <label class="title">{{rechargeType === 3 ? 'QQ号码' : '手机号码'}}：</label>
          <input type="text" name="number" class="number-input" v-model="rechargeNum"
                 :placeholder="rechargeType === 3 ? '请输入QQ号' : '请输入充值手机号码'">
          <label class="error-info" v-if="showError">*{{errorText}}</label>
        </div>
        <transition name="type-animate">
          <div class="m-bottom-sm clearfix" v-if="rechargeType === 3">
            <label class="title pull-left m-top-sm">选择种类：</label>
            <div class="type-list pull-left">
              <div :class="['type-info',{'active': item.type === type}]" v-for="item in typeList" :key="item.type"
                   @click="changeType(1,item.type)">{{getConfigName(2,item.type)}}
              </div>
              <div :class="['type-info','type-info-more',{'active': type > 8}]" v-if="moreTypeList.length > 0">
                <div class="click-div" @click="showMoreType = !showMoreType"></div>
                <div class="type-name">{{moreText}}</div>
                <ul class="more-type-list" v-show="showMoreType">
                  <li class="more-type-info" v-for="item in moreTypeList" :key="item.type"
                      @click="changeType(2,item.type)">{{getConfigName(2,item.type)}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </transition>
        <transition name="type-animate">
          <div class="m-bottom-sm">
            <label class="title">{{rechargeType === 2 ? '流量面值' : '充值面值'}}：</label>
            <div :class="['amount-list',{'large': amountList.length > 8}]">
              <!--<div class="amount-list">-->
              <div :class="['amount-info',{'active': item.amount === amount,'size-md':rechargeType === 3}]"
                   v-for="(item,index) in amountList" :key="index"
                   @click="chooseAmount(item.integral,item.amount)">{{getConfigName(1,item.amount)}}
              </div>
              <!--<div :class="['amount-info','amount-info-more',{'active': amount > 8,'size-md':rechargeType === 3}]" v-if="moreAmountList.length > 0">-->
              <!--<div class="click-div"  @click="showMoreAmount = !showMoreAmount"></div>-->
              <!--<div class="amount-name">{{moreAmount}}</div>-->
              <!--<ul class="more-amount-list" v-show="showMoreAmount">-->
              <!--<li class="more-amount-info" v-for="(item,index) in moreAmountList" :key="index"-->
              <!--@click="chooseAmount(item.integral,item.amount)">{{getConfigName(1,item.amount)}}</li>-->
              <!--</ul>-->
              <!--</div>-->
            </div>
          </div>
        </transition>
        <transition name="type-animate">
          <div class="m-bottom-md clearfix" v-if="rechargeType === 2">
            <label class="title pull-left m-top-sm">流量类型：</label>
            <div class="type-list pull-left">
              <div :class="['type-info', 'type-info-large',{'active': item.type === type}]" v-for="item in typeList"
                   :key="item.type"
                   @click="changeType(1,item.type)">{{getConfigName(2,item.type)}}
              </div>
            </div>
          </div>
        </transition>
        <div class="m-bottom-md">
          <label class="title">兑换积分：</label>
          <label class="integral-text">
            <span><animated-integer :value="integral | convert2yuan"></animated-integer></span>积分
          </label>
        </div>
        <div class="">
          <div class="get-button" @click="exchange">立即兑换</div>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" width="482px">
        <div slot="head-main" class="text-center">兑换确认</div>
        <div class="modal-main">
          <div class="card-info">
            <div class="card-title">{{rechargeName}}</div>
            <div class="card-cell">
              <span class="card-cell-title">
                {{rechargeType === 3 ? 'QQ号码' : '手机号码'}}：
              </span>
              <span class="card-cell-val">
                <span class="text-prominent">{{rechargeNum}}</span>
              </span>
            </div>
            <div class="card-cell">
              <span class="card-cell-title">
                充值详情：
              </span>
              <span class="card-cell-val">
                {{rechargeDetail}}
              </span>
            </div>
          </div>
          <div class="card-brief">
            本次兑换将花费 <span class="text-prominent">{{integral | convert2yuan}}</span> 积分
          </div>
          <div class="btn-panel">
            <button class="btn confirm-btn" @click="exchangeRecharge" data-dismiss="modal">确定</button>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getRechargeCfgApi,
    setRechargeApi
  } from 'api/points'
  import {
    getCfgName
  } from './config'

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
        rechargeType: 1, //充值大类型（话费、流量、qq）
        typeList: [],    //充值类型列表
        amountList: [], //充值面值列表
        rechargeNum: '', //充值号码
        integral: 0,
        type: 0, //充值小类型（流量类型，qq会员 q币等）
        amount: 0,//充值金额
        userIntegral: 0, //用户可用积分值
        showError: false,
        errorText: '',
        showDialog: false,
        moreTypeList: [],
        moreAmountList: [],
        moreText: '更多种类',
        moreAmount: '更多面值',
        showMoreType: false,
        showMoreAmount: false
      }
    },
    watch: {
      getLoginStatus() {
        if (this.getLoginStatus) {
          this.getCfg()
        }
      }
    },
    computed: {
      ...mapGetters([
        'getLoginStatus'
      ]),
      rechargeName() {
        return _(this.navList).findWhere({id: this.rechargeType}).name
      },
      rechargeDetail() {
        if (this.rechargeType === 1) {
          return this.getConfigName(1, this.amount)
        } else {
          return this.getConfigName(2, this.type) + '-' + this.getConfigName(1, this.amount)
        }
      }
    },
    methods: {
      getCfg() {
        getRechargeCfgApi({rechargeType: this.rechargeType},
          ({data}) => {
            if (data && data.result === 0) {
              this.type = 0
              this.userIntegral = data.root.userIntegral
              const typeList = data.root.typeList
              if (this.rechargeType === 1) {
                this.amountList = typeList[0].amountList
                if (!_.isEmpty(typeList[0].amountList)) {
                  this.integral = this.amountList[0].integral
                } else {
                  Raven.captureMessage('话费／流量／QQ充值 没有获取到面值配置', {
                    level: 'warning'
                  });
                }

              } else {
                if (typeList.length > 10) {
                  this.typeList = typeList.slice(0, 9)
                  this.moreTypeList = typeList.slice(9, typeList.length)
                } else {
                  this.typeList = typeList
                }
                // if(this.typeList[0].amountList.length > 10){
                //   this.amountList = this.typeList[0].amountList.slice(0,9)
                //   this.moreAmountList = this.typeList[0].amountList.slice(9,this.typeList[0].amountList.length)
                // }else{
                if (!_.isEmpty(this.amountList[0])) {
                  this.amountList = this.typeList[0].amountList
                  this.integral = this.amountList[0].integral
                } else {
                  Raven.captureMessage('话费／流量／QQ充值 没有获取到面值配置', {
                    level: 'warning'
                  });
                }
              }
            } else {
              Global.ui.notification.show(data.msg === 'fail' ? '获取配置信息失败' : data.msg)
            }
          },
          ({data}) => {
            Global.ui.notification.show(data.msg === 'fail' ? '获取配置信息失败' : data.msg)
          }
        )
      },
      changeRechargeType(index) {
        this.typeList = []
        this.rechargeType = index
        this.rechargeNum = ''
        this.getCfg()
      },
      getConfigName(type, id) {
        return getCfgName(this.rechargeType, type, id)
      },
      chooseAmount(integral, amount) {
        this.amount = amount
        this.integral = integral
        // this.showMoreAmount = false
      },
      changeType(num, type) { // num用于区分类型列表 1表示正常类型列表 2表示多出来的类型列表
        this.type = type
        const typeList = num === 1 ? this.typeList : this.moreTypeList
        if (num === 2) {
          this.moreText = this.getConfigName(2, type)
        }
        this.showMoreType = false
        this.amountList = _(typeList).findWhere({type}).amountList,
          this.integral = this.amountList[0].integral
        this.amount = this.amountList[0].amount
      },
      exchange() {
        if (!this.getLoginStatus) {
          this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
          return false
        }
        let reg = ''
        if (this.rechargeType === 3) {
          reg = /^[1-9][0-9]{4,15}$/
        } else {
          reg = /^[0-9]{11,11}$/
        }
        if (this.rechargeNum === '') {
          this.showError = true
          this.errorText = `请输入正确${this.rechargeType === 3 ? 'QQ' : '手机'}号`
        } else if (!reg.test(this.rechargeNum)) {
          this.showError = true
          this.errorText = `您输入的${this.rechargeType === 3 ? 'QQ' : '手机'}号有误，请重新输入`
        } else if (this.userIntegral < this.integral) {
          this.showError = false
          Global.ui.notification.show('您的积分不足以本次兑换！')
        } else {
          this.showError = false
          this.showDialog = true
        }
      },
      exchangeRecharge() {
        setRechargeApi({
            num: this.rechargeNum,
            rechargeType: this.rechargeType,
            type: this.type,
            amount: this.amount
          },
          ({data}) => {
            if (data && data.result === 0) {
              this.rechargeNum = ''
              Global.ui.notification.show('<div class="m-bottom-lg">兑换成功!</div>', {
                type: 'success',
                hasFooter: false,
                displayTime: 1000,
                size: 'modal-xs',
                bodyClass: 'no-border no-padding',
                closeBtn: false,
              })
            } else {
              Global.ui.notification.show(data.msg === 'fail' ? '充值失败！请稍后重试！' : data.msg)
            }
          },
          ({data}) => {
            Global.ui.notification.show(data.msg === 'fail' ? '充值失败！请稍后重试！' : data.msg)
          })
      }
    },
    mounted() {
      this.getCfg()
    }
  }
</script>

<style lang="scss" scoped>
  .type-animate-enter {
    transform: translateX(10px);
    opacity: 0;
  }

  /*.type-animate-leave-to{*/
  /*opacity: 0;*/
  /*}*/
  .type-animate-enter-active {
    transition: all .5s;
  }

  @mixin active-after {
    content: '';
    width: 20px;
    height: 16px;
    display: block;
    background: url("./misc/check.png") no-repeat;
    position: absolute;
    bottom: 0;
    right: 0;
  }

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
      &.active {
        background-color: $def-white-color;
        &:before {
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
    .main {
      margin-top: 92px;
      margin-left: 154px;
    }
    .title {
      font-size: 14px;
      color: #333333;
    }
    .number-input {
      width: 426px;
      height: 30px;
      background-color: #ffffff;
      border: solid 1px #cccccc;
    }
    .integral-text {
      font-size: 14px;
      color: #e84c4c;
      border-radius: 0;
      span {
        font-size: 20px;
        margin-right: 5px;
      }
    }
    .amount-list {
      display: inline-flex;
      width: 520px;
      /*height: 107px;*/
      flex-wrap: wrap;
      align-content: space-between;
      &.large {
        width: 650px;
      }
    }
    .amount-info {
      width: 94px;
      height: 38px;
      background-color: #ffffff;
      border: solid 1px #cccccc;
      text-align: center;
      line-height: 40px;
      font-size: 18px;
      color: #333333;
      cursor: pointer;
      margin-bottom: 27px;
      margin-right: 19px;
      transition: border-color .5s;
      &.active {
        border-color: #e84c4c;
        position: relative;
        &:after {
          @include active-after;
        }
      }
      &.amount-info-more {
        position: relative;
        background-color: #f5f5f5;
        text-align: left;
        display: inline-flex;
        font-size: 16px;
        .amount-name {
          margin-left: 7px;
          width: 70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .click-div {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        &:before {
          content: '';
          background: url(./misc/icon-down.png);
          width: 10px;
          height: 6px;
          display: block;
          position: absolute;
          top: 50%;
          margin-top: -3px;
          right: 10px;
        }
        .more-amount-list {
          position: absolute;
          width: 100%;
          border: 1px solid #cccccc;
          border-top-color: transparent;
          left: -1px;
          top: 40px;
          .more-amount-info {
            width: 100%;
            list-style: none;
            text-align: center;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            transition: background-color .5s;
            &:hover {
              background-color: #f5f5f5;
            }
          }
        }
      }
      &.size-md {
        width: 108px;
        .amount-name {
          margin-left: 15px;
        }
      }
    }
    .type-list {
      width: 700px;
      /*display: inline-block;*/
    }
    .type-info {
      width: 108px;
      height: 38px;
      background-color: #ffffff;
      border: solid 1px #cccccc;
      line-height: 38px;
      color: #333333;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 27px;
      &.type-info-large {
        width: 420px;
        padding-left: 20px;
        text-align: left;
        margin-bottom: 14px;
      }
      &.active {
        border-color: #e84c4c;
        position: relative;
        &:after {
          @include active-after;
        }
      }
      &.type-info-more {
        position: relative;
        background-color: #f5f5f5;
        transform: translateX(-3px);
        text-align: left;
        display: inline-flex;
        .type-name {
          margin-left: 15px;
          width: 70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .click-div {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        &:before {
          content: '';
          background: url(./misc/icon-down.png);
          width: 10px;
          height: 6px;
          display: block;
          position: absolute;
          top: 50%;
          margin-top: -3px;
          right: 10px;
        }
        .more-type-list {
          position: absolute;
          width: 100%;
          background-color: #ffffff;
          border: 1px solid #cccccc;
          border-top-color: transparent;
          left: -1px;
          top: 37px;
          .more-type-info {
            width: 100%;
            list-style: none;
            text-align: center;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            transition: background-color .5s;
            /*border: 1px solid #cccccc;*/
            /*margin-top: 5px;*/
            &:nth-child(odd) {
              animation: fadeInLeft .5s;
            }
            &:nth-child(even) {
              animation: fadeInRight .5s;
            }
            &:hover {
              background-color: #f5f5f5;
            }
          }
        }
      }
    }
    .get-button {
      width: 140px;
      height: 40px;
      background-color: #e84c4c;
      border-radius: 5px;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      margin-left: 76px;
    }
    .error-info {
      color: #e84c4c;
      font-size: 12px;
    }
  }

  .modal-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
  }

  .card-info {
    box-sizing: border-box;
    padding: 20px 23px;
    margin-bottom: 20px;
    min-width: 275px;
    height: 110px;
    background-color: #f8f8f8;
    border-radius: 5px;
  }

  .card-title {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333333;
  }

  .card-cell-title {
    line-height: 25px;
  }

  .card-brief {
    color: #666666;
    font-size: 14px;
    margin-bottom: 20px;
  }

  button.btn.confirm-btn {
    width: 108px;
    height: 36px;
    background-color: #14b1bb;
    border-radius: 3px;
    border: solid 1px #13a6af;
  }

  .card-cell {
    font-size: 14px;
  }
</style>
