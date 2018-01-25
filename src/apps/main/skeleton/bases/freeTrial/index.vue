<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="freeTrailModal">
    <div class="modal-dialog modal-freeTrail">
      <a class="close btn-close" data-dismiss="modal">×</a>
      <div class="freeTrail-header">
        <div class="freeTrail-header-img inline-block"></div>
        <div class="freeTrail-header-text inline-block">试玩账号创建成功！</div>
      </div>
      <div class="freeTrail-account">
        系统已为您分配试玩账户<span class="account-name">TP3469</span>及<span class="account-amount">1000元</span>试玩体验金，
      </div>
      <div class="freeTrail-desc">
        您可以开始体验我们的游戏啦～
      </div>
      <div class="freeTrail-tips-container">
        <div class="freeTrail-tips-header">
          试玩须知：
        </div>
        <div class="freeTrail-tips-content">
          <span class="freeTrail-tips-img"></span>
          <span>通过注册试玩账户您可以体验我们网站的速度、效率、游戏，并与其它网站对比</span>
        </div>
        <div class="freeTrail-tips-content">
          <span class="freeTrail-tips-img"></span>
          <span>您可以任意注册多个试玩账户，每个试玩账户均会得到1000元的试玩体验金</span>
        </div>
        <div class="freeTrail-tips-content">
          <span class="freeTrail-tips-img"></span>
          <span>通过试玩账户可以熟悉游戏规则及功能菜单，但“充值，提款”等其他部分功能将被禁止</span>
        </div>
        <div class="freeTrail-tips-content">
          <span class="freeTrail-tips-img"></span>
          <span>试玩账户不定期进行清理，若账户被删除，请再重新注册</span>
        </div>
      </div>
      <div class="freeTrail-button" @click="closeDialog">
        我已了解
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'free-trial',

    data () {
      return {}
    },

    props: {},

    components: {},

    watch: {
      freeTrialStatus(freeTrialStatus) {
        if (freeTrialStatus) {
          this.openFreeTrial()
        }
      },
    },

    computed: {
      ...mapGetters([
        'freeTrialStatus',
      ]),
    },

    filters: {},

    methods: {
      openFreeTrial(){
        this.$nextTick(() => {
          $(this.$refs.freeTrailModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.$store.commit(types.TOGGLE_FREE_TRIAL, false)
            })
        })
      },
      closeDialog(){
        $(this.$refs.freeTrailModal).modal('hide')
      },
    }
  }
</script>

<style lang="scss" scoped>
  .modal-freeTrail {
    border: 0;
    width: 500px;
    min-height: 384px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    border-radius: 7px;
    box-shadow: 0 3px 8px 0 #999999;
    z-index: 1050;
    padding: 13px 20px;
    .freeTrail-header {
      text-align: center;
      margin: 14px auto 7px;
      .freeTrail-header-img {
        width: 50px;
        float: left;
        height: 50px;
        background-image: url('./misc/ft-success.png');
      }
      .freeTrail-header-text {
        font-size: 16px;
        color: #333333;
        margin-left: 12px;
        text-align: center;
        margin-top: 15px;
      }
    }
    .freeTrail-account {
      text-align: center;
      font-size: 14px;
      margin: 10px auto;
      color: #666666;
      .account-name {
        color: #14b1bb;
        margin: 0 3px;
      }
      .account-amount {
        color: #f09932;
        margin: 0 3px;
      }
    }
    .freeTrail-desc {
      font-size: 14px;
      color: #666666;
      text-align: center;
    }
    .freeTrail-tips-container {
      margin: 20px 0;
      background-color: #ffffff;
      padding: 10px;
      line-height: 28px;
      .freeTrail-tips-header {
        font-size: 14px;
        color: #333333;
      }
      .freeTrail-tips-content {
        color: #999999;
        font-size: 12px;
      }
      .freeTrail-tips-img {
        width: 5px;
        height: 5px;
        border-radius: 40px;
        background-color: #cccccc;
        display: inline-block;
        float: left;
        margin-top: 12px;
        margin-right: 6px;
      }
    }
    .freeTrail-button {
      margin: 0 auto;
      padding: 15px 60px;
      background-color: #14b1bb;
      color: #ffffff;
      font-size: 14px;
      border-radius: 5px;
      cursor: pointer;
    }

  }
</style>

