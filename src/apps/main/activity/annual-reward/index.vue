<template>
  <div class="annual-main">
    <div class="main-head">
      <div class="head-content clearfix">
        <div class="logo"></div>
        <div class="time">活动时间:{{startTime}} ---- {{endTime}}</div>
        <div class="money money1"></div>
        <div class="money money2"></div>
        <div class="money money3"></div>
      </div>
    </div>
    <div class="container">
      <div class="nav-tab">
        <div class="tab" :class="{active:item === item.status === 1}" v-for="(item,index) in quarterCfgList"
             :key="index" @click="item.status != 2 && index != 0 ? getUserDetail(index) : ''">
          <div class="mask" v-if="item.status === 0"></div>
          <div class="tip" :class="{on:item.status === 1,over:item.status === 0,'not-open': item.status === 2}"></div>
          <div class="title">{{quarterName[index]}}</div>
          <div class="time">时间：{{item.beginDate}}～{{item.toDate}}</div>
          <div class="money">亏损：{{formatProfitBonus(item.userDetail,'profit')}}</div>
          <div class="money">奖励：{{formatProfitBonus(item.userDetail,'bonus')}}</div>
        </div>
      </div>
      <div class="content-info clearfix">
        <div class="data-formula">
          <div class="data-info">亏损-分红:
            <span class="num"><animated-integer :value="profitSubDivid"></animated-integer></span></div>
          <div class="icon-x"></div>
          <div class="data-info">奖励比例:
            <span class="num"><animated-integer :value="_(userDetail ? userDetail.bonusRate : 0).div(100)"></animated-integer></span></div>
          <div class="icon-equal"></div>
          <div class="data-info">奖励金额:
            <span class="num"><animated-integer :value="userDetail ? userDetail.bonus : 0 | convert2yuan"></animated-integer></span></div>
        </div>
        <div class="button-program">
          <div class="get-button" :class="formateQuarterGetStatus" @click="quarterGetStatus === 1 ? getBonus(1) : ''"></div>
          <div class="quarter-program" @click="showDialog(1)">
            <span class="icon-program"></span>
            季度奖励方案>
          </div>
        </div>
        <div class="contribution">
          <div>贡献率=（盈亏-分红）/(投注-中奖-返点)=
            <span class="num"><animated-integer :value="_(userDetail ? userDetail.profitRate : 0).div(100)"></animated-integer></span>
          </div>
          <div class="font-xs m-top-sm">注：团队盈亏为正时，团队亏损为0； 团队盈亏为负时，团队亏损为团队盈亏的绝对值</div>
        </div>
        <div class="datail-table">
          <div class="line"></div>
          <div class="tr">
            <div class="td">团队投注：<animated-integer :value="userDetail ? userDetail.bet : 0 | convert2yuan"></animated-integer></div>
            <div class="td">团队中奖：<animated-integer :value="userDetail ? userDetail.prize : 0 | convert2yuan"></animated-integer></div>
            <div class="td">团队返点：<animated-integer :value="userDetail ? userDetail.rebate : 0 | convert2yuan"></animated-integer></div>
          </div>
          <div class="line"></div>
          <div class="tr">
            <div class="td">活动成本：<animated-integer :value="userDetail ? userDetail.activity : 0 | convert2yuan"></animated-integer></div>
            <div class="td">团队盈亏：<animated-integer :value="userDetail ? userDetail.profit : 0 | convert2yuan"></animated-integer></div>
            <div class="td">团队分红：<animated-integer :value="userDetail ? userDetail.divid : 0 | convert2yuan"></animated-integer></div>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="year-count">
        <div class="year-info">
          <div class="left">
            <div class="year-statistics">年度奖励统计：<animated-integer :value="yearBonus | convert2yuan"></animated-integer></div>
            <div class="year-program" @click="showDialog(2)">
              <span class="icon-program"></span>
              年度奖励方案>
            </div>
          </div>
          <div class="get-button right" :class="formateYearGetStatus" @click="yearGetStatus === 1 ? getBonus(2) : ''"></div>
        </div>
        <div class="clearfix">
          <div class="schedule">
            <div class="title">年度亏损</div>
            <div class="prograss">
              <div class="prograss-info" :style="{width: yearProfit >= 0 ? '' : formateYearProfitPro}">
                {{yearProfit >= 0 ? 0 : Math.abs(yearProfit) | convert2yuan}}
              </div>
            </div>
          </div>
          <div class="schedule">
            <div class="title">贡献率</div>
            <div class="prograss">
              <div class="prograss-info" :style="{width: `${_(yearProfitRate).div(100) > 3 ? _(yearProfitRate).div(100) : 3}%`}">
                {{_(yearProfitRate).div(100)}}%</div>
            </div>
          </div>
          <div class="schedule">
            <div class="title">奖励比例</div>
            <div class="prograss">
              <div class="prograss-info" :style="{width: `${_(yearBonusRate).div(100) > 3 ? _(yearBonusRate).div(100) : 3}%`}">
                {{_(yearBonusRate).div(100)}}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="last-year" v-if="showLastYear" @click="changLastYear">
      <div class="text">{{isLastYear === 0 ? '上年度活动' : '本年度活动'}}</div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="dialogStatus" styles="" ref="modal">
        <div class="modal-annual-size clearfix" slot="all">
          <a data-dismiss="modal" class="modal-close btn-close"></a>
          <div class="dialog-title">{{dialogTitle}}度奖励方案</div>
          <div class="dialog-table">
            <div class="tr title-line">
              <div class="td">亏损金额</div>
              <div class="td">净亏损率</div>
              <div class="td">奖励比例</div>
            </div>
            <div class="tr" v-for="(item,index) in tableList" :key="index">
              <div class="td">{{item.profit | convert2yuan}}</div>
              <div class="td">{{_(item.profitRate).div(100)}}%</div>
              <div class="td">{{_(item.bonusRate).div(100)}}%</div>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {
    getAnnualRewardfgApi,
    getQuarterRewardApi,
    getYearRewardApi
  } from 'api/activity'
  export default {
    name:'annual-reward',
    data(){
      return{
        startTime:'',
        endTime:'',
        quarterGetStatus:0,//0未达标1未领取2已领取
        yearGetStatus:0,//0未达标1未领取2已领取
        yearBonus:0,//年度统计
        yearProfit:0,//团队亏损
        yearBonusRate:0,//奖励比例
        yearProfitRate:0,//年度贡献率
        dialogStatus:false,
        dialogTitle:'季',
        //quarterTabList:[],//tab切换列表
        quarterCfgList:[],//季度奖励配置
        yearCfgList:[],// 年度奖励配置
        isLastYear:0,
        showLastYear:false,
        tableList:[],//弹窗列表
        quarterIndex:0,//当前是第几季度
        userDetail:{},//当前季度用户详情
        quarterName:[
          '第一季度',
          '第二季度',
          '第三季度',
          '第四季度'
        ]
      }
    },
    computed:{
      formateQuarterGetStatus(){
        return this.quarterGetStatus === 0 ? 'disable' : (this.quarterGetStatus === 1 ? 'get' : 'has-get')
      },
      formateYearGetStatus(){
        return this.yearGetStatus === 0 ? 'disable' : (this.yearGetStatus === 1 ? 'get' : 'has-get')
      },
      profitSubDivid(){
        if(_(this.userDetail).isNull() || this.userDetail.profit > 0){
          return 0
        }else{
          return Math.abs(_(this.userDetail.profit + this.userDetail.divid).convert2yuan())
        }
      },
      formateYearProfitPro(){
        const width = _(Math.abs(this.yearProfit)).convert2yuan()/10000000*100
        return width > 15 ? width : ''
      }
    },
    methods:{
      getConfig(){
        getAnnualRewardfgApi({isLastYear: this.isLastYear},
          ({data}) => {
            if(data.result === 0){
              const root = data.root
              this.startTime = _(root.fromDate).toTime('YYYY.MM.DD')
              this.endTime = _(root.endDate).toTime('YYYY.MM.DD')
              this.quarterCfgList = [...root.quarterCfgList]
              const quarterIndex = _(this.quarterCfgList).findIndex({status:1})
              if(quarterIndex > -1 && this.quarterCfgList[quarterIndex].userDetail){
                //this.userDetail = _(this.quarterCfgList).findWhere({status:1}).userDetail
                this.getUserDetail(quarterIndex)
              }else{
                this.userDetail = null
              }
              this.yearCfgList = [...root.yearCfgList]
              this.showLastYear = this.yearCfgList[0].lastYearOpen
              const yearUserDetail = this.yearCfgList[0].userDetail
              if(yearUserDetail){
                this.yearBonus = yearUserDetail.bonus
                this.yearProfit = yearUserDetail.profit
                this.yearBonusRate = yearUserDetail.bonusRate
                this.yearProfitRate = yearUserDetail.profitRate
                this.yearGetStatus = yearUserDetail.getStatus
              }else{
                this.userDetail = null
              }
            }
          },
          ({data}) => {
            Global.ui.notification.show(data.msg === 'fail' ? '获取活动配置失败' : data.msg)
          }
        )
      },
      getUserDetail(index){
        this.userDetail = this.quarterCfgList[index].userDetail
        if(this.userDetail){
          this.quarterGetStatus = this.userDetail.getStatus
        }
        this.quarterIndex = index
      },
      formatProfitBonus(data,name){
        if(!_(data).isNull()){
          if(name === 'profit'){
            return data.profit > 0 ? 0 : Math.abs(_(data.profit).convert2yuan())
          }else{
            return _(data.bonus).convert2yuan()
          }
        }else{
          return '-- --'
        }
      },
      showDialog(type){ // 1代表季度 2代表年度
        if(type === 1){
          this.tableList = this.quarterCfgList[this.quarterIndex].itemList
          this.dialogTitle = '季'
        }else{
          this.tableList = this.yearCfgList[0].itemList
          this.dialogTitle = '年'
        }
         this.dialogStatus = true
      },
      getBonus(type){
        const api = type === 1 ? getQuarterRewardApi : getYearRewardApi
        api({isLastYear:this.isLastYear},
          ({data}) => {
            if(data.result === 0){
              Global.ui.notification.show('领取奖励成功')
              this.getConfig()
            }else{
              Global.ui.notification.show(data.msg === 'fail' ? '领取奖励失败' : data.msg)
            }
          },
          ({data}) => {
            Global.ui.notification.show(data.msg === 'fail' ? '领取奖励失败' : data.msg)
          }
        )
      },
      changLastYear(){
        this.isLastYear = this.isLastYear === 0 ? 1 : 0
        this.getConfig()
      }
    },
    mounted(){
      this.getConfig()
    }
  }
</script>
<style lang="scss" scoped>

  .annual-main{
    width: 100%;
    height: 100%;
    min-width: 1100px;
    background: url("./assets/main-bg.png");
    position: relative;
    z-index: 1;
    &:before{
      content: '';
      width: 100%;
      height: 463px;
      background: url("./assets/bg-bottom.png") no-repeat center;
      position: absolute;
      bottom: 0;
      display: block;
      left: 0;
      z-index: -1;
    }
  }
  .main-head{
    width: 100%;
    height: 524px;
    background: url("./assets/header-bg.png") no-repeat center;
    animation: zoomIn 1s;
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
      opacity: 0;
      animation: lightSpeedIn 1s .8s forwards;
    }
    .time{
      font-size: 15px;
      color: #fefefe;
      margin-left: 220px;
      opacity: 0;
      animation: slideInDown-time 1s 1.8s forwards;
    }
    .money{
      position: absolute;
      &.money1{
        width: 122px;
        height: 107px;
        background: url("./assets/money1.png") no-repeat;
        top: 285px;
        animation: moneyFly 5s infinite;
      }
      &.money2{
        width: 170px;
        height: 174px;
        background: url("./assets/money2.png") no-repeat;
        top: 236px;
        left: 568px;
        animation: moneyFly 5s .5s infinite;
      }
      &.money3{
        width: 100px;
        height: 143px;
        background: url("./assets/money3.png") no-repeat;
        right: 0;
        top: 150px;
        animation: moneyFly 5s 1s infinite;
      }
    }
  }
  .container{
    width: 1100px;
    margin: 0 auto;
    z-index: 2;
    opacity: 0;
    animation: slideInUp-opacity 1s 1.8s forwards;
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
      cursor: pointer;
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
      height: 495px;
      //background-color: #3b3b6d;
      background: rgba(59,59,109,.45);
      box-shadow: 0px 4px 16px 0px
      rgba(21, 21, 46, 0.72);
      border-radius: 20px;
      margin-bottom: 40px;
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

        .quarter-program{
          color: #cfb58e;
          font-size: 16px;
          display: flex;
          align-items: center;
          margin-left: 48px;
          cursor: pointer;
          text-decoration: underline;
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
            padding-left: 10%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .icon-program{
      display: inline-block;
      background: url("./assets/icon-program.png") no-repeat;
      width: 30px;
      height: 34px;
      margin-right: 9px;
    }
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
    .year-count{
      width: 1100px;
      margin: 0 auto;
      padding-bottom: 100px;
      .year-info{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .left{
        display: flex;
        align-items: center;
        margin-left: 10px;
      }
      .right{
        margin-right: 10px;
      }
      .year-statistics{
        font-size: 26px;
        color: #cdb38d;
      }
      .year-program{
        display: flex;
        align-items: center;
        margin-left: 84px;
        font-size: 16px;
        color: #cfb58e;
        cursor: pointer;
        text-decoration: underline;
      }
      .schedule{
        width: 1080px;
        height: 24px;
        margin: 40px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title{
          width: 110px;
          font-size: 24px;
          color: #cdb38d;
          padding-left: 35px;
          position: relative;
          &:before{
            content: '';
            display: block;
            background: url("./assets/icon-diamond.png") no-repeat;
            width: 18px;
            height: 18px;
            position: absolute;
            left: 0;
            top: 3px;
          }
        }
        .prograss{
          width: 884px;
          height: 22px;
          background-color: #343464;
          box-shadow: 0px 1px 1px 0px
          #61618f,
          inset 0px 1px 1px 0px
          rgba(0, 0, 0, 0.71);
          border-radius: 11px;
          position: relative;
          overflow: hidden;
          .prograss-info{
            /*min-width: 50px;*/
            position: absolute;
            height: 100%;
            background-color: #cdb38d;
            border-radius: 11px;
            text-align: right;
            padding:0px 10px;
            color: #70180a;
            font-size: 16px;
            line-height: 22px;
          }
        }
      }
    }
  }
  .modal-annual-size{
    width: 730px;
    max-height: 450px;
    padding-bottom: 20px;
    background: url("./assets/dialog-bg.png");
    position: relative;
    .modal-close{
      position: absolute;
      width: 25px;
      height: 25px;
      background: url("./assets/dialog-close.png") no-repeat;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
    .dialog-title{
      width: 308px;
      height: 65px;
      background: url("./assets/dialog-title.png") no-repeat;
      position: absolute;
      top: -27.5px;
      left: 50%;
      margin-left: -154px;
      color: #70180a;
      font-family: ltthj;
      font-size: 30px;
      text-align: center;
      line-height: 65px;
    }
    .dialog-table{
      width: 664px;
      /*height: 412px;*/
      border: solid 1px #c1c1ff;
      margin: 57px auto 30px;
      .tr{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom:1px solid #ffffff;
        .td{
          width: 33.3%;
          font-size: 14px;
          color: #c1c1ff;
          border-right:1px solid #ffffff;
          text-align: center;
          &:last-child{
            border: none;
          }
        }
        &.title-line{
          height: 50px;
          line-height: 50px;
          background-color: #242451;
          .td{
            color: #cfb58e;
          }
        }
        &:last-child{
          border: none;
        }
      }
    }
  }
  .last-year{
    position: fixed;
    width: 75px;
    height: 180px;
    background: url("./assets/last-year.png") no-repeat;
    top: 50%;
    margin-top: -90px;
    right: 50px;
    cursor: pointer;
    .text{
      color: #1c1c38;
      writing-mode: vertical-lr;
      font-size: 22px;
      font-family: ltthj;
      transform: translate(42px,25px);
    }
  }
  @keyframes moneyFly {
    0%,100%{
      transform: translate(0px,0px);
    }
    50%{
      transform: translate(0px,-10px);
    }
  }
  @keyframes slideInDown-time {
    from {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: visible;
      opacity: 0;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes slideInUp-opacity {
    from {
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
      visibility: visible;
      opacity: 0;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
</style>
