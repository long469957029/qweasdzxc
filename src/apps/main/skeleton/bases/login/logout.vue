<template>
</template>
<script>
  import loginApi from 'api/login'
  export default{
    name: 'logout',

    data () {
      return {}
    },

    props: {},

    components: {},

    watch: {
      logoutDialogStatus(logoutDialogStatus){
        if (logoutDialogStatus) {
          this.logout()
        }
      }
    },

    computed: {
      logoutDialogStatus(){
        return this.$store.getters.logoutDialogStatus
      },
    },

    filters: {},

    methods: {
      logout() {
        Global.ui.loader.show()
        $(document).confirm({
          content: '<div class="m-TB-lg">确定要退出登录？</div>',
          type: 'exit',
          agreeCallback: () => {
              this.$store.dispatch(types.DO_LOGOUT)
            //Global.ui.loader.hide()
          },
        })
      },
    },
//    mounted(){
//      this.logout()
//    }
  }
</script>

<style scoped></style>

