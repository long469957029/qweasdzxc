<template>
  <div id="js-bc-main" class="bc-main">
      <betting-quick-nav :key="'quick-nav'" :ticket-list="ticketList" :ticket-id="ticketId" :ticket-type="ticketType" :componentType="''"></betting-quick-nav>
    <ticket-info-banner :ticket-info="ticketInfo" :betting-type="ticketType"></ticket-info-banner>
    <betting-main-area-handicap :ticket-info="ticketInfo" :ticket-id="ticketId"
                                v-if="ticketType === 2"></betting-main-area-handicap>
    <betting-main-area :ticket-info="ticketInfo" :ticket-id="ticketId" v-else></betting-main-area>
  </div>
</template>

<script>
  import BettingQuickNav from './betting-quick-nav'
  import TicketInfoBanner from './ticket-info-banner'
  import BettingMainArea from './betting-main-area'
  import BettingMainAreaHandicap from './betting-main-area-handicap'

  //api
  import {getVouchersApi} from 'api/betting'

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
      ticketType: Number,
    },

    data() {
      return {
        bettingType: 1,
        ticketInfo: {},
        ticketList: ticketConfig.getCompleteAll(),
      }
    },
    watch: {
      '$route': {
        handler(to) {
          this.ticketInfo = ticketConfig.getById(this.ticketId, this.ticketType)

          // 暂时在这重置bettingChoice
          this.$store.commit(types.RESET_BETTING_CHOICE)
          this.$store.commit(types.CHECKOUT_PLAN_ID)
          // this.$store.commit(types.CHECKOUT_TICKET_INFO)
          this.$store.commit(types.CHECKOUT_TICKET_INFO)

          // 取得当前彩票信息
          this.$store.dispatch(types.GET_TICKET_INFO, {
            ticketId: this.ticketId,
            type: this.ticketType,
          })
          // 取得当前彩票规则
          this.$store.dispatch(types.GET_TICKET_RULES, {
            ticketId: this.ticketId,
            type: this.ticketType,
          })

          //取得彩票数据
          this.$store.dispatch(types.GET_VOUCHERS, {
            ticketId: this.ticketId,
          })
        },
        immediate: true
      }
    },

    beforeRouteEnter (to, from, next) {
      Velocity(document.body, 'scroll', {
        offset: 0,
        mobileHA: false
      })
      next()
    }
  }
</script>

<style lang="scss" scoped>
  .bc-main {
    width: 1200px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: $def-white-color;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    border-top: 2px solid rgba(0,0,0,0.15);
  }
</style>
