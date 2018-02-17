<template>
  <transition name="desk-msg-info">
    <div class="desktop-main">
      <transition name="desk-msg-info">
        <div class="content clearfix" v-if="showMsg">
          <a class="close-md close-md-gray btn-close" @click="closeMsg"></a>
          <div :class="['icon',`icon-${type}`]"></div>
          <a class="msg-main" :href="formateUrl" @click="closeMsg">
            <div class="title">{{title}}</div>
            <div class="info" v-html="formateInfo"></div>
            <div class="time">{{time}}</div>
          </a>
        </div>
      </transition>
      <transition name="desk-msg-info">
        <div class="content ticket-content" v-if="showTicketMsg">
          <a class="close-md close-md-gray btn-close" @click="closeTicketMsg"></a>
          <div class="icon sfa-dialog-info-sm"></div>
          <div class="msg-main">
            <div class="title">温馨提示</div>
            <div class="info">
              <div>第<a class="text-prominent">{{oldPlanId}}</a>期已结束</div>
              <div>当前为<a class="text-prominent">{{newPlanId}}</a>期</div>
              <div>投注时请注意期号！</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
  export default {
    mame: 'desktop-message',
    data() {
      return {
        type: 0, //信息类型 0是系统消息，1是平台回复， 2是提现成功，3是彩种奖期提示
        dataList: [],
        dataIndex: 0,
        showMsg: false,
        title: '',
        info: '',
        time: '',
        showTicketMsg: false,
        oldPlanId: '',
        newPlanId: ''
      }
    },
    watch:{
      openDeskTopData: function () {
        if(Array.isArray(this.openDeskTopData)){
          this.dataList = [...this.dataList, ..._.filter(this.dataList, item => {
            const isExist = _(_(this.openDeskTopData).findWhere({noticeId:item.noticeId,time:item.time})).isUndefined() ? false : true
            return !isExist
          })]
          this.formateMsgData()
        }else if (this.openDeskTopData.type === 3) {  // 彩种奖期提示特殊处理
          this.showTicket()
        }
      }
    },
    computed: {
      ...mapGetters([
        'openDeskTopMsgStatus',
        'openDeskTopData'
      ]),
      formateInfo:function () {
        let info = this.info
        if(this.type !== 2){
          if(this.info.length > 42){
            info = this.info.slice(0,42) + '...<a class="text-cool">【查看更多】</a>'
          }
        }
        return info
      },
      formateUrl:function () {
        return this.type === 0 ? `#/uc/mg?id=${this.dataList[this.dataIndex].noticeId}` : (this.type === 1 ? '#/uc/fb' : '#/fc/wd')
      }
    },
    methods: {
      showDesktop() {  // 显示桌面通知
        if(this.openDeskTopMsgStatus){
          if(Array.isArray(this.openDeskTopData)){
            this.formateMsgData()
          }else if (this.openDeskTopData.type === 3) {
            this.showTicket()
          }
        }
      },
      showTicket(){  // 彩票奖期到时通知
        this.oldPlanId = this.openDeskTopData.oldPlanId
        this.newPlanId = this.openDeskTopData.newPlanId
        this.showTicketMsg = true
        setTimeout(() => {
          this.showTicketMsg = false
          if (!this.showMsg) {
            this.$store.commit(types.TOGGLE_DESKTOP_MESSAGE, {show: false, dataInfo: {}})
          }
        }, 3000)
      },
      formateMsgData(){  //  其他正常通知类信息处理
        if(_(this.dataList).isEmpty()){
          this.dataList = this.openDeskTopData
        }
        this.title = this.dataList[this.dataIndex].title
        this.info = this.dataList[this.dataIndex].desc
        this.time = _(this.dataList[this.dataIndex].time).toDate()
        this.showMsg = true
        this.type = this.dataList[this.dataIndex].type
        this.msgTimer = setTimeout(() => {
          this.closeMsg()
        }, 15000)
      },
      closeTicketMsg() {
        this.showTicketMsg = !this.showTicketMsg
        if (!this.showMsg) {
          this.$store.commit(types.TOGGLE_DESKTOP_MESSAGE, {show: false, dataInfo: {}})
        }
      },
      closeMsg() {
        this.showMsg = !this.showMsg
        this.dataIndex += 1
        clearTimeout(this.msgTimer)
        if(this.dataIndex < this.dataList.length){
          setTimeout(() => {
            this.formateMsgData()
          },800)
        }else{
          this.$store.commit(types.TOGGLE_DESKTOP_MESSAGE, {show: false, dataInfo: {}})
        }
      }
    },
    mounted() {
      this.showDesktop()
    }
  }
</script>
<style lang="scss">

  .desk-msg-info-enter {
    opacity: 0;
    transform: translateX(380px);
  }

  .desk-msg-info-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }

  .desk-msg-info-enter-active, .desk-msg-info-leave-active {
    transition: all .5s;
  }

  .desktop-main {
    position: fixed;
    width: 325px;
    height: 194px;
    bottom: 20px;
    right: 20px;
    z-index: 2000;
    .content {
      width: 325px;
      height: 194px;
      background-color: #ffffff;
      box-shadow: -4px 2px 24px 0px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      position: relative;
      .close-md {
        top: 10%;
        width: 17px;
        height: 16px;
        background: url("./images/close.png") no-repeat;
      }
      .icon {
        float: left;
        width: 24px;
        height: 24px;
        margin: 33px 10px 0px 26px;
        &.icon-0 {
          background: url("./images/icon-speaker.png") no-repeat center;
        }
        &.icon-1 {
          background: url("./images/icon-msg.png") no-repeat center;
        }
        &.icon-2 {
          background: url("./images/icon-success.png") no-repeat center;
        }
        &.icon-3 {
          background: url("./images/icon-speaker.png") no-repeat center;
        }
      }
      .msg-main {
        float: left;
        width: 250px;
        margin-top: 34px;
      }
      .title {
        font-size: $font-md;
        color: $def-black-color;
      }
      .info {
        font-size: $font-sm;
        color: $new-inverse-color;
        margin-top: 20px;
        span{
          color: $prominent-color;
        }
      }
      .time {
        font-size: $font-sm;
        color: $font-auxiliary-color;
        margin-top: 20px;
      }
      &.ticket-content {
        position: absolute;
        top: 0;
        left: 0;
        .icon {
          width: 50px;
          height: 50px;
          margin: 45px 23px 0px 36px;
        }
        .msg-main {
          width: auto;
          margin-top: 51px;
        }
      }
    }
  }
</style>
