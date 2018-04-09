<template>
  <div class="user-main" @mousemove="updateXY">
    <div class="header">
      <div class="main clearfix">
        <div class="text"></div>
        <div class="time">活动时间：{{_(fromDate).toTime('YYYY年MM月DD日')}} --- {{_(endDate).toTime('MM月DD日')}}</div>
        <div class="money"></div>
      </div>
    </div>
    <div class="container">
      <div class="title" v-if="!showDetail">你的注册时间为{{registeTime}}天，可领取【{{giftPackageName(packageType)}}礼包】</div>
      <div class="title detail" v-if="showDetail">亲爱的会员，您好！以下是您打开【{{giftPackageName(packageType)}}礼包】的奖励</div>
      <div class="content">
        <div class="gift-list" v-if="!showDetail">
          <transition-group name="gift-list">
            <div class="gift-content" v-for="(item, index) in giftPackageList" :key="item.resultType">
              <div class="gift-info clearfix">
                <div class="mask" v-if="packageType !== item.resultType"></div>
                <div class="info-title">{{giftPackageName(item.resultType)}}礼包</div>
                <div class="info-time"><span v-if="index < 3">{{item.maxLimit}}天≥</span>注册时间>{{index === 0 ? 3 : item.minLimit}}天</div>
                <div class="info-icon" :class="`gift-icon-${item.resultType}`"></div>
                <div class="info-detail">
                  <div class="reward" v-if="item.list[0].amount > 0">
                    元老彩金{{item.list[0].amount | convert2yuan}}元
                  </div>
                  <div class="reward" v-if="item.list[1].amount > 0">
                    活跃彩金{{item.list[1].amount | convert2yuan}}元
                  </div>
                  <div class="reward" v-if="item.list[2].amount > 0">
                    三天充值返利卡
                    <div class="reward-info">
                      充值{{item.list[2].limit | convert2yuan}}返{{item.list[2].amount | convert2yuan}}元</div>
                  </div>
                  <div class="reward" v-if="item.list[3].amount > 0">
                    五天投注返水卡
                    <div class="reward-info">投注额*{{item.list[3].amount | convert2yuan}}%</div>
                  </div>
                  <div class="reward" v-if="item.list[4].amount > 0">
                    七天中奖加奖卡
                    <div class="reward-info">中奖额*{{item.list[4].amount | convert2yuan}}%</div>
                  </div>
                </div>
              </div>
              <div :class="['num',{active:packageType === item.resultType}]">
                已派发礼包：<span class="num-big">{{getTotal(item.resultType)}}个</span>
              </div>
              <div class="gift-button" :class="{disabled:packageType !== item.resultType}"
                   @click="Number(packageType) === Number(item.resultType) ? getGift() : ''">马上领取</div>
            </div>
          </transition-group>
        </div>
        <div class="gift-detail" v-if="showDetail">
          <div class="date-list">
            <div :class="['date-item',{'disabled': item.dayStatus === 0,'active': today === item.day}]"
                 v-for="item in dayList" :key="item.day"
                 @click="filterPrize(item.day)">
              <div class="date-icon">
                <div class="light"></div>
              </div>
              <div class="date-num">{{formatTime(item.day,'M.DD')}}</div>
            </div>
          </div>
          <div class="detail-list">
            <transition-group name="amount-list" tag="div">
              <div class="detail-info" v-for="(item,index) in prizeList" :key="item.resultType" v-if="item.show === 1">
                <div class="info-title">{{formatDetailName(item.resultType).name}}</div>
                <div class="info-content" v-if="(parseInt(item.resultType / 10) === 1 || parseInt(item.resultType / 10) === 2)">
                  {{item.amount | convert2yuan}}元现金</div>
                <div class="info-content" v-if="parseInt(item.resultType / 10) === 3">充
                  {{item.limit | convert2yuan}}返{{item.amount | convert2yuan}}元</div>
                <div class="info-content" v-if="(parseInt(item.resultType / 10) === 4 || parseInt(item.resultType / 10) === 5)">
                  {{parseInt(item.resultType / 10) === 4 ? '投注' : '中奖'}}额*{{item.amount | convert2yuan}}%</div>
                <div class="tip-icon" v-if="item.status === 1 && item.day === today"></div>
                <div class="detail-btn" :class="item.status === 0 ? 'disabled' : 'has-get'"
                     v-if="(parseInt(item.resultType / 10) === 1 || parseInt(item.resultType / 10) === 2)">
                  {{item.status === 0 ? '未达标' : (item.status === 1 ? '已领取' : '已过期')}}</div>
                <div class="detail-btn" :class="formatBtnClass(item.status).className"
                     @click="item.status === 0 ? getPrize(item.resultType) : ''" v-else>
                  {{formatBtnClass(item.status).btnText}}</div>
              </div>
            </transition-group>
          </div>
          <div class="text-tip">
            注* 领取奖金以及返现的奖励，可以在我的
            <router-link class="link" :to="{path: '/fc/ad'}">个人中心-账变明细</router-link> 中查看详情</div>
        </div>
      </div>
      <div class="rule">
        <div class="rule-title">活动规则：</div>
        <p>活动期间，根据您的账号在平台上注册的时长领取相应的礼包，账号越老，可领取的礼包级别越高。</p>
        <p>每个礼包都包括了三天的充值返利卡、五天的投注返水卡、七天的中奖加奖卡，黄金以上的礼包还有额外的元老彩金、活跃奖金奖励，
          礼包等级越高，以上奖励越丰厚。</p>
        <p>用户在领取礼包后，元老奖金和活跃奖金会由系统自动发放（元老奖金发放条件：需账号有历史投注记录；活跃奖金发放条件：需账号的活跃天数≥4天）；
          充值卡、返水卡和加奖卡的奖励需由用户每天完成后，来到活动中进行手动领取。</p>
        <p>同一IP仅限一个账号领取，新用户暂无法参与该活动，需注册满 3 天以上、可在第 4 天可参与该活动。</p>
        <p>该活动最终解释权归无限娱乐所有，如有任何违规行为，一经发现直接冻结账号。</p>
      </div>
      <div class="bottom-decoration"></div>
    </div>
    <div class="bottom-flower"></div>
    <div class="flower" ref="flower" :style=changeXY></div>
    <div class="footer"></div>

    <div v-transfer-dom>
      <x-dialog v-model="getGiftStatus" :options="modalOptions" styles="" ref="modal">
        <div class="modal-big-size clearfix" slot="all">
          <a data-dismiss="modal" class="modal-close btn-close"></a>
          <div class="dialog-tip" v-if="getCardMsg && !getCardError">
            <div class="text">仅限{{formatTime(today,'M月DD日')}}使用</div>
          </div>
          <div class="dialog-container">
            <div class="dialog-title">{{dialogTitle}}</div>
            <div class="content">
              <div class="get-gift-msg" v-if="getGiftMsg">
                <div v-if="!getCardError">
                  <div class="text-center">恭喜您，成功领取<span class="special">“{{giftPackageName(packageType)}}礼包”</span></div>
                  <div class="text-center">快使用礼包中的奖励吧！</div>
                  <div class="get-gift-btn" @click="initData" data-dismiss="modal">查看礼包</div>
                </div>
                <div v-if="getCardError">
                  <div class="text-center">{{errorText}}</div>
                  <div class="text-center card-info">{{formatDetailName(resultType).info}}</div>
                  <div class="btn-list">
                    <div class="card-btn btn-yellow js-header-recharge" data-name="jsFcRecharge"
                         data-dismiss="modal" v-if="parseInt(resultType / 10) === 3">去充值</div>
                    <router-link class="card-btn btn-yellow" :to="{path: '/bc/0/10'}"
                                 data-dismiss="modal" v-else>去投注</router-link>
                    <div class="card-btn btn-pink" data-dismiss="modal">确认</div>
                  </div>
                </div>
              </div>
              <div class="get-card-msg" v-if="getCardMsg">
                <div class="get-card-info clearfix">
                  <div class="card-name">{{formatDetailName(resultType).name}}</div>
                  <div class="card-info">{{formatDetailName(resultType).info}}</div>
                </div>
                <div class="btn-list">
                  <router-link :to="{path: parseInt(resultType / 10) === 3 ? '/fc/ad' : '/'}" class="card-btn btn-yellow" data-dismiss="modal"
                               tag="div">查看</router-link>
                  <div class="card-btn btn-pink" data-dismiss="modal">继续领取</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>

  import {
    getGiftPackageListApi,
    getGiftPackageApi,
    getDouseApi,
    getVirtualNumApi
  } from 'api/activity'
  import {
    checkLogin
  } from 'build'

  export default {
    name: 'users-return',

    mixins: [checkLogin],

    data(){
      return{
        modalOptions: {
          backdrop: 'static'
        },
        mouseX:0,
        mouseY:0,
        showDetail:false,
        systemDate: null,//系统时间
        fromDate: null,//活动开始时间
        endDate: null,//活动结束时间
        itemList:[],//注册时间列表
        amountList:[], //礼包奖品列表
        userAmountList:[], //用户已经领取的礼包详情
        packageType:0,//用户可领取的礼包类型 1白金，2黄金，3钻石，4至尊
        bagStatus:0,//用户是否领取礼包 0 未领取，1已领取
        userRegTime:0,//用户注册时间
        filterUserAmountList:[],
        getGiftStatus: false, //dialog弹窗显示隐藏
        getGiftMsg:false,// 获取礼包提示
        getCardMsg:false,//获取卡提示
        getCardError:false,//获取卡错误提示
        dialogTitle:'领取成功',
        resultType:21,//领取卡的类型id
        giftNum:[],//已发放礼包数量
        dayList:[],//日期列表
        prizeList:[],//日期对应的礼品列表
        today:'',
        errorText:'',//领取失败错误提示
        activeDay:0,
      }
    },
    watch:{
      getGiftStatus(){
        if(this.getGiftStatus === false){
          this.getGiftMsg = false
          this.getCardMsg = false
          this.getCardError = false
        }
      }
    },
    computed:{
      changeXY() {
        return `transform: translate(-${this.mouseX/10}px, -${this.mouseY/10}px);`
      },
      registeTime(){
        return moment(_(this.systemDate).sub(this.userRegTime)).dayOfYear() - 1
      },
      giftPackageList(){
        this.amountList.forEach((item) => {
          const type = item.resultType % 10 - 1
          if (type >= 0) {
            if (!this.itemList[type].list) {
              this.itemList[type].list = []
            }
            this.itemList[type].list.push(item)
          } else {
            //报错
          }
        })
        return this.itemList
      },
      // formatTime(){
      //   const time = []
      //   const sub = moment(moment(this.endDate).diff(this.fromDate)).dayOfYear()
      //   for(let i=0;i<sub -1 ;i++){
      //     const timeAdd = moment(this.fromDate).add(i,'days')
      //     time.push({
      //       time: timeAdd,
      //       expired: moment(moment(this.systemDate).diff(timeAdd)).dayOfYear() - 1 >= 1 &&
      //         moment(moment(this.systemDate).diff(timeAdd)).dayOfYear() - 1 <= 31
      //     })
      //   }
      //   return time
      // },
      getPrizeInfo(){
        return _(_(this.dayList).where({day: this.today}).dayItem).filter((item) => {
          return item.resultType === this.resultType
        })
      }
    },
    methods:{
      updateXY(event){
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      },
      giftPackageName(id){
        let name = ''
        switch (id){
          case 1:
            name = '白银'
            break
          case 2:
            name = '黄金'
            break
          case 3:
            name = '钻石'
            break
          case 4:
            name = '至尊'
            break
          default:
            break
        }
        return name
      },
      formatDetailName(index){
        let name = ''
        let info = ''
        const Obj = _(_(this.dayList).where({day: this.today})[0].dayItem).filter((item) => {
          return item.resultType === index
        })[0]
        const num = parseInt(index / 10)
        switch (num){
          case 1:
            name = '元老彩金'
            info = `${_(Obj.amount).convert2yuan()}元现金`
            break
          case 2:
            name = '活跃彩金'
            info = `${_(Obj.amount).convert2yuan()}元现金`
            break
          case 3:
            name = '充值返利卡'
            info = `充${_(Obj.limit).convert2yuan()}返${_(Obj.amount).convert2yuan()}元`
            break
          case 4:
            name = '投注返水卡'
            info = `投注额*${_(Obj.amount).convert2yuan()}%`
            break
          case 5:
            name = '中奖加奖卡'
            info = `中奖额*${_(Obj.amount).convert2yuan()}%`
            break
          default:
            break
        }
        return {
          name,
          info
        }
      },
      getGift(){
        getGiftPackageApi(
          ({data}) => {
            if(data && data.result === 0){
              this.getGiftStatus = true
              this.getGiftMsg = true
              //this.initData()
            }else{
              Global.ui.notification.show(`<div class="m-bottom-lg">${data.msg}</div>`)
            }
          },
          ({data}) => {
            Global.ui.notification.show(`<div class="m-bottom-lg">${data.msg}</div>`)
          }
        )
      },
      formatTime(day,format){
        return _(moment(day).valueOf()).toTime(format)
      },
      // filterTime(index){
      //   this.filterUserAmountList = []
      //   setTimeout(() => {
      //     this.filterUserAmountList = [...this.userAmountList].reverse()
      //     this.filterUserAmountList = _(this.filterUserAmountList).filter((item) => {
      //       return item.validity >= index
      //     })
      //   },300)
      // },
      filterPrize(day){
        this.prizeList = []
        this.today = day
        setTimeout(() => {
          this.prizeList = _(this.dayList).where({day})[0].dayItem
        },300)
      },
      formatBtnClass(status){ // 0：未领取，1：已领取，2：已过期，3：未开启
        let className = ''
        let btnText = '领取'
        switch (status){
          case 1:
            className = 'has-get'
            btnText = '已领取'
            break
          case 2:
            className = 'over-time'
            btnText = '已过期'
            break
          case 3:
            className = 'disabled'
            btnText = '未开始'
            break
        }
        return {
          className,
          btnText
        }
      },
      getPrize(resultType){
        const type = parseInt(resultType / 10)
        getDouseApi({resultType:type},
          ({data}) => {
            this.resultType = resultType
            if(data && data.result === 0){
              this.getGiftStatus = true
              this.getCardMsg = true
              this.initData()
            }else{
              this.getGiftStatus = true
              this.getCardError = true
              this.getGiftMsg = true
              this.dialogTitle = '很抱歉！'
              this.errorText = data.msg
              //Global.ui.notification.show(`<div class="m-bottom-lg">${data.msg}</div>`)
            }
          },
          ({data}) => {
            Global.ui.notification.show(`<div class="m-bottom-lg">${data.msg}</div>`)
          }
        )
      },
      getTotal(resultType){
        return this.giftNum && !_(this.giftNum).isEmpty() ? _(this.giftNum).where({resultType:resultType})[0].total : 0
      },
      initData(){
        getGiftPackageListApi(
          ({data}) => {
            if(data && data.result === 0){
              const root = data.root
              if(root.status === 0){
                Global.ui.notification.show(`<div class="m-bottom-lg">该活动还未开启！</div>`)
              }else if(root.status === 2){
                Global.ui.notification.show(`<div class="m-bottom-lg">该活动已经结束！</div>`)
              }else if(!root.available){
                Global.ui.notification.show(`<div class="m-bottom-lg">当前IP已经领取过礼包！</div>`)
              }else{
                this.systemDate = root.systemDate || moment().unix() * 1000 //root.systemDate
                this.bagStatus = root.bagStatus
                this.fromDate = root.fromDate
                this.endDate = root.endDate
                // this.dayList = _(root.dayList).filter((item) => {
                //   return item.dayItem = item.dayItem.reverse()
                // })
                this.dayList = root.dayList
                this.prizeList = _(this.dayList).where({isToday: 1})[0].dayItem
                this.today = _(this.dayList).where({isToday: 1})[0].day
                this.packageType = root.packageType
                this.userRegTime = root.userRegTime
                this.itemList = [...root.itemList]
                this.amountList = [...root.amountList]
                this.activeDay = _(this.dayList[0].dayItem[1].limit).convert2yuan()
                if(this.bagStatus === 1){
                  this.showDetail = true
                }else{
                  this.getVirtualNum()
                }
              }
            }else{
              Global.ui.notification.show(`<div class="m-bottom-lg">${data.msg}</div>`)
            }
          },
          ({data}) => {
            Global.ui.notification.show(`<div class="m-bottom-lg">${data.msg}</div>`)
          })
      },
      getVirtualNum(){
        if(!this.showDetail){
          getVirtualNumApi(
            ({data}) => {
              if(data && data.result === 0){
                this.giftNum = data.root
              }
            }
          ).finally(() => {
            setTimeout(() => {
              this.getVirtualNum()
            },30000)
          })
        }
      }
    },

    mounted(){
      this.initData()
      this.$nextTick(() => {
        Velocity(this.$refs.flower, {
          blur: 0,
          'margin-left': '-909px',
          'margin-top': 0
        })
      })
    },

    beforeRouteEnter(to, from, next) {
      if (!window.store.getters.isLogin) {
        checkLogin.methods.login()
        next({
          path: '/',
          query: {redirect: to.fullPath}
        })
      } else {
        next()
      }
    },
    beforeDestroy(){
      clearInterval(this.timeInv)
    }
  }

</script>
<style lang="scss" scoped>
  .amount-list-enter{
    transform: translateX(910px);

  }
  .amount-list-leave-to{
    transform: translateX(-910px);

  }
  .amount-list-enter-active,.amount-list-leave-active{
    transition: all .5s;
  }
  .user-main{
    width: 100%;
    height: 2000px;
    min-width: 1100px;
    background: linear-gradient(to bottom,#ffe5f4,#cff8fd);
    overflow-x: hidden;
    position: relative;
  }
  .header{
    width: 100%;
    height: 1054px;
    background: url("./assets/header-bg.png") no-repeat center;
    background-position-y: -110px;
    animation: brightness 1s ease-in-out both 1;
    .main{
      width: 1100px;
      height: 100%;
      margin: 0 auto;
      position: relative;
      .text{
        width: 0px;
        height: 341px;
        background: url("./assets/header-text.png") no-repeat;
        margin-left: 50px;
        margin-top: -35px;
        animation: showHeader 1.5s .5s forwards;
      }
      .time{
        font-size: $font-md;
        color: #430b14;
        margin-top: 20px;
        margin-left: 270px;
      }
      .money{
        width: 459px;
        height: 390px;
        background: url("./assets/money.png") no-repeat;
        position: absolute;
        right: -78px;
        top: 172px;
        animation: tada 1s 1s;
      }
    }
  }
  .container{
    width: 1081px;
    height: 1337px;
    background: url("./assets/main-bg.png") no-repeat;
    position: absolute;
    top: 399px;
    z-index: 2;
    margin: 0 auto;
    left: 50%;
    margin-left: -540px;
    &:before{
      content: '';
      display: block;
      width: 84px;
      height: 389px;
      background: url("./assets/main-left-top.png") no-repeat;
      position: absolute;
      top: 40%;
      left: -48px;
    }
    &:after{
      content: '';
      display: block;
      width: 118px;
      height: 520px;
      background: url("./assets/main-left-top.png") no-repeat;
      position: absolute;
      top: 15%;
      right: -50px;
      transform:scaleX(-1);
    }
    .bottom-decoration{
      width: 222px;
      height: 259px;
      background: url("./assets/main-left-bottom.png") no-repeat;
      position: absolute;
      bottom: -67px;
      left: -4px;
    }
    .title{
      width: 100%;
      height: 24px;
      text-align: center;
      font-size: 20px;
      color: #ffeca4;
      margin-top: 75px;
      margin-bottom: 43px;
      background: url("./assets/title-bg.png") no-repeat center;
      &.detail{
        background: url("./assets/title-detail-bg.png") no-repeat center;
      }
    }
    .content{
      width: 942px;
      height: 664px;
      background-color: #5a162d;
      border-radius: 5px;
      margin: 0 auto;
      .gift-content{
        width: 194px;
        height: 606px;
        display: inline-block;
        margin-top: 24px;
        margin-left: 30px;
      }
      .gift-info{
        width: 100%;
        height: 490px;
        background: url("./assets/info-bg.png") no-repeat;
        position: relative;
        .mask{
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.4);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
        }
        .info-title{
          width: 141px;
          height: 38px;
          margin-top: 16px;
          margin-left: 27px;
          font-size: 20px;
          color: #ffeca4;
          text-align: center;
          line-height: 34px;
          background: url("./assets/info-title-bg.png") no-repeat;
        }
        .info-time{
          width: 100%;
          text-align: center;
          font-size: 14px;
          color: #ffeca4;
          margin-top: 11px;
        }
        .info-icon{
          position: absolute;
          &.gift-icon-1{
            width: 94px;
            height: 92px;
            background: url("./assets/gift-1.png") no-repeat;
            top: 104px;
            left: 50px;
          }
          &.gift-icon-2{
            width: 100px;
            height: 78px;
            background: url("./assets/gift-2.png") no-repeat;
            top: 115px;
            left: 47px;
          }
          &.gift-icon-3{
            width: 85px;
            height: 103px;
            background: url("./assets/gift-3.png") no-repeat;
            top: 92px;
            left: 54.5px;
          }
          &.gift-icon-4{
            width: 82px;
            height: 90px;
            background: url("./assets/gift-4.png") no-repeat;
            top: 108px;
            left: 50px;
          }
        }
        .info-detail{
          font-size: 16px;
          color: #f5d869;
          padding-left: 55px;
          margin-top: 145px;
          .reward{
            margin-top: 15px;
            position: relative;
            &:before{
              content: '';
              background-color: #f5d869;
              width: 10px;
              height: 10px;
              display: block;
              position: absolute;
              transform: rotate(45deg);
              top: 6px;
              left: -30px;
            }
            .reward-info{
              font-size: 12px;
              margin-top: 5px;
            }
          }
        }
      }
      .num{
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: #d01d59;
        margin-top: 28px;
        &.active{
          color: #ffeca4;
        }
        .num-big{
          font-size: 20px;
        }
      }
      .gift-button{
        width: 184px;
        height: 53px;
        text-align: center;
        line-height: 53px;
        font-size: 24px;
        color: #371314;
        cursor: pointer;
        margin-top: 15px;
        margin-left: 5px;
        background: url("./assets/gift-button-bg.png") no-repeat;
        &.disabled{
          cursor: default;
          background: url("./assets/gift-button-disable.png") no-repeat;
        }
      }
      .date-list{
        width: 675px;
        margin: 0 auto;
        padding-top: 50px;
        .date-item{
          width: 80px;
          height: 135px;
          margin-right: 19px;
          display: inline-block;
          cursor: pointer;
          &:last-child{
            margin-right: 0;
          }
          &:hover{
            .date-icon{
              background: url("./assets/date-icon-hover.png") no-repeat center;
              .light{
                box-shadow: 0 0 120px #db9321;
              }
            }
          }
          &.active{
            .date-icon{
              background: url("./assets/date-icon-active.png") center center;
              .light{
                box-shadow: 0 0 120px #db9321;
              }
            }
          }
          &.disabled{
            .date-icon{
              background: url("./assets/date-icon-disabled.png") no-repeat center;
              .light{
                box-shadow: 0 0 120px #cbcbcb;
              }
            }
            .date-num{
              background-color: #aaaaaa;
              color: #371314;
            }
          }
        }
        .date-icon{
          background: url("./assets/date-icon.png") no-repeat center;
          width: 84px;
          height: 100px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          .light{
            width: 50px;
            height: 50px;
            box-shadow: 0 0 120px #db9321;
            z-index: 2;
            border-radius: 50%;
          }
        }
        .date-num{
          width: 80px;
          height: 25px;
          background-color: #a10052;
          border-radius: 3px;
          color: #ffeca4;
          font-size: 14px;
          text-align: center;
          line-height: 25px;
          margin-top: 12px;
        }
      }
      .detail-list{
        width: 910px;
        margin: 0 auto;
        overflow: hidden;
        height: 309px;
        >div{
          /*display: flex;*/
          /*flex-direction: row-reverse;*/
          text-align: center;
        }
      }
      .detail-info{
        width: 173px;
        height: 267px;
        background: url("./assets/detail-info.png") no-repeat;
        display: inline-block;
        position: relative;
        border: 1px solid transparent;
        margin-top: 40px;
        margin-right: 8px;
        &:last-child{
          margin-right: 0;
        }
        &:hover{
          border-color: #d03c70;
        }
        .info-title{
          font-size: 16px;
          color: #ffeca4;
          text-align: center;
          margin-top: 25px;
        }
        .info-content{
          font-size: 20px;
          color: #ffeca4;
          text-align: center;
          margin-top: 78px;
        }
        .tip-icon{
          position: absolute;
          width: 82px;
          height: 48px;
          top: 70px;
          left: 65px;
          background: url("./assets/tip-icon.png") no-repeat;
        }
        .detail-btn{
          width: 125px;
          height: 39px;
          margin: 0 auto;
          margin-top: 53px;
          text-align: center;
          line-height: 39px;
          background: url("./assets/info-btn.png") no-repeat;
          font-size: 18px;
          color: #371314;
          cursor: pointer;
          &.over-time{
            background: url("./assets/info-btn-over-time.png") no-repeat;
            cursor: default;
          }
          &.disabled{
            background: url("./assets/info-btn-disabled.png") no-repeat;
            cursor: default;
          }
          &.has-get{
            background: url("./assets/info-btn-has-get.png") no-repeat;
            cursor: default;
          }
        }
      }
      .text-tip{
        font-size: 14px;
        color: #ffeca4;
        margin-left: 32px;
        margin-top: 69px;
        .link{
          color: #00ffcc;
        }
      }
    }
    .rule{
      width: 758px;
      margin-left: 100px;
      margin-top: 83px;
      .rule-title{
        font-size: 20px;
        letter-spacing: 0px;
        color: #ffeca4;
        margin-bottom: 27px;
      }
      p{
        padding-left: 20px;
        font-size: 14px;
        color: #c2b06b;
        &:before{
          content: '';
          width: 6px;
          height: 6px;
          background-color: #bca667;
          display: block;
          position: relative;
          top: 12px;
          left: -19px;
        }
      }
    }
  }
  .bottom-flower{
    width: 406px;
    height: 374px;
    background: url("./assets/main-flower.png") no-repeat;
    position: absolute;
    right: 294px;
    bottom: 266px;
    z-index: 0;
  }
  .flower{
    width: 1817px;
    height: 624px;
    background: url("./assets/flower-bg.png") no-repeat;
    position: absolute;
    top: 30%;
    left: 50%;
    margin-left: -609px;
    margin-top: -500px;
    transition: all .6s linear;
    filter: blur(20px);
  }
  .footer{
    width: 100%;
    height: 747px;
    position: absolute;
    bottom: 0;
    background: url('./assets/bg-bottom.png') no-repeat center;
  }
  .modal-big-size{
    width: 644px;
    height: 458px;
    background: url("./assets/modal-big-bg.png") no-repeat;
    position: relative;
    .dialog-title{
      font-size: 24px;
      color: #902b4e;
      text-align: center;
      margin-top: 120px;
    }
    .modal-close{
      top: 80px;
      right: 80px;
    }
    .content{
      width: 100%;
      height: 100%;
      font-size: 16px;
      color: #902b4e;
      .special{
        font-size: 18px;
        color: #cd4977;
      }
      .get-gift-msg{
        margin-top: 45px;
        div{
          line-height: 35px;
        }
        .get-gift-btn{
          width: 164px;
          height: 48px;
          background: url("./assets/dialog-btn-yellow.png") no-repeat;
          background-size: cover;
          text-align: center;
          line-height: 48px;
          font-size: 18px;
          color: #622022;
          margin: 0 auto;
          margin-top: 37px;
          cursor: pointer;
        }
      }
      .get-card-msg{
        margin-top: 16px;
        .get-card-info{
          width: 226px;
          height: 111px;
          background: url(./assets/dialog-get-card-bg.png) no-repeat;
          margin: 0 auto;
        }
        .card-name{
          text-align: center;
          margin-top: 25px;
        }
      }
      .card-info{
        text-align: center;
        font-size: 24px;
        color: #cd4977;
        margin-top: 10px;
      }
      .btn-list{
        margin-top: 22px;
        text-align: center;
        .card-btn{
          display: inline-block;
          text-align: center;
          width: 134px;
          height: 46px;
          background-size: cover;
          line-height: 46px;
          font-size: 18px;
          cursor: pointer;
          &.btn-yellow{
            margin-right: 35px;
            background: url(./assets/dialog-btn-yellow.png) no-repeat;
            color: #622022;
          }
          &.btn-pink{
            background: url(./assets/dialog-btn-pink.png) no-repeat;
            color: #fffefe;
          }
        }
      }
    }
  }
  .modal-close{
    width: 16px;
    height: 16px;
    background: url("./assets/close.png") no-repeat;
    position: absolute;
    cursor: pointer;
  }
  .dialog-tip{
    width: 143px;
    height: 155px;
    background: url(./assets/dialog-tip-bg.png) no-repeat;
    position: absolute;
    top: 60px;
    left: 57px;
    .text{
      font-size: 14px;
      color: #ffffff;
      transform: rotate(-48deg);
      margin-top: 40px;
    }
  }
  @keyframes showHeader {
    0%{
      width: 0;
      opacity: 0;
    }
    100%{
      width: 710px;
      opacity: 1;
    }
  }
  @keyframes brightness {
    0% {
      opacity: 0;
      filter: brightness(300%);
    }
    100% {
      opacity: 1;
      filter: brightness(100%);
    }
  }
</style>
