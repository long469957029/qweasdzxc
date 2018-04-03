<template>
  <div class="user-main">
    <div class="header">
      <div class="main clearfix">
        <div class="text"></div>
        <div class="time">活动时间：2018年3月28日 --- 4月28日</div>
        <div class="money"></div>
      </div>
    </div>
    <div class="container"></div>
    <div class="footer"></div>
  </div>
</template>
<script>

  import {
    checkLogin
  } from 'build'

  export default {
    name: 'users-return',

    mixins: [checkLogin],

    data(){
      return{

      }
    },

    methods:{

    },

    mounted(){

    },

    beforeRouteEnter(to, from, next) {
      if (!window.store.getters.isLogin) {
        checkLogin.methods.login()
        next({
          path: '/',
          query: {redirect: to.fullPath}
        })
      } else {
        next()
      }
    },
  }

</script>
<style lang="scss" scoped>
  .user-main{
    width: 100%;
    height: 2000px;
    min-width: 1100px;
    background: linear-gradient(to bottom,#ffe5f4,#cff8fd);
  }
  .header{
    width: 100%;
    height: 1054px;
    background: url("./assets/header-bg.png") no-repeat center;
    background-position-y: -110px;
    .main{
      width: 1100px;
      height: 100%;
      margin: 0 auto;
      position: relative;
      .text{
        width: 710px;
        height: 341px;
        background: url("./assets/header-text.png") no-repeat center;
        margin-left: 50px;
        margin-top: -35px;
      }
      .time{
        font-size: $font-md;
        color: #430b14;
        margin-top: 20px;
        margin-left: 270px;
      }
      .money{
        width: 459px;
        height: 390px;
        background: url("./assets/money.png") no-repeat;
        position: absolute;
        right: -78px;
        top: 172px;
      }
    }
  }

  .footer{
    width: 100%;
    height: 747px;
    position: absolute;
    bottom: 0;
    background: url("./assets/bg-bottom.png") no-repeat center;
  }
</style>
