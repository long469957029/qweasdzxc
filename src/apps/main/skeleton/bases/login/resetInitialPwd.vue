<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="resetInitialPwdModal">
    <div class="modal-dialog modal-resetInitialPwd">
      <a class="close btn-close" data-dismiss="modal">×</a>
      <div class="initPwd-header">
        修改初始密码
      </div>
      <div class="initPwd-body">
        <div class="reset-desc">
          此账号由上级开户生成，为保障您的账户安全，请修改初始密码！
        </div>
        <div class="reset-new-pwd-container">
          <span class="pwd-desc">新登陆密码：</span>
          <input type="password" class="pwd-input"
                 placeholder="6-20位字符组成（不含空格），区分大小写"
                 autocomplete="off" required>
        </div>
        <div class="reset-confirm-pwd-container">
          <span class="pwd-desc">确认密码：</span>
          <input type="password" class="pwd-input"
                 placeholder="请再次输入密码"
                 autocomplete="off" required>
        </div>
      </div>
      <div class="pwd-error-container">
        <span class="sfa sfa-error-icon vertical-sub pull-left"></span>
        <div class="tooltip-inner parsley-required">1231231</div>

      </div>
      <div class="initPwd-confirm">
        确定
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'resetInitPwd',

    data () {
      return {}
    },

    props: {},

    components: {},


    watch: {
      resetInitPwdStatus(resetInitPwdStatus) {
        if (resetInitPwdStatus) {
          this.openResetInitPwd()
        }
      },
    },

    computed: {
      ...mapGetters([
        'resetInitPwdStatus',
      ]),
    },

    filters: {},

    methods: {
      openResetInitPwd(){
        this.$nextTick(() => {
          $(this.$refs.resetInitialPwdModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.$store.commit(types.TOGGLE_RESET_INIT_PWD, false)
            })
        })
      },
      closeDialog(){
        $(this.$refs.resetInitialPwdModal).modal('hide')
      },
    }
  }
</script>

<style lang="scss" scoped>
  .modal-resetInitialPwd {
    border: 0;
    width: 480px;
    min-height: 310px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    border-radius: 7px;
    box-shadow: 0 3px 8px 0 #999999;
    z-index: 1050;
    .initPwd-header {
      color: #333333;
      font-size: 14px;
      text-align: center;
      padding: 15px 0;
      background: #f0f0f0;
      border-bottom: 1px solid #d7d7d7;
    }
    .initPwd-body {
      padding: 25px 37px 10px 37px;
      color: #666666;
      font-size: 14px;
      .reset-new-pwd-container {
        margin: 25px 0;
      }
      .reset-confirm-pwd-container {
        .pwd-desc {
          margin-left: 13px;
        }
      }
      .pwd-desc {
        color: #333333;
        font-size: 14px;
        width: 80px;
        text-align: right;
      }
      .pwd-input {
        width: 238px;
        height: 24px;
        font-size: 12px;
        padding: 7px 10px;
        border: 1px solid #cccccc;
        color: #666666;
        outline-width: 0;
        background-color: #f9f9f9;
        &.active, &:focus {
          border: 1px solid #14b1bb;
        }
      }
    }
    .pwd-error-container {
      padding: 0 124px;
      margin-bottom: 20px;
      .tooltip-inner {
        margin-left: 10px;
      }
    }
    .initPwd-confirm{
      margin: 20px auto;
      padding: 9px 41px;
      background: #14b1bb;
      color: #ffffff;
      font-size: 14px;
      border-radius: 4px;
    }

  }
</style>

