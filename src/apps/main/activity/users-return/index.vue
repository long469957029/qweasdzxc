<template>
  <div class="user-main" @mousemove="updateXY">
    <div class="header">
      <div class="main clearfix">
        <div class="text"></div>
        <div class="time">活动时间：2018年3月28日 --- 4月28日</div>
        <div class="money"></div>
      </div>
    </div>
    <div class="container">
      <div class="title"></div>
      <div class="content"></div>
      <div class="rule">

      </div>
      <div class="bottom-decoration"></div>
    </div>
    <div class="bottom-flower"></div>
    <div class="flower" ref="flower" :style=changeXY></div>
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
        mouseX:0,
        mouseY:0,
      }
    },
    computed:{
      changeXY: function () {
        return `transform: translate(-${this.mouseX/10}px, -${this.mouseY/10}px);`
      }
    },
    methods:{
      updateXY(event){
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
      }
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
    overflow-x: hidden;
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
        animation: tada 1s;
      }
    }
  }
  .container{
    width: 1081px;
    height: 1337px;
    background: url("./assets/main-bg.png") no-repeat;
    position: relative;
    top: -651px;
    z-index: 2;
    margin: 0 auto;
    &:before{
      content: '';
      display: block;
      width: 84px;
      height: 389px;
      background: url("./assets/main-left-top.png") no-repeat;
      position: absolute;
      top: 40%;
      left: -48px;
    }
    &:after{
      content: '';
      display: block;
      width: 118px;
      height: 520px;
      background: url("./assets/main-left-top.png") no-repeat;
      position: absolute;
      top: 15%;
      right: -50px;
      transform:scaleX(-1);
    }
    .bottom-decoration{
      width: 222px;
      height: 259px;
      background: url("./assets/main-left-bottom.png") no-repeat;
      position: absolute;
      bottom: -67px;
      left: -4px;
    }
    .content{
      width: 942px;
      height: 664px;
      background-color: #5a162d;
      border-radius: 5px;
      margin: 0 auto;
    }
  }
  .bottom-flower{
    width: 406px;
    height: 374px;
    background: url("./assets/main-flower.png") no-repeat;
    position: absolute;
    right: 294px;
    bottom: 266px;
    z-index: 0;
  }
  .flower{
    width: 1817px;
    height: 624px;
    background: url("./assets/flower-bg.png") no-repeat;
    position: absolute;
    top: 30%;
    right: 0;
  }
  .footer{
    width: 100%;
    height: 747px;
    position: absolute;
    bottom: 0;
    background: url("./assets/bg-bottom.png") no-repeat center;
  }
</style>
