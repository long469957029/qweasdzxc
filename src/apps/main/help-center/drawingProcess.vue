<template>
  <div>
    <div class="rules-text-panel">
      <div class="res-header">
        提款流程
      </div>
      <div class="res-content">
        <div class="res-desc">
          第一步：点击个人头像进入个人中心里的资金总览界面，找到并点击提现。
        </div>
        <div class="res-desc">
          <img src="./misc/drawing-1.png" />
        </div>
        <div class="res-desc">
          第二步：在弹出的提现界面上，选择您需要提现的银行卡，输入提现的金额，以及资金密码。<br/>
          注：未绑定过银行卡的用户需要先前往银行卡管理中先绑定提现银行卡。
        </div>
        <div class="res-desc">
          <img src="./misc/drawing-2.png" />
        </div>
        <div class="res-desc">
          第三步：提现申请提交后，请耐心等待系统处理，您可以在个人中心的充提记录中查看提现进度情况。
        </div>
        <div class="res-desc">
          <img src="./misc/drawing-3.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'drawingProcess',

    data () {
      return {}
    },

    props: {},

    components: {},

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .rules-text-panel{
    .res-header {
      padding: 14px 20px;
      color: $def-black-color;
      font-weight: 600;
      border-bottom: 1px solid $im-line-color;
      font-size: 14px;
    }
    .res-content{
      color: $def-black-color;
      padding: 10px 20px;
      font-size: 12px;
      .res-desc{
        padding: 10px 0;
        .res-desc-tit {
          font-size: 14px;
          color: $main-deep-color;
        }
        .res-desc-second-tit {
          font-size: 14px;
        }
      }
    }
  }
</style>

