<template>
  <div>
    <!--联系人列表-->
    <div class="im-contact-panel" v-if="!getSearchResultPanelStatus">
      <div class="contact-panel-title">
        <div class="title-contact" :class="{active:selectPanel===1}" @click="toggleTabs(1)">
          联系人
        </div>
        <div class="title-recently" :class="{active:selectPanel===2}" @click="toggleTabs(2)">
          <div class="recently-newMessage-title inline-block">
            近期
          </div>
          <div class="recently-newMessage-num inline-block"
               :class="{hasNum:getRecentlyNewMessageNum>0,lg:getRecentlyNewMessageNum>=10}"
               v-if="getRecentlyNewMessageNum>0">
            <div class="recently-newMessage-num-text inline-block">{{getRecentlyNewMessageNum}}</div>
          </div>
        </div>
      </div>
      <div class="contact-container" v-show="selectPanel===1">
        <div class="person-item" @click="selectContact('admin','')" :class="{active:activeContactType==='admin'}">
          <span class="sfa sfa-avata-admin"></span>
          <span class="contact-name">系统管理员</span>
        </div>
        <div class="person-item" v-if="getContactParent!==''&&getContactParent.userId!=1"
             @click="selectContact('parent')"
             :class="{'active':activeContactType==='parent'}">
            <span class="sfa sfa-avatar-online person-item-avatar" :class="{avatarGray:!getContactParent.online}">
              <img :src="getContactParent.headIcon">
            </span>
          <span class="text-circle contact-status" v-if="getContactParent.online"></span>
          <span class="contact-name">我的上级</span>
        </div>
        <div class="person-sub-title" v-show="getUserType">
          <span class="person-sub-img"><i class="fa fa-caret-right" aria-hidden="true"></i></span>
          <span class="contact-name person-sub-name ">我的下级</span>
        </div>
        <div class="person-sub-container">
          <div class="person-item" v-for="(item,index) in getContactSubList"
               @click="selectContact(index,item)"
               :class="{active:index===activeContactType}">
            <span class="sfa sfa-avatar-online person-item-avatar" :class="{avatarGray:!item.online}">
              <img :src="item.headIcon"></span>
            <span class="text-circle contact-status" v-if="item.online"></span>
            <span class="contact-name">{{item.userName}}</span>
          </div>
        </div>
      </div>
      <!--近期联系人列表-->
      <div class="recently-container" v-show="selectPanel===2">
        <div class="recently-item" v-for="(item,index) in getRecentlyList" @click="selectRecently(index,item)"
             :class="{active:index===activeRecently}">
          <span class="sfa sfa-avata-admin inline-block" v-if="item.type===0"></span>
          <span class="sfa sfa-avata-persons inline-block" v-else-if="item.type===1"></span>
          <span class="sfa sfa-avatar-online person-item-avatar inline-block" :class="{avatarGray:!item.online}" v-else>
            <img :src="item.headIcon">
          </span>
          <span class="text-circle contact-status" v-if="item.type===2&&item.online"></span>
          <div class="recently-item-info inline-block"
               :class="{no:item.newMsgNum===0 || item.type===0}">
            <div class="recently-name">{{item.name}}<span v-if="item.type===1">({{item.groupSize}}人)</span></div>
            <div class="recently-desc" v-if="item.newMsgNum>0&&item.type!==0">
              {{item.lastMessage}}
            </div>
          </div>
          <div class=" recently-item-info-num" v-if="item.newMsgNum>0" :class="{lg:item.newMsgNum>=10}">
            <div class="recently-newMessage-num-text inline-block">{{item.newMsgNum}}</div>
          </div>
          <span class="sfa sfa-icon-im-contact-close recently-message-close"
                @click.stop="closeRecentlyRecord(item)"></span>
        </div>
      </div>
    </div>
    <!--联系人查询列表-->
    <div class="contact-search-result-container" v-else="getSearchResultPanelStatus">
      <div class="search-container-hasResult" v-if="getSearchResultList.length>0">
        <div class="person-item" v-for="(item,index) in getSearchResultList" @click="selectSearchResult(index,item)"
             :class="{active:index===activeSearchResult}">
          <span class="sfa sfa-avatar-online person-item-avatar" :class="{avatarGray:!item.online}">
            <img :src="item.headIcon">
          </span>
          <span class="text-circle contact-status" v-if="item.online"></span>
          <span class="contact-name">{{item.userName}}</span></div>
      </div>
      <div class="search-container-noResult" v-if="getSearchResultList.length===0">
        未搜索到该用户
      </div>
    </div>
  </div>
</template>
<script>
  import {getImContactApi, getImRecentlyApi} from 'api/message'
  import avatarConf from 'userCenter/misc/avatarConfig'
  export default{
    name: 'contact',

    data () {
      return {
        selectPanel: 1,
        activeContactType: '',
        activeRecently: '',
        activeSearchResult: '',
      }
    },

    props: {},

    components: {},

    mounted () {
      this.$store.dispatch(types.GET_IN_CONTACT)
      this.$store.dispatch(types.GET_IM_RECENTLY_CONTACT)
      this.startPollingContactInfo()
    },

    watch: {
      getMessagePanelStatus(){
        if (this.getMessagePanelStatus === 3) { // 点击群聊时，取消所有联系人选中状态
          this.activeContactType = ''
          this.activeRecently = ''
          this.activeSearchResult = ''
        }
      },
      getDelRecentlyRecordStatus(){
        this.formatCloseRecordResult(this.getDelRecentlyRecordStatus)
      }
    },
    beforeDestroy () {
      clearInterval(this.contactPolling)
      clearInterval(this.recentlyPolling)
    },
    computed: {
      ...mapGetters([
        'getUserType',
        'getRecentlyList',
        'getRecentlyNewMessageNum',
        'getContactSubList',
        'getContactParent',
        'getSearchResultPanelStatus',
        'getSearchResultList',
        'getMessagePanelStatus',
        'getContactPollingStopStatus',
        'getDelRecentlyRecordStatus',
      ]),
    },

    filters: {},

    methods: {
      closeRecentlyRecord(item){
        let cType = -1
        let cId = -1
        // 近期列表记录状态，0：系统管理员，1：群聊，2：个人聊天
        if (item.type === 1) {
          cType = 1  // cType:0:用户，1：群聊
          cId = item.groupId
        } else if (item.type === 2) {
          cType = 0
          cId = item.userId
        }
        this.$store.dispatch(types.CLOSE_RENCENTLY_RECORD, {
          chatId: cId,
          chatType: cType,
        })
      },
      formatCloseRecordResult(data){
        if (data && data.result === 0) {
          this.$store.dispatch(types.GET_IM_RECENTLY_CONTACT)
          this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 0)
        } else {
          Global.ui.notification.show('近期联系人删除失败！')
        }
      },
      toggleTabs(tabText)
      {
        this.selectPanel = tabText;
      },
      selectContact(type, item)
      {
        this.activeContactType = type
        this.activeRecently = ''
        this.activeSearchResult = ''
        if (type === 'admin') {
          this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 1)
          this.$store.commit(types.UPDATE_CONTACT_USER_INFO, 'admin')
        } else if (type === 'parent') {
          this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 2)
          this.$store.commit(types.UPDATE_CONTACT_USER_INFO, this.getContactParent)
        } else {
          this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 2)
          this.$store.commit(types.UPDATE_CONTACT_USER_INFO, item)
        }
      },
      selectRecently(index, item)
      {
        this.activeRecently = index
        this.activeContactType = ''
        this.activeSearchResult = ''
        if (item.type === 0) {
          this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 1)
          this.$store.commit(types.UPDATE_CONTACT_USER_INFO, 'admin')
        } else {
          if (item.type === 1) {
            this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 4) //打开群聊面板
          } else {
            this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 2) // 打开个人面板
          }
          this.$store.commit(types.UPDATE_CONTACT_USER_INFO, item)
        }
      },
      selectSearchResult(index, item)
      {
        this.activeSearchResult = index
        this.activeRecently = ''
        this.activeContactType = ''
        this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 2)
        this.$store.commit(types.UPDATE_CONTACT_USER_INFO, item)
      },
      // 轮询联系列表信息
      startPollingContactInfo() {
        this.contactPolling = setInterval(() => {
          this.$store.dispatch(types.GET_IN_CONTACT)
        }, 30000)
        this.recentlyPolling = setInterval(() => {
          this.$store.dispatch(types.GET_IM_RECENTLY_CONTACT)
        }, 5000)
      },
    },
  }
</script>

<style scoped lang="scss">
  .im-contact-panel {
    .contact-panel-title {
      border-bottom: 1px solid #d7d7d7;
      background-color: $new-main-body-color;
      .title-contact {
        position: relative;
        cursor: pointer;
        padding: 12px 41px;
        color: $new-inverse-color;
        font-size: 14px;
        display: inline-block;
        &.active {
          color: $new-main-deep-color;
          border-bottom: 2px solid $new-main-deep-color;
        }
      }
      .title-recently {
        position: relative;
        cursor: pointer;
        height: 32px;
        width: 112px;
        color: $new-inverse-color;
        font-size: 14px;
        margin-top: 12px;
        display: inline-block;
        .recently-newMessage-title {
          margin-left: 39px;
        }
        .recently-newMessage-num {
          width: 15px;
          height: 15px;
          background-color: $new-main-body-color;
          color: #ffffff;
          font-size: 10px;
          line-height: 12px;
          border-radius: 40px;
          text-align: center;
          position: absolute;
          margin-top: 3px;
          margin-left: 5px;
          .recently-newMessage-num-text {
            transform: scale(0.8);
            line-height: 14px;
            font-size: 10px;
            margin-left: -1px;
          }
          &.hasNum {
            background-color: #f09932;
          }
          &.lg {
            width: 26px;
          }
        }
        &.active {
          color: $new-main-deep-color;
          border-bottom: 2px solid $new-main-deep-color;
        }
      }

    }
    .content-leftBar-title {
      background-color: $new-main-body-color;
    }
    .contact-container {
      padding: 8px 0 0 0;
      overflow: auto;
      height: 407px;
      background-color: $new-main-body-color;
      .person-sub-container {
        max-height: 300px;
      }
      .person-item {
        cursor: pointer;
        padding: 8px 0 8px 26px;
        height: 38px;
        position: relative;

        .contact-name {
          margin-left: 13px;
          font-size: 12px;
          color: $new-inverse-color;
          vertical-align: top;
          line-height: 38px;
        }
        .contact-status {
          border: 1px solid #ffffff;
          width: 9px;
          height: 9px;
          background-color: #62c655;
          position: absolute;
          margin-top: 30px;
          margin-left: -15px;
        }
        &.active {
          background-color: #afbbc6;
          .contact-name {
            color: $def-white-color;
          }
          &:hover {
            background-color: #afbbc6;
          }
        }
        &:hover {
          background-color: #e9e9e9;
        }
      }
      .person-sub-title {
        margin: 21px 0 12px 0;
        .person-sub-img {
          margin-left: 26px;
          color: $def-gray-color;
          font-size: 18px;
        }
        .person-sub-name {
          vertical-align: top;
          font-size: 14px;
          margin-left: 13px;
        }
      }
    }
    .person-item-avatar {
      float: left;
    }
    .recently-container {
      overflow: auto;
      padding: 8px 0 0 0;
      height: 407px;
      background-color: $new-main-body-color;
      .recently-item {
        position: relative;
        cursor: pointer;
        padding: 8px 0 8px 26px;
        height: 38px;
        .recently-item-img {
          float: left;
        }
        .contact-name {
          margin-left: 0px;
          font-size: 12px;
          color: $new-inverse-color;
          vertical-align: top;
          line-height: 20px;
        }
        .contact-status {
          border: 1px solid #ffffff;
          width: 9px;
          height: 9px;
          background-color: #62c655;
          position: absolute;
          margin-top: 30px;
          margin-left: -15px;
        }
        .recently-item-info {
          margin-left: 13px;
          width: 130px;
          .recently-name {
            font-size: 12px;
            color: $new-inverse-color;
          }
          .recently-desc {
            color: $font-auxiliary-color;
            width: 131px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          &.no {
            vertical-align: top;
            margin-top: 10px;
          }
        }
        .recently-message-close {
          vertical-align: top;
          margin-top: 13px;
          margin-left: -11px;
          display: none;
          &.parents {
            margin-left: 58px;
          }
        }
        .recently-item-info-num {
          border-radius: 40px;
          width: 15px;
          height: 15px;
          background-color: #f09932;
          position: absolute;
          color: $def-white-color;
          font-size: 10px;
          line-height: 12px;
          text-align: center;
          right: 10px;
          margin-top: -42px;
          .recently-newMessage-num-text {
            transform: scale(0.8);
            line-height: 14px;
            font-size: 10px;
            margin-left: 1px;
          }
          &.lg {
            width: 26px;
          }
        }
        &.active {
          background-color: #afbbc6;
          .recently-name {
            color: $def-white-color;
          }
          &:hover {
            background-color: #afbbc6;
          }
        }
        &:hover {
          background-color: #e9e9e9;
          .recently-message-close {
            display: inline-block;
          }
        }
      }
    }
  }

  .contact-search-result-container {
    height: 463px;
    border-bottom: 1px solid #d7d7d7;
    background-color: $new-main-body-color;
    overflow: auto;
    .search-container-noResult {
      padding: 48px 71px;
      font-size: 14px;
      color: #999999;
    }
    .search-container-hasResult {
      .person-item {
        cursor: pointer;
        padding: 8px 0 8px 26px;
        height: 38px;
        position: relative;
        .contact-name {
          margin-left: 17px;
          font-size: 12px;
          color: $new-inverse-color;
          vertical-align: top;
          line-height: 38px;
        }
        .contact-status {
          border: 1px solid #ffffff;
          width: 9px;
          height: 9px;
          background-color: #62c655;
          position: absolute;
          margin-top: 30px;
          margin-left: -15px;
        }
        &.active {
          background-color: #afbbc6;
          .contact-name {
            color: $def-white-color;
          }
        }
        &:hover {
          background-color: #e9e9e9;
        }
      }
    }
  }

  .avatarGray {
    filter: grayscale(100%);
  }
</style>

