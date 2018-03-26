<template>
  <div>
    <red-pack-account v-if="showIndex === 1" :red-pack-type="0" :key="1" @next="showNext"></red-pack-account>
    <red-pack-account v-if="showIndex === 2" :red-pack-type="1" :key="2" @next="showNext"></red-pack-account>
    <keep-alive>
      <ticket-vouchers v-if="showIndex === 3" :key="3" @next="showNext"></ticket-vouchers>
    </keep-alive>
    <div v-transfer-dom>
      <x-dialog v-model="novicePackageModal">
        <div class="x-modal-novicePackage" v-if="novicePackageModal" slot="all">
          <novice-package></novice-package>
          <!--<novice-package v-if="showIndex === 4" :key="4" :need-call-back="showIndex === 4 ? true : false"-->
        </div>
      </x-dialog>
    </div>
    <!--@next="showNext"></novice-package>-->
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
        showIndex: 1,  //弹窗顺序
        localStorage: new Base.Storage({
          name: 'appstorage',
          type: 'local',
        }),
        novicePackageModal: false,
        userId: Global.memoryCache.get('acctInfo').userId,
      }
    },
    computed: {
      ...mapGetters([
        'novicePackageStatus'
      ])
    },
    methods: {
      showNext(){
        this.showIndex += 1
      }
    },
    watch: {
      showIndex(){
        if (this.showIndex === 4) {
          const hasShow = this.localStorage.get(this.userId + 'NovicePackageActivity')
          if (!hasShow) {
            /** valid 是否首次登录,首次登录会自动弹出活动界面 */
            this.localStorage.set(this.userId + 'NovicePackageActivity', true)
            this.novicePackageModal = true
//            this.$store.commit(types.TOGGLE_NOVICE_PACKAGE, true)
          }
          this.showIndex = 5
        }
      },
      novicePackageStatus(){
        this.novicePackageModal = this.novicePackageStatus
      }
    }
  }
</script>
<style>

</style>
