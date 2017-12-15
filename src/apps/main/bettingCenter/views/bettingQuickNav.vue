<template>
  <div class="bc-main-quick">
    <div class="pull-left quick-list">
      <a href="#bc/1" class="quick-list-info active">重庆时时彩<i class="sfa-badge-hot"></i></a>
      <a href="#bc/10" class="quick-list-info">北京pk10<i class="sfa-badge-new"></i></a>
      <a class="quick-list-info">无限分分彩</a>
      <a class="quick-list-info">qq30秒</a>
      <a class="quick-list-info">新加坡2分彩</a>
      <a class="quick-list-info">韩国乐透1.5分彩</a>
      <a class="quick-list-info">东京1.5分彩</a>
      <a class="quick-list-info">无限秒秒彩</a>
    </div>
    <div class="quick-more pull-right">
      <a class="sfa sfa-bc-quick-more cursor-pointer js-bc-quick-more bc-quick-more-btn" data-type="0" @click="showTicketList"></a>
      <div class="quick-ticket-list js-quick-ticket-list">
        <div class="quick-ticket-main clearfix">
          <div v-for="ticketInfo in ticketList">
            <div class="pull-left">
              <div class="quick-ticket-type-name">{{ticketInfo.ticketName}}</div>
              <div class="ticket-ssc-list quick-ticket-ssc clearfix">
                <a :href="'#bc/' + item.id" v-for="item in ticketInfo.list" class="ticket-info">
                  {{item.zhName}}
                  <i v-if="item.badge === 'hot'" class="sfa-badge-hot"></i>
                  <i v-else-if="item.badge === 'new'" class="sfa-badge-new"></i>
                </a>
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
      ticketList: Array
    },
    methods: {
      showTicketList(e) {
        this.$quickTicketList = $('.js-quick-ticket-list')

        const $target = $(e.currentTarget)
        const type = $target.data('type')
        if (type === 0) {
          $target.data('type', 1)
          this.$quickTicketList.addClass('quick-ticket-list-animate')
          $target.removeClass('sfa-bc-quick-more').addClass('sfa-bc-quick-close')
        } else {
          $target.data('type', 0)
          this.$quickTicketList.removeClass('quick-ticket-list-animate')
          $target.removeClass('sfa-bc-quick-close').addClass('sfa-bc-quick-more')
        }
      }
    }
  }
</script>

<style scoped>

</style>
