<template>
  <div id="js-bc-main" class="bc-main">
    <betting-quick-nav :ticket-list="ticketList" :ticket-id="ticketId"></betting-quick-nav>
    <ticket-info-banner :ticket-info="ticketInfo" :betting-type="bettingType"></ticket-info-banner>
    <betting-main-area-handicap :ticket-info="ticketInfo" :ticket-id="ticketId" v-if="bettingType === '2'"></betting-main-area-handicap>
    <betting-main-area :ticket-info="ticketInfo" :ticket-id="ticketId" v-else></betting-main-area>
  </div>
</template>

<script>
  import BettingQuickNav from './betting-quick-nav'
  import TicketInfoBanner from './ticket-info-banner'
  import BettingMainArea from './betting-main-area'
  import BettingMainAreaHandicap from './betting-main-area-handicap'

  export default {
    name: "betting-center",

    components: {
      BettingQuickNav,
      TicketInfoBanner,
      BettingMainArea,
      BettingMainAreaHandicap,
    },

    props: {
      ticketId: Number,
    },

    data() {
      return {
        bettingType: 1,
        ticketInfo: {},
        ticketList: ticketConfig.getCompleteAll(),
      }
    },
    watch: {
      '$route':{
        handler(to) {

          this.ticketId = Number(this.ticketId)
          this.bettingType = to.params.type
          this.ticketInfo = ticketConfig.getComplete(this.ticketId)

          // 暂时在这重置bettingChoice
          this.$store.commit(types.RESET_BETTING_CHOICE)
          this.$store.commit(types.CHECKOUT_TICKET_INFO)

          // 取得当前彩票信息
          this.$store.dispatch('getTicketInfo', {
            ticketId: this.ticketId,
            type: this.bettingType,
          })
          // 取得当前彩票规则
          this.$store.dispatch('getTicketRules', {
            ticketId: this.ticketId,
            type: this.bettingType,
          })
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

</style>
