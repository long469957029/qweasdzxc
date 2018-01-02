<template>
  <div class="modal-dialog modal-confirm">
    <a class="close btn-close" data-dismiss="modal">×</a>
    <div class="modal-header">
      <span class="confirm-icon"></span>
      确认投注
    </div>
    <div class="modal-body">
      <div class="overview clearfix">
        <div class="pull-left m-right-md">
          {{ticketInfo.info.zhName}}
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
          <li class="bc-betDetail-text" v-for="item in bettingList">{{item.levelName}}{{item.playName}} | {{item.formatBettingNumber}} | {{item.statistics}}注 | {{item.fPrefabMoney}}元</li>
        </ul>
        <ul class="" v-else>
          <li class="bc-betDetail-text" v-for="item in bettingList">{{item.playName}} | {{item.formatBettingNumber}}</li>
        </ul>
      </div>
      <div class="total">
        总计 <span class="text-pleasant">{{bettingChoice.totalInfo.totalLottery}}</span> 注，
        总共 <span class="text-pleasant">{{bettingChoice.totalInfo.fTotalMoney}}</span> 元
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center control-confirm">
        <button type="button" class="btn btn-orange btn-lg font-sm" data-loading-text="保存中" @click="bettingConfirm">确认投注</button>
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
            $(this.$refs.confirmCountdown).countdown(this.bettingInfo.leftTime + _.now(), function(event) {
              $(this).html(event.strftime('%H:%M:%S'));
            });
          }
        }
      },
    },

    methods: {
      bettingConfirm() {
        this.$emit('bettingConfirm')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  //modal-confirm
  .modal-confirm {
    width: 540px;
    height: 460px;
    background-color: #ffffff;
    .modal-header {
      height: 40px;
      background-color: #f0f0f0;
      padding: 20px 0 0 20px;
      font-size: 16px;
      border-bottom: 1px solid #d7d7d7;
    }
    .confirm-icon {
      background: url(../misc/exclamation.png);
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
      overflow: auto;
      background-color: #f5f5f5;
      .bc-betDetail-text {
        text-indent: -10px;
        word-wrap: break-word;
        white-space: pre;
        padding-left: 20px;
        padding-top: 5px;
        padding-bottom: 10px;
        &:before {
          content: '•';
          color: $def-gray-color;
          font-size: 16px;
          padding-right: 5px;
          position: relative;
          top: 0;
        }
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
