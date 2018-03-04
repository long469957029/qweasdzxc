<template>
  <tr>
    <td>{{row.betTime | toTime}}</td>
    <td>{{row.playName}}</td>
    <td>{{row.ticketPlanId}}</td>
    <td>{{row.ticketResult}}</td>

    <td v-if="formattedBetNum.length <= 20">{{formattedBetNum}}</td>
    <td v-else v-popover.right="{name: row.ticketTradeNo}">
      <a href="javascript:void(0)" class="btn-link btn-link-reverse">{{formattedBetNum | formatOpenNum}}</a>
      <div v-transfer-dom>
        <popover :name="row.ticketTradeNo">
          <div class="detail-popover">
            <div class="title">详细号码：</div>
            <div class="content">{{formattedBetNum}}</div>
          </div>
        </popover>
      </div>
    </td>

    <td>{{row.betTotalMoney | fixedConvert2yuan}}</td>
    <td v-html="formatStatus"></td>
    <td>
      <template v-if="row.canCancel">
        <a class="btn btn-link btn-link-inverse" @click="bettingCancel(row.ticketBetId)">撤单</a>
        /
      </template>
      <a class="btn btn-link btn-link-inverse js-gl-bet-detail-dialog" :data-id="row.ticketTradeNo">查看</a>
    </td>
  </tr>
</template>

<script>
  import {bettingCancelApi} from 'api/betting'

  import {formatOpenNum, formatOptionals} from 'build'

  export default {
    name: 'betting-records-row',

    filters: {
      formatOpenNum,
    },

    props: {
      row: {
        required: true
      }
    },

    methods: {
      bettingCancel(betId) {
        const html = '<p>此操作将撤销当前投注单，是否继续？</p>'
        $(document).confirm({
          content: html,
          size: 'modal-dialog-shadow',
          title: '温馨提示',
          footer: '<div class="text-center control-confirm-special m-top-md">' +
          `<button type="button" class="btn btn-left confirm-agree btn-chase-confirm-agree" data-loading-text="保存中">确定</button>` +
          `<button type="button" class="btn btn-link btn-right confirm-reject btn-chase-confirm-reject" data-dismiss="modal">取消</button></div>`,
          agreeCallback: () => {
            bettingCancelApi({betId}, ({data}) => {
              if (data && data.result === 0) {
                window.Global.m.publish('acct:cancelBet')
                Vue.$global.bus.$emit('cancel-bet')
                this.$emit('update')
                Global.ui.notification.show('撤单成功！', {
                  type: 'success',
                  hasFooter: false,
                  displayTime: 1000,
                  closeBtn: false,
                  size: 'modal-xs',
                })
              } else {
                Global.ui.notification.show('撤单失败！' + data.msg, {
                  type: 'success',
                  hasFooter: false,
                  displayTime: 1000,
                  closeBtn: false,
                  size: 'modal-xs',
                })
              }
            })
          },
        })
      }
    },

    computed: {
      formattedBetNum() {
        let splitNum = this.row.betNum.split('|')
        if (splitNum.length > 1) {
          return `${formatOptionals(splitNum[0]).join(',')}|${splitNum[1]}`
        } else {
          return this.row.betNum
        }
      },
      formatStatus() {
        // 0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
        let status = ''
        if (this.row.ticketBetStatus === 2) {
          status = '用户撤单'
        } else if (this.row.ticketBetStatus === 3) {
          status = '系统撤单'
        } else if (this.row.hasException) {
          status = '等待开奖'
        } else if (this.row.ticketResult === null) {
          if (this.row.ticketOpenStatus > 0) {
            status = '未中奖'
          } else {
            status = '等待开奖'
          }
        } else if (this.row.prizeTotalMoney === 0) {
          status = '未中奖'
        } else {
          status = `<span class="text-pink">${_(this.row.prizeTotalMoney).convert2yuan()}</span>`
        }
        return status
      },
    }
  }
</script>

<style lang="scss" scoped>

  .detail-popover {
    max-width: 350px;
    max-height: 90px;
    overflow-y: auto;
    padding: 4px 0 4px 2px;

    .title {
      color: #14b1bb;
      float: left;
      margin-right: 5px;
    }
    .content {
      word-wrap: break-word;
    }
  }
</style>
