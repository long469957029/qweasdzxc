<template>
  <div class="ticket-records">
    <search-grid :search-api="getRechargeDetailApi" :search-form="searchForm" data-prop="root.dataList"
                 :colgroup="[160, 290, 130, 330, 130, 160]" ref="searchGrid" :page-size="10"
    >
      <form class="m-TB-lg" slot="search-panel" ref="searchForm">
        <control-group>
          <control-cell title="时间"><div ref="timeset"></div></control-cell>
          <control-cell title="类型">
            <select name="rechargeType"  class="select control-select">
              <option value="">全部</option>
              <option value="1">话费充值</option>
              <option value="2">流量充值</option>
              <option value="3">QQ充值</option>
            </select>
          </control-cell>
          <button type="submit" class="btn control-btn" @click.prevent="$refs.searchGrid.search()">查询</button>
        </control-group>
      </form>
      <tr slot="thead">
        <th>兑换时间</th>
        <th>类型</th>
        <th>手机号码/QQ号</th>
        <th>充值详情</th>
        <th>消耗积分值</th>
        <th>状态</th>
      </tr>
      <tr slot="tbody" slot-scope="{row, index}" :key="index">
        <td>{{row.rechargeTime | toTime}}</td>
        <td>
          {{row.rechargeType === 1 ? '话费充值' : (row.rechargeType === 1 ? '流量充值' : 'QQ充值')}}
        </td>
        <td>
            {{row.num}}
        </td>
        <td>
          {{getConfigName(row.rechargeType,row.type,row.amount)}}
        </td>
        <td>
          {{row.integral | convert2yuan}}
        </td>
        <td>
          <template v-if="row.status === 0">
            未充值
          </template>
          <template v-else>
            已充值
          </template>
        </td>
      </tr>

      <tr slot="tfoot" slot-scope="{resData}">
        <td>所有页总计</td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{resData.usedIntegral | convert2yuan}}</td>
        <td></td>
      </tr>
    </search-grid>
  </div>
</template>

<script>
  import {getRechargeDetailApi} from 'api/points'
  import {ControlGroup, ControlCell} from 'build'
  import Timeset from 'com/timeset'
  import {
    getCfgName
  } from '../points-charge-panel/config'
  export default {
    name: 'charge-records',
    data() {
      return {
        searchForm: {},
        getRechargeDetailApi,
      }
    },
    components: {
      ControlGroup,
      ControlCell
    },
    methods:{
      getConfigName(rechargeType,type,amount){
        if(rechargeType === 1){
          return getCfgName(rechargeType,1,amount)
        }else{
          return getCfgName(rechargeType,1,amount) +'/'+ getCfgName(rechargeType,2,type)
        }
      },
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
  .points-charge-panel {
    height: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 100px;
    background: #ffffff;
  }
  .text-wait {
    margin: 10px 12px 10px 0;
    font-size: 16px;
    color: #666666;
  }
  .text-brief {
    font-size: 14px;
    color: #cccccc;
  }

</style>
