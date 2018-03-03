<template>
</template>
<script>
  export default{
    name: 'logout-notice',

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

        Global.ui.notification.show('您的账户已登出,请重新登录！', {
          modalDialogShadow:'modal-dialog-shadow',
          event: function () {
            window.store.commit(types.TOGGLE_LOGOUT_NOTICE,false)
            window.store.commit(types.USER_LOGOUT_SUCCESS,{result:0,popupLogout: true})
          },
          closeEvent: function () {
            window.store.commit(types.TOGGLE_LOGOUT_NOTICE,false)
            window.store.commit(types.USER_LOGOUT_SUCCESS,{result:0,popupLogout: true})
          }
        });

      })
    }
  }
</script>

<style scoped></style>

