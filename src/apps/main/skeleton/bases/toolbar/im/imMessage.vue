<template>
  <div class="content-rightBar-empty" v-if="getMessagePanelStatus===0">
    请在左侧列表选择您要联系的上下级
  </div>
  <div class="im-message-panel" v-else>
    <div class="im-contact-message-panel">
      <!--消息界面头部-->
      <div class="im-chat-title">
        <!--系统管理员-->
        <span class="chat-title-lg" v-if="getMessagePanelStatus===1">系统管理员</span>
        <span class="chat-title-sm" v-if="getMessagePanelStatus===1">及时为您发送平台活动、公告等内容，重要信息再也不要错过哦～</span>
        <!--私聊-->
        <span class="chat-title-lg" v-if="getMessagePanelStatus===2">与<span
          class="chat-title-name">{{getContactUserInfo.userName}}</span>的对话</span>
        <!--群发-->
        <span class="chat-title-lg" v-if="getMessagePanelStatus===3||getMessagePanelStatus===4">群发消息</span>
        <div class="chat-mess-add pull-right"
             v-if="showPanelButtonStatus===0"
             @click.stop="showMessSelectPanel(-1)">
          <span class="btn-chat-hidden-logo sfa sfa-icon-mess-contacts"></span>
          <span class="btn-chat-hidden">添加联系人</span>
        </div>
        <div class="chat-mess-edit pull-right " @click.stop="showMessSelectPanel(-2)"
             v-if="showPanelButtonStatus===1||showPanelButtonStatus===2">
          <span class="btn-chat-edit-logo sfa sfa-icon-mess-add"></span>
          <span class="btn-chat-edit"><span
            class="btn-chat-edit-num">{{getMessContactSelected.length}}</span>个联系人</span>
          <span class="btn-chat-edit-img">
                  <i class="fa fa-chevron-down" aria-hidden="true"></i>
        </span>
        </div>
      </div>
      <!--消息界面消息显示主体-->
      <div class="im-chat-content" :class="{admin:getMessagePanelStatus===1}">
        <im-message-content></im-message-content>
        <div class="chat-message-noContact" v-if="showNoContactPanel">
          <div class="sfa sfa-info-icon vertical-sub pull-left">
          </div>
          <div class="chat-message-noContact-text">请先添加联系人</div>
        </div>
      </div>
      <!--消息界面底部-->
      <div class="im-chat-footer"
           v-if="getMessagePanelStatus!==1">
        <div class="chat-footer-input ">
          <div class="content-editable" contenteditable="true">{{messageInput}}
          </div>
          <textarea class="chat-input" placeholder="请输入要发送的信息"
                    data-type="private" v-model="messageInput" @keyup.enter="sendMessage()" contenteditable="true"
                    v-html="messageInput" id="textarea" @focus="changeClickStatus"
                    @blur="changeClickStatus(1)"></textarea>
        </div>
        <div class="sfa sfa-icon-smile-gray chat-footer-smile inline-block" @click="showSmilePanel"
             :class="{active:smilePanelOpened}">
          <div class="chat-exp-pack-inner" v-if="smilePanelOpened" @click.stop="">
            <div class="chat-exp-pack-inner-panel clearfix">
              <span v-for="(item,index) in expressionList" class="chat-exp" :title="item.title"
                    @click.stop="addSmileToInput(item.title)">
                <img :src="item.url" class="chat-exp-face">
              </span>
            </div>
          </div>
        </div>
        <div class="sfa sfa-icon-send-gray chat-footer-send inline-block"
             @click="sendMessage" :class="{active:clickButtonActive}" title="点击发送"></div>
      </div>
      <!--群发界面联系人选择面板-->
      <div class="im-mess-contact-select-panel"
           :class="{sideLeft:(getMessagePanelStatus===3||getMessagePanelStatus===4)&&getMessContactPanelStatus}">
        <im-mess-contact-select></im-mess-contact-select>
      </div>
    </div>
  </div>
</template>
<script>
  import ImMessContactSelect from "./imMessContactSelect";
  import ImMessageContent from "./imMessageContent";
  const ExConf = require('./expressionConf')
  export default{
    name: 'message',

    data () {
      return {
        messageInput: '',
        messSelectPanelOpened: false,
        smilePanelOpened: false,
        expressionList: [],
        clickButtonActive: false,
        showPanelButtonStatus: 0,
        sendType: 'personal',
        showNoContactPanel: false,
      }
    },

    props: {},

    components: {
      ImMessageContent,
      ImMessContactSelect
    },

    mounted () {
      this.expressionList = ExConf.getAll()._wrapped
    },

    watch: {
      getClickMessSelectPanelOutSideStatus(){
        this.$store.commit(types.TOGGLE_MESS_CONTACT_PANEL, false)
      },
      getSendChatStatus(){
        this.formatSendResult(this.getSendChatStatus)
      },
      getMessContactSelected(){
        if (this.getMessContactSelected.length > 0) {
          this.showPanelButtonStatus = 1
        } else {
          this.showPanelButtonStatus = 0
        }
      },
      getMessContactPanelStatus(){
        this.messSelectPanelOpened = this.getMessContactPanelStatus
      },
      getMessagePanelStatus(){
        if (this.getMessagePanelStatus === 3 || this.getMessagePanelStatus == 4) {
          this.sendType = 'mess'
        } else {
          this.sendType = 'personal'
        }
        if (this.getMessagePanelStatus === 4) {
          this.showPanelButtonStatus = 2
        }
        if (this.getMessagePanelStatus === 1 || this.getMessagePanelStatus === 2) {
          this.showPanelButtonStatus = -1
        }
      },
      getCreateMessGroupStatus(){
        this.formatCreateMessGroup(this.getCreateMessGroupStatus)
      }
    },

    computed: {
      ...mapGetters([
        'getContactSubList',
        'getMessagePanelStatus',
        'getContactUserInfo',
        'getMessContactPanelStatus',
        'getMessContactSelectedStatus',
        'getClickMessSelectPanelOutSideStatus',
        'getMessSelectedContact',
        'getSendChatStatus',
        'getMessContactSelected',
        'getCreateMessGroupStatus',
        'username',
        'userAvatar',
      ])
    },

    filters: {},

    methods: {
      showMessSelectPanel(val){
        this.$store.commit(types.TOGGLE_MESS_CONTACT_PANEL, true)
        this.$store.commit(types.GET_MESS_CONTACT, val)
      },
      sendMessage(){
        if (this.messageInput.replace(/(^\s*)|(\s*$)/g, "") !== "") {

          if (this.sendType === 'personal') {
            this.$store.dispatch(types.SEND_PEASONAL_CHAT, {
              content: this.messageInput,
              toUser: this.getContactUserInfo.userId
            })
//            const sendText = [{
//              content: this.messageInput,
//              userName: this.username,
//              headIcon: this.userAvatar,
//              sendTime: new Date(),
//            }]
//            this.$store.commit(types.IS_SEND, sendText)
            this.messageInput = ''
          } else if (this.sendType === 'mess') {
//            const sendText = [{
//              content: this.messageInput,
//              userName: '群发消息',
//              headIcon: this.userAvatar,
//              sendTime: new Date(),
//            }]
//            this.$store.commit(types.IS_SEND, sendText)
            if (this.getMessContactSelected.length === 0) {
              this.showNoContactPanel = true
            } else if (this.getMessContactSelected.length > 0) {
              if (this.showNoContactPanel) {
                this.showNoContactPanel = false
              }
              this.createGroup()
            }
          }
          if (this.smilePanelOpened) {
            this.smilePanelOpened = false
          }
        }
      },
      formatSendResult(data){
        if (data && data.result === 0) {
          if (this.sendType === 'personal') {
            this.$store.dispatch(types.GET_IM_CONTACT_CHAT, {
              userId: this.getContactUserInfo.userId,
              pageSize: 30
            })
          } else if (this.sendType === 'mess') {
            this.$store.dispatch(types.GET_IM_MESS_CHAT, {
              groupId: this.getCreateMessGroupStatus.root.groupId,
              pageSize: 15
            })
          }
          this.messageInput = ''
        } else {
          Global.ui.notification.show('消息发送失败！')
        }
      },
      createGroup(){
        const contact = []
        _(this.getMessContactSelected).each((item) => {
          contact.push(item.userId)
        })
        const userString = contact.join(',')
        this.$store.dispatch(types.CREATE_MESS_GROUP, {
          userIds: userString,
        })
      },
      formatCreateMessGroup(data){
        if (data && data.result === 0) {
          this.$store.dispatch(types.SEND_MESS_CHAT, {
            content: this.messageInput,
            groupId: data.root.groupId,
          })
        } else {
          Global.ui.notification.show('群聊创建失败！')
        }
      },
      showSmilePanel(){
        if (this.smilePanelOpened) {
          this.smilePanelOpened = false
        } else {
          this.smilePanelOpened = true
        }
      },
      changeClickStatus(status){
        this.clickButtonActive = true
        if (status === 1) {
          if (this.messageInput.replace(/(^\s*)|(\s*$)/g, "") === "") {
            this.clickButtonActive = false
          }
        }
      },
      async addSmileToInput(val){
        const myField = document.querySelector('#textarea')
        if (myField.selectionStart || myField.selectionStart === 0) {
          const startPos = myField.selectionStart
          const endPos = myField.selectionEnd
          this.messageInput = myField.value.substring(0, startPos) + '[' + val + ']' + myField.value.substring(endPos, myField.value.length)
          await this.$nextTick() // 这句是重点, 圈起来
          myField.focus() // 激活光标
          myField.setSelectionRange(endPos + val.length + 2, endPos + val.length + 2) // 选择光标的位置
        } else {
          this.messageInput += val
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-rightBar-empty {
    text-align: center;
    margin-top: 245px;
    font-size: 14px;
    color: $font-auxiliary-color;
  }

  .im-message-panel {
    height: 570px;
    width: 100%;
    .chat-title {
      position: relative;
      width: 575px;
    }
    .im-contact-message-panel {
      width: 100%;
      display: flex;
      height: 570px;
      flex-direction: column;
      flex-flow: column;
      position: relative;
      color: #999999;
      min-height: 52px;
      .im-chat-title {
        padding: 18px 0 17px 17px;
        width: 97%;
        border-bottom: 1px solid #d7d7d7;
        .chat-title-lg {
          font-size: 14px;
          color: $def-black-color;
        }
        .chat-title-sm {
          color: $font-auxiliary-color;
          margin-left: 10px;
        }
        .chat-title-name {
          margin: 0 3px;
        }
        border-bottom: 1px solid $def-line-color;
        .chat-mess-add {
          cursor: pointer;
          .btn-chat-hidden-logo {
            position: absolute;
            right: 97px;
            margin-top: -3px;
            //width: 29px !important;
          }
          .btn-chat-hidden {
            right: 14px;
            position: absolute;
            border-radius: 3px;
            color: $new-inverse-color;
            width: 80px;
            height: 25px;
            margin-top: -2px;
            font-size: 12px;
            padding: 2px;
            border: 0;
            background: #ffffff;
          }
        }
        .chat-mess-edit {
          cursor: pointer;
          .btn-chat-edit-logo {
            margin-top: -4px;
            vertical-align: middle;
          }
          .btn-chat-edit {
            border-radius: 3px;
            color: $new-inverse-color;
            min-width: 50px;
            height: 25px;
            margin-top: -2px;
            font-size: 12px;
            padding: 2px;
            border: 0;
            background: #ffffff;
          }
          .btn-chat-edit-img {
            margin-right: 20px;
            color: #666666;
          }
        }
      }
      .im-chat-content {
        //height: 462px;
        flex-grow: 1;
        width: 100%;
        text-align: center;
        max-height: 462px;
        position: relative;
        &.admin {
          height: 510px;
        }
        .chat-message-noContact {
          margin-top: 208px;
          margin-left: 240px;
          font-size: 14px;
          .chat-message-noContact-text {
            margin-left: 28px;
            text-align: left;
          }
        }
      }
      .im-chat-footer {
        min-height: 51px;
        max-height: 96px;
        width: 592px;
        position: relative;
        color: $font-auxiliary-color;
        border-top: 1px solid $def-line-color;
        .chat-footer-input {
          margin: 14px 20px;
          width: 420px;
          overflow: auto;
          position: relative;
          min-height: 23px;
          .chat-input {
            border: 0;
            outline-width: 0;
            margin-bottom: 0;
            resize: none;
            position: absolute;
            overflow: auto;
            line-height: 21px;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: .1px 0;
            //line-height: normal;
            //font-size: .27rem;
            font-size: 12px;
            color: #464545;
            text-align: left;
            background-color: transparent;
            flex-grow: 1;
            max-height: 63px;
            overflow-x: hidden;
            &::-webkit-input-placeholder {
              text-align: left;
              //font-size: .27rem;
              font-size: 12px;
              color: #999;
            }
          }
          .content-editable {
            overflow: auto;
            z-index: -1;
            opacity: 0;
            display: block;
            width: 100%;
            //font-size: .27rem;
            font-size: 12px;
            line-height: 23px;
            color: #999;
            max-height: 63px;
            position: relative;
          }
        }
        .chat-footer-smile {
          position: absolute;
          right: 66px;
          bottom: 14px;
          cursor: pointer;
          &.active, &:hover {
            background-position: 0;
            background-image: url("~base/images/sprites/im/icon-smile-green.png")
          }
          .chat-exp-pack-inner {
            position: absolute;
            left: -250px;
            top: -395px;
            width: 288px;
            height: 334px;
            padding: 20px;
            border: 0;
            border-radius: 5px;
            background-color: #fff;
            z-index: 2;
            box-shadow: 0 0 7px 0 rgba(0, 0, 0, .2);
            &:after {
              content: '';
              display: inline-block;
              position: absolute;
              right: 56px;
              bottom: -20px;
              width: 0px;
              height: 6px;
              border-top: 15px solid #fff;
              border-right: 10px solid transparent;
              border-left: 10px solid transparent;
              //transform: rotate3d(1,0,.5,45deg) ;
              //box-shadow: 1px 1px 7px 0 rgba(0,0,0,.2);
            }
            &:before {
              content: '';
              display: inline-block;
              position: absolute;
              right: 54px;
              bottom: -20px;
              width: 0px;
              height: 4px;
              border-top: 16px solid rgba(172, 171, 171, 0.2);
              border-right: 12px solid transparent;
              border-left: 11px solid transparent;
              //transform: rotate3d(1,0,.5,45deg) ;
              //box-shadow: 1px 1px 7px 0 rgba(0,0,0,.2);
            }
            .chat-exp-pack-inner-panel {
              //background: #d4d4d4;
              //border-radius: 3px;
            }
            .chat-exp {
              width: 30px;
              height: 30px;
              margin: 2px 3px;
              border-radius: 3px;
              float: left;
              text-align: center;
              .chat-exp-face {
                margin-top: 3px;
              }
            }
            &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5), &:nth-child(6), &:nth-child(7), &:nth-child(8) {
              margin-top: 0;
            }
            &:nth-last-child(1), &:nth-last-child(2) {
              margin-bottom: 0;
            }
            &:nth-child(8n) {
              margin-right: 0;
            }
            &:nth-child(8n+1) {
              margin-left: 0;
            }
            transition: background-color .1s;
          }
        }
        .chat-footer-send {
          position: absolute;
          right: 27px;
          bottom: 16px;
          cursor: pointer;
          &.active {
            background-position: 0;
            background-image: url("~base/images/sprites/im/icon-send-green.png")
          }
        }
      }
      .im-mess-contact-select-panel {
        position: absolute;
        z-index: 2;
        right: 0;
        background-color: white;
        box-shadow: -2px 0 10px #f6f6f6, 0 -2px 5px #f6f6f6;
        height: 570px;
        transition: width 0.5s;
        overflow: hidden;
        width: 0;
        .chat-person-panel {
          .chat-person-panel-title {
            color: #333333;
            .panel-title-text {
              font-size: 14px;
            }
            .panel-title-close {
              top: 20px;
            }
            &.edit {
              margin-bottom: 13px;
              border-bottom: 1px solid #e6e6e6;
              height: 35px;
            }
            .panel-title-checkbox-panel {
              background: linear-gradient(to bottom, #e8e8e8, white);
              border-radius: 2px;
              width: 14px;
              height: 14px;
              vertical-align: middle;
              margin-left: 50px;
              position: relative;
              margin-top: 2px;
              border: 1px solid #e6e6e6;
            }
            .panel-title-checkbox {
              border-radius: 2px;
              width: 14px;
              height: 14px;
              vertical-align: middle;
              margin-left: 50px;
              position: relative;
              margin-top: 2px;
              background: #14b1bb;
              border: 1px solid #129ea7;
            }
            .panel-title-checkbox:after {
              content: '\A0';
              display: inline-block;
              border: 3px solid #ffffff;
              border-top-width: 0;
              border-right-width: 0;
              width: 6px;
              height: 3px;
              -webkit-transform: rotate(-50deg);
              position: absolute;
              top: 3px;
              left: 3px;
            }
          }

        }
        .chat-select-panel {
          margin-top: 20px;
          transition: height 0.5s;
          padding: 0 10px;
          .search-panel {
            position: relative;
            padding: 4px 0;
            .search-panel-img {
              position: absolute;
              margin: 8px 0;
            }
            .search-panel-input {
              width: 156px;
              height: 30px;
              outline-width: 0;
              border: 0;
              border-bottom: 1px solid #e6e6e6;
              padding-left: 27px;
              border-radius: 0;
              font-size: 12px;
              color: #999999;
              &.active {
                border-bottom: 1px solid $new-main-deep-color;
              }
            }
          }
          .select-container {
            float: left;
            position: relative;
            overflow: auto;
            height: 434px;
            .select-superior {
              cursor: pointer;
              padding-top: 10px;
              color: $new-inverse-color;
              &.active, &:hover {
                color: $new-main-deep-color;
              }
            }
            &.edit {
              height: 480px;
            }
            .select-sub {
              cursor: pointer;
              line-height: 10px;
              color: $font-auxiliary-color;
              padding-top: 10px;
              .select-sub-img {
                position: absolute;
                margin-left: -16px;
              }
            }
            .select-sub-container {
              overflow: auto;
              width: 185px;
              margin-top: 6px;
              .select-sub-items {
                .select-sub-item {
                  padding: 7px 0;
                  cursor: pointer;
                  position: relative;
                  .contact-status {
                    border: 1px solid #ffffff;
                    width: 9px;
                    height: 9px;
                    background-color: #62c655;
                    position: absolute;
                    margin-top: 30px;
                    margin-left: -15px;
                  }
                  .select-sub-item-isSelect {
                    margin-right: 20px;
                    color: #999999;
                    font-size: 14px;
                    margin-top: 3px;
                    display: none
                  }
                  .contact-name {
                    margin-left: 17px;
                  }
                  .sub-item-checkbox-panel {
                    background: white;
                    border-radius: 50px;
                    width: 14px;
                    height: 14px;
                    vertical-align: middle;
                    border: 1px solid #e6e6e6;
                    right: 10px;
                    position: absolute;
                    margin-top: 10px;
                  }
                  .sub-item-checkbox {
                    border-radius: 50px;
                    width: 14px;
                    height: 14px;
                    vertical-align: middle;
                    background: #14b1bb;
                    border: 1px solid #129ea7;
                    right: 10px;
                    position: absolute;
                    margin-top: 10px;
                  }
                  .sub-item-checkbox:after {
                    content: '\A0';
                    display: inline-block;
                    border: 2px solid #ffffff;
                    border-top-width: 0;
                    border-right-width: 0;
                    width: 7px;
                    height: 3px;
                    -webkit-transform: rotate(-50deg);
                    position: absolute;
                    top: 4px;
                    left: 3px;
                  }
                  &.active, &:hover {
                    color: $new-main-deep-color;
                    .select-sub-item-isSelect {
                      color: $new-main-deep-color;
                    }
                  }
                  &.active {
                    .select-sub-item-isSelect {
                      display: block;
                    }
                  }
                }
              }

            }
          }
        }
        .select-container-footer {
          border-top: 1px solid #e9e9e9;
          height: 48px;
          .mess-contact-add {
            width: 58px;
            background: #14b1bb;
            color: white;
            margin-top: 12px;
            margin-left: 68px;
            text-align: center;
            padding: 3px 0;
            height: 20px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          }
          .mess-contact-cancel {
            width: 58px;
            background: #cccccc;
            color: white;
            margin-top: 12px;
            margin-left: 10px;
            text-align: center;
            padding: 3px 0;
            height: 20px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          }
        }
        &.sideLeft {
          width: 210px;
        }
      }
    }
  }
</style>

