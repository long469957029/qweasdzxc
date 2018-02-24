<template>
  <div class="points-mall">
    <div class="points-top-main-wrapper">
      <div class="points-top-main">
        <div class="points-top-inner">
          <points-top></points-top>
          <points-nav></points-nav>
        </div>
      </div>
    </div>
    <div class="points-bottom">
      <div class="points-bottom-inner clearfix">
        <transition mode="out-in"
          enter-active-class="animated-quick fadeIn"
          leave-active-class="animated-quick fadeOut">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import PointsTop from './points-top'
  import PointsNav from './points-nav'

  export default {
    name: "points-mall",

    components: {
      PointsTop,
      PointsNav,
    },

    mounted() {
      this.$store.dispatch(types.GET_USER_MALL_INFO)
    }
  }
</script>

<style lang="scss" scoped>
  $total-width: 1200px;

  .points-mall {
    /*background: url(./misc/background.jpg);*/
    color: $def-black-color;
    .points-top-main-wrapper {
      background: url(./misc/bg-top.png) no-repeat;
    }
    .points-top-main {
      background: url(./misc/bg-top-texture.png);
    }
    .points-top-inner {
      width: $total-width;
      margin: 0 auto;
    }
    .points-bottom-inner {
      width: $total-width;
      margin: 0 auto;
    }
    .points-bottom {
      background: url(./misc/bg-bottom.jpg) repeat-x;
      background-size: cover;
      min-height: 500px;
    }
  }

</style>
