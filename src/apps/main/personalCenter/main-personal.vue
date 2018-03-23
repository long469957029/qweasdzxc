<template>
  <div class="personal-container clearfix">
    <div class="pull-left col-md-2">
      <personal-side-bar></personal-side-bar>
    </div>
    <div class="personal-container-main col-md-10">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import PersonalSideBar from "./sideBar/personalSideBar";
  export default{
    name: 'main-personal',

    data () {
      return {}
    },

    props: {},

    components: {
      PersonalSideBar,
    },

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {},

    computed: {
    },

    filters: {},

    methods: {}
  }
</script>

<style scoped lang="scss">
  .personal-container {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    background: #f8f8f8;
    -webkit-box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
    box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
    .personal-container-main {
      background: #fff;
      border-left: 1px solid #e6e6e6;
      width: 998px;
      min-height: 750px;
      padding-bottom: 100px;
    }
  }
</style>

