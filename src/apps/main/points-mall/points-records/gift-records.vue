<template>
  <div class="ticket-records">
    <search-grid :search-api="getMyGiftRecordsApi" :search-form="searchForm" data-prop="root.records"
                 :colgroup="[160, 290, 130, 330, 130, 160]" ref="searchGrid" :page-size="10"
    >
      <form class="m-TB-lg" slot="search-panel" ref="searchForm">
        <control-group>
          <control-cell title="时间"><div ref="timeset"></div></control-cell>
          <control-cell title="券编号">
            <input type="text" name="itemName" class="control-input">
          </control-cell>
          <button type="submit" class="btn control-btn" @click.prevent="$refs.searchGrid.search()">查询</button>
        </control-group>
      </form>
      <tr slot="thead">
        <th>兑换时间</th>
        <th>礼物</th>
        <th>参考价格</th>
        <th>收货信息</th>
        <th>消耗积分值</th>
        <th>状态</th>
      </tr>
      <tr slot="tbody" slot-scope="{row, index}" :key="index">
        <td>{{row.exchangeDate | toTime}}</td>
        <td>
          <div class="text-left"><img :src="row.picUrl" class="gift-img">
            <span class="inline-block">{{row.itemName}}</span>
          </div>
        </td>
        <td>
          <template v-if="row.refPrice">
            {{row.refPrice | convert2yuan}}
          </template>
        </td>
        <td class="text-left">
          <div>收货人：{{row.exName ? row.exName : '暂无'}}</div>
          <div>联系电话：{{row.exPhone ? row.exPhone : '暂无'}}</div>
          <div>收货地址：{{row.exAddr ? row.exAddr : '暂无'}}</div>
        </td>
        <td>
          {{row.requireIntegral | convert2yuan}}
        </td>
        <td>
          <template v-if="row.itemStatus === 0">
            未发货
          </template>
          <template v-else>
            <div class="text-center">
              {{row.exStore}}<br>
              {{row.exTradeId}}
            </div>
          </template>
        </td>
      </tr>

      <tr slot="tfoot" slot-scope="{resData}">
        <td>所有页总计</td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{resData.dataTotal && resData.dataTotal.totalIntegral | convert2yuan}}</td>
        <td></td>
      </tr>
    </search-grid>
  </div>
</template>

<script>
  import {getMyGiftRecordsApi} from 'api/points'
  import {ControlGroup, ControlCell} from 'build'
  import Timeset from 'com/timeset'

  export default {
    name: 'gift-records',

    filters: {
    },

    components: {
      ControlGroup,
      ControlCell
    },

    data() {
      return {
        searchForm: {},
        getMyGiftRecordsApi,
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
