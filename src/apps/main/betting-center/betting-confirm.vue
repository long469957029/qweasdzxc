<template>
  <div class="modal-confirm">
    <a class="close btn-close" data-dismiss="modal">×</a>
    <div class="modal-header">
      <span class="confirm-icon"></span>
      确认投注
    </div>
    <div class="modal-body">
      <div class="overview clearfix">
        <div class="pull-left m-right-md">
          {{ticketInfo.zhName}}
        </div>
        <div class="pull-left">
          第 <span class="confirm-plan-id">{{bettingInfo.planId}}</span> 期
        </div>
        <div class="pull-right">
          <span class="icon-countdown"></span>
          投注截止时间：
          <span class="confirm-countdown" ref="confirmCountdown"></span>
        </div>
      </div>
      <div class="betting-title">投注内容</div>
      <div class="bc-confirm-list">
        <ul class="" v-if="type === 'normal'">
          <li class="bc-betDetail-text" v-for="item in bettingList">
            <span class="confirm-title">
              <template v-if="item.levelName !== item.playName">
                <template v-if="item.levelName == '任选'">
                  {{item.groupName}}{{item.playName}}
                </template>
                <template v-else>
                  {{item.levelName}}{{item.playName}}
                </template>
              </template>
              <template v-else>
              {{item.playName}}
              </template>
              | </span>
            <span class="confirm-content"> {{item.formatBettingNumber}} | {{item.statistics}}注 | {{item.fPrefabMoney}}元</span>
          </li>
        </ul>
        <ul class="" v-else>
          <li class="bc-betDetail-text" v-for="item in bettingList">
            {{item.playName}} &nbsp;| &nbsp;{{item.formatBettingNumber}} &nbsp;| &nbsp;
            <template v-if="item.odds">
              @{{item.odds}} &nbsp;| &nbsp;
            </template>
            {{item.fPrefabMoney}}元
          </li>
        </ul>
      </div>
      <div class="total">
        总计 <span class="text-pleasant">{{bettingChoice.totalInfo.totalLottery}}</span> 注，
        总共 <span class="text-prominent">{{bettingChoice.totalInfo.fTotalMoney}}</span> 元
        <span v-if="selectedVoucher > 0">，代金券返现<span class="m-LR-xs text-prominent">{{selectedVoucher | convert2yuan}}</span>元</span>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center control-confirm">
        <button type="button" class="btn btn-orange btn-lg font-sm" data-loading-text="保存中" @click="bettingConfirm">
          确认投注
        </button>
        <button type="button" class="btn btn-link btn-right confirm-reject" data-dismiss="modal">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "betting-confirm",

    props: {
      ticketInfo: Object,
      bettingInfo: Object,
      bettingChoice: Object,
      bettingList: Array,
      type: String,
    },

    watch: {
      'bettingInfo.leftSecond': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.$nextTick(() => {
              $(this.$refs.confirmCountdown).countdown(this.bettingInfo.leftTime + _.now(), function (event) {
                $(this).html(event.strftime('%I:%M:%S'));
              })
            })
          }
        },
        immediate: true
      },
    },
    computed:{
      ...mapGetters([
        'selectedVoucher'
      ])
    },
    methods: {
      bettingConfirm() {
        this.$emit('bettingConfirm')
      }
    }
  }
</script>

<style lang="scss" scoped>


  //modal-confirm
  .modal-confirm {
    width: 540px;
    height: 460px;
    border-radius: 5px;
    background-color: #ffffff;
    .modal-header {
      height: 40px;
      background-color: #f0f0f0;
      padding: 20px 0 0 20px;
      font-size: 16px;
      border-bottom: 1px solid #d7d7d7;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    .confirm-icon {
      background: url(misc/exclamation.png);
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: bottom;
    }

    .overview {
      border-bottom: dashed 1px #e6e6e6;
      padding: 20px 0;
      font-size: 16px;
    }

    .confirm-plan-id {
      color: $new-main-deep-color;
    }

    .betting-title {
      font-size: 16px;
      padding: 15px 0;
    }

    .bc-confirm-list {
      width: 488px;
      height: 150px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #f5f5f5;
      .bc-betDetail-text {
        position: relative;
        word-wrap: break-word;
        padding: 5px 10px 10px 20px;
        display: flex;
        &:before {
          content: '•';
          color: $def-gray-color;
          font-size: 16px;
          padding-right: 5px;
          position: absolute;
          top: 5px;
          left: 4px;
        }
      }

      .confirm-title {
        white-space: nowrap;
      }
      .confirm-content {
        display: inline-block;
        padding-left: 5px;
        width: 377px;
      }
    }

    .confirm-countdown {
      color: $new-main-deep-color;
    }

    .modal-body {
      padding: 0 25px;
    }

    .total {
      text-align: center;
      padding: 20px 0 10px;
      font-size: 14px;
    }

  }
</style>
