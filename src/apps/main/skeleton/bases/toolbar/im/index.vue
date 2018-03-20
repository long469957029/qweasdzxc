<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="imModal">
    <div class="modal-dialog modal-im">
      <div @click="clickOutArea">
        <div class="im-panel-title">
          <a class="close btn-close" data-dismiss="modal">×</a>
          <div class="title-img inline-block">
            <span class="sfa sfa-icon-im-img"></span>
          </div>
          <div class="title-name inline-block">
            站内聊天
          </div>
          <div class="title-desc inline-block">
            聊天过程中请不要透露您的账号，身份，银行卡等个人信息
          </div>
        </div>
        <div class="js-chat-im-panel-content im-panel-content">
          <div class="inline-block content-leftBar">
            <search></search>
            <contact></contact>
            <div class="contact-footer" @click="selectMess" :class="{active:getMessContactPanelStatus===3}">
              <div class="contact-mass-message">
                <span class="sfa sfa-icon-persons-gray contact-footer-img"></span>
                <span class="contact-footer-text">群发消息</span>
              </div>
            </div>
          </div>
          <div class="inline-block js-content-rightBar content-rightBar">
            <message></message>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Search from "./imSearch";
  import Contact from "./imContact";
  import Message from "./imMessage";
  export default{
    name: 'index',

    data () {
      return {}
    },

    props: {},

    components: {
      Message,
      Contact,
      Search,
    },

    mounted(){
      this.$store.commit(types.UPDATE_CONTACT_USER_INFO, 'admin')
      this.$nextTick(() => {
        $(this.$refs.imModal).modal({
          backdrop: 'static',
        })
          .on('hidden.modal', () => {
            this.$store.commit(types.TOGGLE_IM_DIALOG, false)
            this.$store.commit(types.CLEAR_IM_PROCESS)
          })
      })
    },

    watch: {},

    computed: {
      ...mapGetters([
        'getMessContactPanelStatus',
        'getShowMessSelectPanelByClickStatus'
      ])
    },

    filters: {},

    methods: {
      selectMess(){
        this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 3)
        this.$store.commit(types.UPDATE_CONTACT_USER_INFO, 'mess')
      },
      clickOutArea(){
        if (this.getMessContactPanelStatus) {
          this.$store.commit(types.CLICK_MESS_SELECT_PANEL_OUTSIDE, 1)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .modal-im {
    width: 832px !important;
    height: 620px !important;
    background: white !important;
    .im-panel-title {
      padding: 10px 21px;
      height: 29px;
      background-color: $title-gray;
      border-bottom: 1px solid $sec-line-color;
      .title-img {
        float: left;
      }
      .title-name {
        margin-top: 5px;
        font-size: 14px;
        color: $def-black-color;
        margin-left: 6px;
      }
      .title-desc {
        margin-left: 25px;
        color: $font-auxiliary-color;
      }
    }
    .im-panel-content {
      height: 572px;
      .content-leftBar {
        float: left;
        width: 240px;
        height: 570px;
        border-right: 1px solid $im-line-color;
        .contact-footer {
          position: relative;
          background-color: $new-main-body-color;
          padding: 12px 0 12px 74px;
          cursor: pointer;
          border-top: 1px solid $def-line-color;
          .contact-mass-message {
            cursor: pointer;
            .contact-footer-text {
              margin-left: 10px;
              vertical-align: top;
              line-height: 25px;
              font-size: 14px;
            }
          }
          &:focus, &:hover,&.active {
            .contact-footer-img {
              background-position: 0;
              background-image: url("~base/images/sprites/im/icon-persons-green.png");
            }
            .contact-footer-text {
              color: $new-main-deep-color;
            }
          }
          &.player {
            background-color: #f5f5f5;
            height: 28px;
            border-top: 0;
          }
        }
      }
      .content-rightBar {
        width: 590px;
        height: 570px;
        overflow: hidden;
      }
    }

  }
</style>

