<template>
  <div class="im-mess-contact-select" @click.stop="">
    <div class="chat-person-panel chat-select-panel inline-block">
      <div class="chat-person-panel-title" v-if="getMessagePanelStatus===3">
        <span class="panel-title-text">+</span>
        <span class="panel-title-text">添加联系人</span>
        <label class="panel-title-checkbox-panel" v-if="allMessContactSelect"
               @click="selectAllMessContact('selected')"></label>
        <label class="panel-title-checkbox inline-block" v-if="allMessContactSelected"
               @click="selectAllMessContact('select')">
        </label>
        <span>全选</span>
      </div>
      <div class="chat-person-panel-title" v-if="getMessagePanelStatus===4" :class="{edit:getMessagePanelStatus===4}">
        <span class="panel-title-text">联系人</span>
        <span class="panel-title-text">{{getMessContact.length}}</span>
        <span class="panel-title-text">个</span>
        <span class="close btn-close panel-title-close" @click.stop="closeMessContactPanel">×</span>
      </div>
      <div class="search-panel" v-if="getMessagePanelStatus===3">
        <span class="sfa sfa-icon-search-lg search-panel-img"></span>
        <input class="search-panel-input" placeholder="搜索" v-model="messContactSearch">
      </div>
      <div class="select-container" :class="{edit:getMessagePanelStatus===4}">
        <div class="select-sub-container">
          <div class="select-sub-items">
            <div class="select-sub-item" v-for="(item,index) in contactList"
                 @click="selectMessContact(item)">
                  <span class="sfa sfa-avatar-online avatar-gray person-item-avatar" :class="{avatarGray:!item.online}">
                    <img :src="item.headIcon"></span>
              <span class="text-circle contact-status" v-if="item.online"></span>
              <span class="contact-name">{{item.userName}}</span>
              <label class="sub-item-checkbox-panel"
                     v-if="_.isEmpty(_(selectedList).find({userId:item.userId})) &&getMessagePanelStatus!=4"></label>
              <label class="sub-item-checkbox inline-block"
                     v-if="!_.isEmpty(_(selectedList).find({userId:item.userId})) &&getMessagePanelStatus!=4">
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="select-container-footer" v-if="getMessagePanelStatus!=4">
      <div class="mess-contact-add inline-block" @click.stop="addMessContact">添加</div>
      <div class="mess-contact-cancel inline-block" @click.stop="closeMessContactPanel">取消</div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'imMessContactSelect',

    data () {
      return {
        messContactSearch: '',
        allMessContactSelected: false,
        allMessContactSelect: true,
        contactSelect: false,
        contactList: [],
        selectedList: [],
      }
    },

    props: {},

    components: {},

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {
      messContactSearch: function (val) {
        if (val.length > 0) {
          this.$store.commit(types.GET_MESS_CONTACT, val)
        } else {
          this.$store.commit(types.GET_MESS_CONTACT, '')
        }
      },
      getMessContact() {
        this.contactList = this.getMessContact
      },
    },

    computed: {
      ...mapGetters([
        'getMessContact',
        'getMessagePanelStatus',
      ])
    },

    filters: {},

    methods: {
      selectAllMessContact(val){
        if (val === 'selected') {
          this.allMessContactSelected = true
          this.allMessContactSelect = false
          this.selectedList = []
          this.contactList = _(this.contactList).each((item) => {
            this.selectedList.push(item)
          })
        } else if (val === 'select') {
          this.allMessContactSelected = false
          this.allMessContactSelect = true
          this.selectedList = []
        }
      },
      selectMessContact(data){
        const selectedData = _.cloneDeep(this.selectedList)
        if (_.isEmpty(_(selectedData).find({userId: data.userId}))) {
          this.selectedList.push(data)
        } else {
          this.selectedList = _(selectedData).without(_(selectedData).find({userId: data.userId}))
        }
      },
      addMessContact(){
        this.$store.commit(types.TOGGLE_MESS_CONTACT_PANEL, false)
        this.$store.commit(types.ADD_MESS_CONTACT, this.selectedList)
      },
      closeMessContactPanel(){
        this.$store.commit(types.TOGGLE_MESS_CONTACT_PANEL, false)
      }
    },
  }
</script>

<style scoped lang="scss">
  .im-mess-contact-select {
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
</style>

