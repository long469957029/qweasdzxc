<template>
  <div class="desktop-main">
    <transition name="msg-info">
      <div class="content clearfix" v-if="showMsg">
        <a class="close-md close-md-gray btn-close" @click="showMsg = !showMsg"></a>
        <div :class="['icon',`icon-${type}`]"></div>
        <div class="msg-main">
          <div class="title">手机端积分商城本周上线</div>
          <div class="info">
            作为目前发展最为迅速、玩家人手必备的“无
            限彩票APP“客户端，我们将在10月20日同步
            更新上线积分...【查看更多】
          </div>
          <div class="time">2017/08/19</div>
        </div>
      </div>
    </transition>
    <transition name="msg-info">
      <div class="content ticket-content" v-if="showTicketMsg">
        <a class="close-md close-md-gray btn-close" @click="showTicketMsg = !showTicketMsg"></a>
        <div class="icon sfa-dialog-info-sm"></div>
        <div class="msg-main">
          <div class="title">温馨提示</div>
          <div class="info">
            <div>第<span class="text-prominent">{{oldPlanId}}</span>期已结束</div>
            <div>当前为<span class="text-prominent">{{newPlanId}}</span>期</div>
            <div>投注时请注意期号！</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    mame: 'desktop-message',
    data(){
      return{
        type:0, //信息类型 0是系统消息，1是平台回复， 2是提现成功，3是彩种奖期提示
        dataList:[],
        dataIndex:0,
        showMsg:false,
        title:'',
        info:'',
        time:'',
        showTicketMsg:false,
        oldPlanId:'',
        newPlanId:''
      }
    },
    watch: {
      openDeskTopMsgStatus:function () {
        if(this.openDeskTopMsgStatus){
          if(this.openDeskTopData.type === 4){
            this.showDesktop()
          }else{

          }
        }
      }
    },
    computed:{
      ...mapGetters([
        'openDeskTopMsgStatus',
        'openDeskTopData'
      ])
    },
    methods:{
      showDesktop(){
        this.oldPlanId = this.openDeskTopData.oldPlanId
        this.newPlanId = this.openDeskTopData.newPlanId
        this.showTicketMsg = true
        setTimeout(() => {
          this.showTicketMsg = false
          if(!showMsg){
            this.$store.commit(types.TOGGLE_DESKTOP_MESSAGE,{show:false,dataInfo:{}})
          }
        },2000)
      }
    }
  }
</script>
<style lang="scss" scoped>

  .msg-info-enter{
    opacity: 0;
    transform: translateX(380px);
  }
  .msg-info-leave-to{
    transform: translateY(-20px);
    opacity: 0;
  }
  .msg-info-enter-active,.msg-info-leave-active{
    transition: all .5s;
  }
  .desktop-main{
    position: fixed;
    width: 380px;
    height: 230px;
    bottom: 25px;
    right: 25px;
    z-index: 2000;
    .content{
      width: 380px;
      height: 230px;
      background-color: #ffffff;
      box-shadow: -4px 2px 24px 0px
      rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: solid 1px #cccccc;
      position: relative;
      .close-md{
        top: 10%;
      }
      .icon{
        float: left;
        width: 30px;
        height: 30px;
        margin: 33px 23px 0px 23px;
        &.icon-0{
          background: url("./images/icon-speaker.png") no-repeat center;
        }
        &.icon-1{
          background: url("./images/icon-msg.png") no-repeat center;
        }
        &.icon-2{
          background: url("./images/icon-success.png") no-repeat center;
        }
        &.icon-3{
          background: url("./images/icon-speaker.png") no-repeat center;
        }
      }
      .msg-main{
        float: left;
        width: 285px;
        margin-top: 36px;
      }
      .title{
        font-size: $font-md;
        color: $def-black-color;
      }
      .info{
        font-size: $font-sm;
        color: $new-inverse-color;
        margin-top: 21px;
      }
      .time{
        font-size: $font-sm;
        color: $font-auxiliary-color;
        margin-top: 37px;
      }
      &.ticket-content{
        position: absolute;
        top: 0;
        left: 0;
        .icon{
          width: 50px;
          height: 50px;
          margin: 62px 23px 0px 66px;
        }
        .msg-main{
          width: auto;
          margin-top: 70px;
        }
      }
    }
  }
</style>
