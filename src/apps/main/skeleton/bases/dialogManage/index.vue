<template>
  <div>
    <red-pack-account v-if="showIndex === 1" :red-pack-type="0" :key="showIndex" @next="showNext"></red-pack-account>
    <red-pack-account v-if="showIndex === 2" :red-pack-type="1" :key="showIndex" @next="showNext"></red-pack-account>
    <keep-alive>
      <ticket-vouchers v-if="showIndex === 3" :key="showIndex" @next="showNext"></ticket-vouchers>
    </keep-alive>
    <novice-package v-if="showIndex ===4" :key="showIndex" @next="showNext"></novice-package>

  </div>
</template>
<script>
  import RedPackAccount from 'com/redpackAccountDialog'
  import NovicePackage from 'activity/novicePackageActivity'
  import TicketVouchers from 'com/redpackAccountDialog/ticket-vouchers'
  export default{
    name: 'dialog-manage',
    components: {
      RedPackAccount,  // 注册开户红包弹窗 and 老用户回归红包
      NovicePackage,  // 新手礼包弹窗
      TicketVouchers // 彩种代金券弹窗
    },
    data(){
      return {
        showIndex: 1  //弹窗顺序
      }
    },
    methods: {
      showNext(){
        this.showIndex += 1
      }
    }
  }
</script>
<style>

</style>
