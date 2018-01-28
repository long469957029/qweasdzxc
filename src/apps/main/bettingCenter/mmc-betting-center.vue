<template>
  <div class="bc-main-wrapper clearfix">
    <div class="bc-main">
      <betting-quick-nav :key="'quick-nav'" :ticket-list="ticketList" :ticket-id="ticketId" :ticket-type="ticketType" :component-type="componentType"></betting-quick-nav>
      <mmc-betting-main-area :ticket-info="ticketInfo" :ticket-id="ticketId" :component-type="componentType"></mmc-betting-main-area>
    </div>
  </div>
</template>

<script>
  import BettingQuickNav from './betting-quick-nav'
  import MmcBettingMainArea from './mmc-betting-main-area'

  export default {
    name: "mmc-betting-center",

    components: {
      BettingQuickNav,
      MmcBettingMainArea
    },

    props: {
      ticketId: Number,
      ticketType: Number,
    },

    data() {
      return {
        componentType: 'mmc',
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
          this.$store.commit(types.CHECKOUT_TICKET_INFO)

          // 取得当前彩票信息
          this.$store.dispatch(types.GET_MMC_TICKET_INFO, {
            ticketId: this.ticketId,
            type: this.ticketType,
          })
          // 取得当前彩票规则
          this.$store.dispatch(types.GET_TICKET_RULES, {
            ticketId: this.ticketId,
            type: this.ticketType,
          })
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bc-main {
    max-width: 1227px;
    margin: 0 auto;
  }

  .bc-main-wrapper {
    width: 100%;
    height: 100%;
    background: url(./misc/mmc-background.jpg) no-repeat;
    background-size: cover;
  }
</style>
