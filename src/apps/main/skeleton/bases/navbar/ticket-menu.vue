<template>
  <div class=" nav-channel-container">
    <div class="nav-channel-content">
      <div class="nav-channel-banner ticketPic"></div>
      <div class="nav-channel-main">
        <div class="classic-title">时时彩</div>
        <ul class="container-list constantly">
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/19')">无限秒秒彩</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/32')">QQ30秒</a> <span
            class="navbar-ticket-icon-hot"></span></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/10')">无限分分彩</a> <span
            class="navbar-ticket-icon-hot"></span></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/13')">无限三分彩</a></li>

          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/1')">重庆时时彩</a> <span
            class="navbar-ticket-icon-hot"></span></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/3')">新疆时时彩</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/9')">黑龙江时时彩</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/8')">天津时时彩</a></li>

          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/21')">韩国乐透1.5</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/27')">东京1.5分彩</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/25')">新加坡2分彩</a></li>

          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/31')">QQ分分彩</a><i class="sfa sfa-badge-new"></i>
          </li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/37')">腾讯分分彩</a><i class="sfa sfa-badge-new"></i></li>

        </ul>
        <div class="classic-title">十一选五</div>
        <ul class="container-list eleven">
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/14')">11选5分分彩</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/5')">山东11选5</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/4')">广东11选5</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/11')">江西11选5</a></li>
          <!--<li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/40')">河南11选5</a></li>-->
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/23')">江苏11选5</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/41')">北京11选5</a></li>
        </ul>

        <div class="classic-title">3D/低频</div>
        <ul class="container-list 3d">
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/36')">QQ3D分分彩</a><i class="sfa sfa-badge-new"></i></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/6')">3D</a></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/7')">P3/P5</a></li>
        </ul>

        <div class="classic-title">快乐彩</div>
        <ul class="container-list happy">
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/18')">PK10</a> <span
            class="navbar-ticket-icon-hot"></span></li>
          <li><span class="navbar-ticket-chavon"></span> <a href="javascript:void(0);" @click="goTo('/bc/0/29')">江苏快3</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ticket-menu',

    data() {
      return {}
    },

    props: {},

    components: {},

    watch: {},

    computed: {
      loginStatus(){
        return this.$store.getters.getLoginStatus
      },
    },

    filters: {},

    methods: {
      goTo(router){
        if(this.loginStatus){
          this.$router.push(router)
        }else{
          this.showLogin()
        }
      },
      showLogin() {
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
      },
    },

    mounted() {

    }
  }
</script>

<style lang="scss" scoped>

</style>
