<template>
  <div class="ticket-records">
    <search-grid :search-api="getTicketRecordsApi" :search-form="searchForm" data-prop="root.records"
                 :colgroup="[185, 140, 185, 175, 130, 190]" ref="searchGrid"
    >
      <form class="m-TB-lg" slot="search-panel" ref="searchForm">
        <control-group>
          <control-cell title="时间"><div ref="timeset"></div></control-cell>
          <control-cell title="类型">
            <select name="couponType" class="select control-select">
              <option value="">全部</option>
              <option value="1">充值券</option>
              <option value="2">加奖券</option>
              <option value="3">补贴券</option>
              <option value="4">反水券</option>
              <option value="5">代金券</option>
              <option value="6">现金券</option>
            </select>
            <control-cell title="券编号">
              <input type="text" name="couponToken" class="control-input">
            </control-cell>
          </control-cell>
          <button type="submit" class="btn control-btn" @click.prevent="$refs.searchGrid.search()">查询</button>
        </control-group>
      </form>
      <tr slot="thead">
        <th>兑换时间</th>
        <th>券类型</th>
        <th>说明</th>
        <th>券编号</th>
        <th>消耗积分值</th>
        <th>到期时间</th>
        <th>状态</th>
      </tr>
      <tr slot="tbody" slot-scope="{row, index}" :key="index">
        <td>{{row.exchangeDate | toTime}}</td>
        <td>{{row.couponType | formatCouponType}}</td>
        <td v-html="formatCouponDesc(row)"></td>
        <td>{{row.couponToken}}</td>
        <td>{{row.requireIntegral | convert2yuan}}</td>
        <td>{{row.validEndDate | toTime}}</td>
        <td>{{row.status === 0 ? '未使用' : row.status === 2 ? '已过期' : '已使用'}}</td>
      </tr>

      <tr slot="tfoot" slot-scope="{resData}">
        <td>所有页总计</td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{resData.dataTotal && resData.dataTotal.totalIntegral | convert2yuan}}</td>
        <td></td>
        <td></td>
      </tr>
    </search-grid>
  </div>
</template>

<script>
  import {getTicketRecordsApi} from 'api/points'
  import {formatCouponType, formatCoupon, ControlGroup, ControlCell} from 'build'
  import Timeset from 'com/timeset'

  export default {
    name: 'ticket-records',

    filters: {
      formatCouponType,
    },

    components: {
      ControlGroup,
      ControlCell
    },

    data() {
      return {
        searchForm: {},
        getTicketRecordsApi,
      }
    },

    methods: {
      formatCouponDesc(couponInfo) {
        const formatCouponInfo = formatCoupon({
          bigShowNum: couponInfo.bigShowNum,
          type: couponInfo.type,
          threholdAmount: couponInfo.threholdAmount,
          bonusPercentAmount: couponInfo.bonusPercentAmount,
          statType: couponInfo.statType,
          ticketId: couponInfo.statTicketId,
          gameType: couponInfo.gameType
        })
        let html = `${formatCouponInfo.mainDesc}`
        if (formatCouponInfo.secondDesc) {
           html += `<br/> ${formatCouponInfo.secondDesc}`
        }
        return html
      }
    },

    mounted() {
      this.searchForm = this.$refs.searchForm
      new Timeset({
        el: this.$refs.timeset,
        startTime: 'startDate',
        endTime: 'endDate',
        startDefaultDate: _(moment().startOf('day')).toDate(),
        endDefaultDate: _(moment().endOf('day')).toDate(),
        startOps: {
          format: 'YYYY-MM-DD',
        },
        endOps: {
          format: 'YYYY-MM-DD',
        },
        showIcon: true,
      }).render()
    }
  }
</script>

<style lang="scss" scoped>

</style>
