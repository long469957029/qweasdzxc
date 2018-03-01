<template>
  <tr>
    <td>{{row.betTime | toTime}}</td>
    <td>{{row.playName}}</td>
    <td>{{row.ticketPlanId}}</td>
    <td>{{row.ticketResult}}</td>

    <td v-if="formattedBetNum.length <= 20">{{formattedBetNum}}</td>
    <td v-else v-popover.right="{name: row.ticketTradeNo}">
      <a href="javascript:void(0)" class="btn-link">{{formattedBetNum | formatOpenNum}}</a>
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
