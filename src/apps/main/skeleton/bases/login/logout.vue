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

    filters: {},

    methods: {

    },
    mounted(){
      this.$nextTick(() => {
        $(document).confirm({
          content: '<div class="m-TB-lg">确定要退出登录？</div>',
          type: 'exit',
          closeBtn: false,
          agreeCallback: () => {
            this.$store.dispatch(types.DO_LOGOUT)
            //Global.ui.loader.hide()
          },
          rejectCallback:() =>{
            this.$store.commit(types.TOGGLE_LOGOUT_DIALOG,false)
          }
        })
      })
    }
  }
</script>

<style scoped></style>

