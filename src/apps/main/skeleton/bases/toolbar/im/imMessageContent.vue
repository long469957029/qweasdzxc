<template>
  <div>
    <div class="chat-more-content" key="more-content" :class="{moreChatSideDown:moreChatSideDown}">
      <div class="chat-more-content-text" v-if="showMoreChat" @click="addMoreChat"
      >载入更多信息
      </div>
    </div>
    <div class="im-message-content-panel" id="chatContainer">
      <template v-for="(dateList,date) in chatList">
        <div class="chat-day-time" :class="{lessRecord:dateList.date===fastDate}"
             :key="date">
          {{date}}
        </div>
        <div class="chat-item" v-for="item in dateList" :key="item.rid">
          <div class="sfa chat-item-avatar inline-block"
               :class="{'sfa-avata-admin':item.userName==='admin','sfa-avata-persons':item.userName==='群发消息'}">
            <img :src="item.headIcon" v-if="item.userName!=='admin'&&item.userName!=='群发消息'">
          </div>
          <div class="inline-block chat-item-detail">
            <div class="chat-item-name" v-if="item.userName==='admin'">系统管理员</div>
            <div class="chat-item-name" v-else>{{item.userName}}</div>
            <div class="chat-item-message" v-html="item.content"></div>
          </div>
          <div class="inline-block chat-item-time pull-right">{{_(item.sendTime).formatAMPM()}}</div>
        </div>
      </template>
    </div>
    <div class="show-NesMsg-Tips " :class="{sideUp:newMsgUp,sideDown:newMsgDown}" @click="contentDown">
      <span class="show-NesMsg-Tips-text"><span class="tips-text">{{newMsgNum}}</span>条新记录</span>
      <div class="show-NesMsg-Tips-down inline-block"></div>
    </div>
  </div>
</template>
<script>
  import avatarConfig from 'userCenter/misc/avatarConfig'
  import {getImChatListApi, getMessGroupMessageApi} from 'api/message'
  const ExConf = require('./expressionConf')
  export default{
    name: 'imMessageContent',

    data () {
      return {
        chatList: [],
        chatListSize: 0,
        showMoreChat: false,
        pageIndex: 0,
        showData: [],
        firstIn: true,
        unReadMes: [],
        scroll: 0,
        oldScrollHeight: 0,
        newMsgUp: false,
        newMsgDown: false,
        newMsgNum: 0,
        fastDate: '',
        moreChatSideDown: false,
      }
    },
    props: {},
    components: {},
    mounted () {
      this.getCartInfo()
      document.addEventListener('scroll', this.scrollEvent, true)
    },
    watch: {
      getChatList: {
        handler(){
          this.formatChatData(this.getChatList)
        },
        immediate: true,
      },
      getContactUserInfo: {
        handler() {
          this.getCartInfo()
          this.showData = []
          this.pollingChat()
          this.firstIn = true
        },
        immediate: true,
      },
      chatList(){ // 滚动条的判断要在加载完数据以后，所以监听最后变化的数据
        this.$nextTick(function () {
          this.scrollOperation()
        })
      },
      scroll(){
        const div = document.getElementById('chatContainer')
        if (this.scroll < 5) {
          div.scrollTop = 5
        }
        if (this.scroll > (div.scrollHeight - (this.newMsgNum * 130) - 500) && this.newMsgUp) {
          this.newMsgUp = false
          this.newMsgNum = 0
        }
        if (this.scroll < 800 && this.showMoreChat) {
          this.moreChatSideDown = true
        }
        if (this.scroll > 800 && this.showMoreChat && this.moreChatSideDown) {
          this.moreChatSideDown = false
        }
      },
      getMessagePanelStatus(){
        if (this.getMessagePanelStatus !== 2) {
          clearInterval(this.cartPolling)
          if (this.getMessagePanelStatus !== 1) {
            this.chatList = []
          }
        }
      }
    },
    beforeDestroy () {
      clearInterval(this.cartPolling)
    },
    computed: {
      ...mapGetters([
        'getChatList',
        'getContactUserInfo',
        'getChatListLength',
        'getMessagePanelStatus',
        'is_send_status',
        'username',
      ])
    },

    filters: {},

    methods: {
      scrollEvent(){
        this.scroll = document.getElementById('chatContainer').scrollTop
      },
      addMoreChat(){
        let recordLastIndex = this.getChatList.length - 1
        if (recordLastIndex < 0) {
          recordLastIndex = 0
        }
        let commit = []
        const chatLastRecordId = Math.min.apply(Math, this.showData.map(function (o) { // // 当前记录中最晚的记录,rid值最小
          return o.rid
        }))
        if (this.getMessagePanelStatus === 1) {
          commit = {
            lastChatId: chatLastRecordId,
            pageSize: 20
          }
        } else if (this.getMessagePanelStatus === 2) {
          commit = {
            userId: this.getContactUserInfo.userId,
            pageSize: 30,
            lastChatId: chatLastRecordId,
          }
        } else if (this.getMessagePanelStatus === 4) {
          commit = {
            groupId: this.getContactUserInfo.groupId,
            pageSize: 15,
            lastChatId: chatLastRecordId,
          }
        }
        getImChatListApi(commit,
          ({data}) => {
            if (data.result === 0) {
              this.moreChatSideDown = false
              this.formatChatData(data.root.records, data.root.rowCount)
            } else {
              Global.ui.notification.show('获取更多聊天信息失败！')
            }
          })
        this.pageIndex += 1
      },
      getCartInfo(){
        if (this.getMessagePanelStatus !== 3 && this.getMessagePanelStatus !== 4) {
          this.$store.dispatch(types.GET_IM_CONTACT_CHAT, {
            userId: this.getContactUserInfo.userId,
            pageSize: 30
          })
        } else if (this.getMessagePanelStatus === 4) {
          this.$store.dispatch(types.GET_IM_MESS_CHAT, {
            groupId: this.getContactUserInfo.groupId,
            pageSize: 15
          })
        }
      },
      formatChatData(data, rowCount){
        this.chatListSize = this.getChatListLength
        if (rowCount) {
          this.chatListSize = rowCount
        }
        const moreChatIndex = (this.pageIndex * 30) + data.length
        if (moreChatIndex <= this.getChatListLength && data.length === 30) { // 判断显示更多按钮的状态
          this.showMoreChat = true
        } else {
          this.showMoreChat = false
        }

        const pollingData = _.cloneDeep(data) // vue不能对store数据直接操作，需要深度拷贝后处理数据

        this.formatUnReadMes(pollingData) // 判断是否显示未读消息

        let cartData = []
        if (this.showData.length === 0) {  // 初始化一份当前显示聊天内容的未排序数据，如果该数据为空即为刚进入聊天框，未开始轮询
          this.showData = pollingData
          cartData = pollingData
        } else {   // 如果已经有数据，比配轮询数据与当前数据
          cartData = this.equalPollingData(pollingData) //合并去重
        }

        cartData = _.chain(cartData).sortBy((item) => {
          return item.rid
        })
        // 判断是否为最早的记录
        const fasterRecord = Math.min.apply(Math, cartData.map(function (o) { // // 当前记录中早的一条
          return o.rid
        }))
        this.fastDate = _(fasterRecord.sendTime).toDate()

        this.updateContentExpression(cartData)  //处理轮询数据中的表情包
      },
      // 对比轮询的数据
      equalPollingData(pollingData){
        // 思路：返回数据中包含rid作为标识，遍历2个数组，将轮询数组中rid>当前显示数组的记录放入未读信息中
        // 返回结果：最终显示的数组

        let allData = pollingData.concat(this.showData)
        const hash = {};
        allData = allData.reduce((item, next) => { // 去重
          hash[next.rid] ? '' : hash[next.rid] = true && item.push(next);
          return item
        }, [])
        this.showData = _.chain(allData).sortBy((item) => {
          return item.rid
        })
        return allData
      },
      // 处理轮询数据中的表情包
      updateContentExpression(data){
        _(data).each((item) => {
          item.headIcon = avatarConfig.get(_(item.headIconId).toString()).logo
          const reg = /\[(.+?)\]/g
          const resultAttr = item.content.match(reg) // 取出字符串中所有包含中括号的字段
          if (resultAttr !== null) { // 如果存在，处理字符串
            let message = item.content
            _(resultAttr).each((item, index) => { //遍历表情配置文件，替换字符串中的表情包
              const exTitle = resultAttr[index].replace(/\[|]/g, '')// 取出标题对象
              const exInfo = ExConf.get(exTitle)// 取出标题字符串
              const exStyle = '<span class="chat-exp-text"><img src="' + exInfo.url + '"></span>'
              if (exInfo.title && exInfo.title.length > 0) {
                const titleReg = new RegExp('\\[(' + exInfo.title + ')\\]', "g")
                message = message.replace(titleReg, exStyle)
              }
            })
            item.content = message
          }
        })
        this.sortCartData(data)
      },
      sortCartData(data){
        // 数据排序
        this.chatList = _.chain(data).sortBy((dateItem) => { // 按照日期排序并显示
          return dateItem.sendTime
        }).groupBy((item) => {
          return _(item.sendTime).toDate()
        }).value()
      },
      formatUnReadMes(pollingData){
        // 查询是否包含未读消息
        const unReadMsg = []
//        const initNewData = this.showData[0].rid
        const initNewData = Math.max.apply(Math, this.showData.map(function (o) { // 当前记录中rid最大的记录
          return o.rid
        }))
        _(pollingData).each((item) => {
          if (parseInt(item.rid) > parseInt(initNewData)) {
            unReadMsg.push(item)
          }
        })
        const num = parseInt(this.newMsgNum)
        if (unReadMsg.length > 0 && num > 0) {
          this.newMsgNum = num + unReadMsg.length
        }
        this.unReadMes = []
        this.unReadMes = unReadMsg
      },
      // 滚动条操作
      scrollOperation(){
        // 判断如果是第一次登录将滚动条移动至最下方
        const div = document.getElementById('chatContainer')
        if (this.firstIn) {
          div.scrollTop = div.scrollHeight
          this.oldScrollHeight = 0
          this.firstIn = false
        }
        else {
          if (this.unReadMes.length > 0) {
            let myMsg = false
            _(this.unReadMes).each((item) => {
              if (item.userName === this.username) {
                myMsg = true
                return false
              }
            })
            if (myMsg) { // 如果未读消息中有发送人的信息，滚动条到底部，如果全是目标的信息，不变化
              div.scrollTop = div.scrollHeight
            } else {
              if ((div.scrollHeight - this.scroll) <= 1000) {// 如果滚动条上滚少于1屏的范围,自动滚到最底部
                div.scrollTop = div.scrollHeight
              } else { //如果滚动条大于1屏的范围，弹出提示框
                if (this.newMsgDown) {
                  this.newMsgDown = false
                }
                if (!this.newMsgUp) {
                  this.newMsgUp = true
                  this.newMsgNum = this.unReadMes.length
                }
              }
            }
          }
        }
      },
      contentDown(){
        const div = document.getElementById('chatContainer')
        div.scrollTop = div.scrollHeight
        this.newMsgUp = false
        this.newMsgNum = 0
      },
      pollingChat(){
        if (this.getMessagePanelStatus === 2 && this.getContactUserInfo !== 'admin') {
          clearInterval(this.cartPolling)
          this.cartPolling = setInterval(() => {
            this.$store.dispatch(types.GET_IM_CONTACT_CHAT, {
              userId: this.getContactUserInfo.userId,
              pageSize: 30
            })
          }, 3000)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .chat-more-content {
    cursor: pointer;
    text-align: center;
    padding: 5px 0;
    height: 20px;
    color: $new-main-deep-color;
    position: absolute;
    margin-left: 254px;
    top: -30px;
    opacity: 0;
    &.moreChatSideDown {
      animation: sideUp .5s;
      z-index: 10;
      top: 0;
      opacity: 1;
    }
  }

  .im-message-content-panel {
    position: absolute;
    max-height: 100%;
    width: 100%;
    text-align: left;
    overflow: auto;
    bottom: 0;
    .chat-day-time {
      text-align: center;
      border: 1px solid $def-gray-color;
      border-radius: 20px;
      color: $def-gray-color;
      width: 109px;
      height: 19px;
      padding: 5px;
      margin-left: 230px;
      margin-bottom: 26px;
      &.lessRecord {
        margin-top: 35px;
      }
    }
    .chat-item {
      margin-left: 26px;
      margin-bottom: 28px;
      .chat-item-avatar {
        margin-top: 7px;
        vertical-align: top;
        width: 38px;
        height: 38px;
      }
      .chat-item-time {
        margin-right: 20px;
      }
      .chat-item-detail {
        margin-left: 15px;
        width: 400px;
        .chat-item-name {
          margin-bottom: 5px;
          color: $new-main-deep-color;
        }
        .chat-item-message {
          word-wrap: break-word;
          max-width: 376px;
          min-width: 116px;
          padding: 16px 13px;
          color: $new-inverse-color;
          display: inline-block;
          background-color: $new-main-body-color;
          border-top-left-radius: 25px;
          border-top-right-radius: 10px;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;

        }
      }
    }

  }

  .show-NesMsg-Tips {
    position: absolute;
    border-radius: 20px;
    text-align: center;
    background: #14b1bb;
    color: white;
    padding: 6px;
    height: 19px;
    margin: 0 0 5px 237px;
    width: 106px;
    font-size: 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .5);
    cursor: pointer;
    bottom: -20px;
    opacity: 0;
    z-index: -1;
    &.sideUp {
      z-index: 0;
      bottom: 0;
      opacity: 1;
      animation: sideUp .5s;
    }
    .show-NesMsg-Tips-text {
      display: inline-block;
      margin-left: 13px;
      float: left;
      line-height: 18px;
      text-align: right;
      font-size: 12px;
      width: 70px;
      .tips-text {
        margin-right: 4px;
      }
    }
    .show-NesMsg-Tips-down {
      background-image: url('./misc/im-content-down.png');
      width: 11px;
      height: 11px;
      margin-top: 4px;
    }
  }

  @keyframes sideUp {
    0% {
      bottom: -20px;
      opacity: 0;
      z-index: -1;
    }
    100% {
      z-index: 0;
      bottom: 0;
      opacity: 1;
    }
  }

  @keyframes moreChatSideDown {
    0% {
      top: -30px;
      opacity: 0;
      z-index: -1;
    }
    100% {
      z-index: 0;
      top: 0;
      opacity: 1;
    }
  }
</style>
<style lang="scss">
  .chat-exp-text {
    display: inline-block;
    vertical-align: top;
    width: 20px;
    height: 20px;
    margin: 0 1px;
    @for $i from 1 through 74 {
      &.face-#{$i} {
        background-image: url(~base/images/face/face-#{$i}.gif);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
    }
  }
</style>

