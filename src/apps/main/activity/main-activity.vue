<template>
  <div class="main-activity">
    <router-view></router-view>
  </div>
</template>
<script>
  import rechargeSales from './rechargeSalesActivity/index'
  import welFareSharingPlan from './welfareSharingPlan/index'
  export default{
    name: 'main-activity',

    data () {
      return {}
    },

    props: {},

    components: {
      rechargeSales,
      welFareSharingPlan,
    },

    mounted () {
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .main-activity{
    position: relative;
    z-index: 1;
  }
</style>

