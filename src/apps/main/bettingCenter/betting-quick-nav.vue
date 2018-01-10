<template>
  <div class="bc-main-quick">
    <div class="pull-left quick-list">
      <router-link to="/bc/1" class="quick-list-info active">重庆时时彩<i class="sfa-badge-hot"></i></router-link>
      <router-link to="/bc/10" class="quick-list-info">重庆时时彩<i class="sfa-badge-new"></i></router-link>
      <a class="quick-list-info">无限分分彩</a>
      <a class="quick-list-info">qq30秒</a>
      <a class="quick-list-info">新加坡2分彩</a>
      <a class="quick-list-info">韩国乐透1.5分彩</a>
      <a class="quick-list-info">东京1.5分彩</a>
      <a class="quick-list-info">无限秒秒彩</a>
    </div>
    <div class="quick-more pull-right">
      <a class="sfa cursor-pointer bc-quick-more-btn" :class="[isShowMore ? 'sfa-bc-quick-close' : 'sfa-bc-quick-more']" @click="isShowMore = !isShowMore"></a>
      <div class="quick-ticket-list" :class="{'quick-ticket-list-animate' : isShowMore}">
        <div class="quick-ticket-main clearfix">
          <div v-for="ticketInfo in ticketList">
            <div class="pull-left">
              <div class="quick-ticket-type-name">{{ticketInfo.ticketName}}</div>
              <div class="ticket-ssc-list quick-ticket-ssc clearfix">
                <router-link :to="`/bc/${item.id}`" v-for="item in ticketInfo.list" class="ticket-info">
                  {{item.zhName}}
                  <i v-if="item.badge === 'hot'" class="sfa-badge-hot"></i>
                  <i v-else-if="item.badge === 'new'" class="sfa-badge-new"></i>
                </router-link>
              </div>
            </div>
            <div class="quick-ticket-line"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "betting-quick-nav",
    props: {
      ticketList: Array,
      isShowMore: {
        type: Boolean,
        default: false
      }
    },

    computed: mapState({
      fTickets: state => state.topTickets,
    }),

    methods: {
    },

    mounted() {
      this.$store.dispatch(types.GET_TOP_TICKETS)
    }
  }
</script>

<style scoped>

</style>
