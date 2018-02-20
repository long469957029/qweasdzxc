<template>
  <div class="ticket-records">
    <search-grid :search-api="getIntegralRecordsApi" :search-form="searchForm" data-prop="root.records"
                 :colgroup="[185, 140, 185, 175, 130]" ref="searchGrid" :page-size="1"
    >
      <form class="m-TB-lg" slot="search-panel" ref="searchForm">
        <control-group>
          <control-cell title="时间"><div ref="timeset"></div></control-cell>
          <button type="submit" class="btn control-btn" @click.prevent="$refs.searchGrid.search()">查询</button>
        </control-group>
      </form>
      <tr slot="thead">
        <th>时间</th>
        <th>行为</th>
        <th>积分</th>
        <th>剩余积分</th>
        <th>备注</th>
      </tr>
      <tr slot="tbody" slot-scope="{row, index}" :key="index">
        <td>{{row.date | toTime}}</td>
        <td>{{row.actionName}}</td>
        <td>
          <template v-if="row.incomeIntegral !== 0">
            {{row.incomeIntegral | convert2yuan}}
          </template>
          <template v-if="row.outcomeIntegral !== 0">
            -{{row.outcomeIntegral | convert2yuan}}
          </template>
        </td>
        <td>
          {{row.integral | convert2yuan}}
        </td>
        <td>
          {{row.remark}}
        </td>
      </tr>

      <tr slot="tfoot" slot-scope="{resData}">
        <td>所有页总计</td>
        <td></td>
        <td>{{resData.dataTotal && resData.dataTotal.totalIntegral | convert2yuan}}</td>
        <td></td>
        <td></td>
      </tr>
    </search-grid>
  </div>
</template>

<script>
  import {getIntegralRecordsApi} from 'api/points'
  import {ControlGroup, ControlCell} from 'build'
  import Timeset from 'com/timeset'

  export default {
    name: 'points-records',

    filters: {
    },

    components: {
      ControlGroup,
      ControlCell
    },

    data() {
      return {
        searchForm: {},
        getIntegralRecordsApi,
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
