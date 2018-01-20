<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="resetPwdModal">
    <div class="dialog-main">
      <div class="reset-dialog clearfix">
        <div class="reset-header">
          找回密码
          <a class="close btn-close" data-dismiss="modal">×</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'reset-pwd',
    data(){
      return{

      }
    },
    watch: {
      resetPassWordDialogStatus(resetPassWordDialogStatus) {
        if (resetPassWordDialogStatus) {
          this.openResetPwdDialog()
        }
      },
    },
    computed: {
      resetPassWordDialogStatus(){
        return this.$store.getters.resetPassWordDialogStatus
      },
    },
    methods:{
      openResetPwdDialog(){
        this.$nextTick(() => {
          $(this.$refs.resetPwdModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.$store.commit(types.TOGGLE_RESET_PASSWORD_DIALOG, false)
            })
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "~base/styles/variable";
  .dialog-main{
    display: flex;
    justify-content: center;
  }
  .reset-dialog{
    width: 800px;
    border-radius: 5px;
    .reset-header{
      width: 800px;
      height: 60px;
      font-size: 18px;
      background-color: $sec-line-color;
      line-height: 60px;
      text-align: center;
      position: relative;
      color: $def-black-color;
    }
  }
</style>
