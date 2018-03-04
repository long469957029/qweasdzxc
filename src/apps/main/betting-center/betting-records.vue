<template>
  <div class="">
    <div class="bc-records-tabs-list">
      <div class="font-md bc-records-tab" :class="{active: type === 'betting'}" @click="toggleTab('betting')">我的投注</div>
      <div class="font-md bc-records-tab" :class="{active: type === 'chase'}" @click="toggleTab('chase')">我的追号</div>
    </div>
    <div class="bc-records-tables">
      <slot-static-grid v-show="type === 'betting'" :table-class="tableClass" :col-model="bettingOps.colModel" :min-height="minHeight"
                   :url="bettingOps.url" :reqData="bettingOps.data" :abort="false" :data-prop="bettingOps.dataProp" :scroll="false"
                   :emptyTip="bettingOps.emptyTip" v-model="bettingList"
                   ref="bettingGrid">
        <betting-records-row slot="row" slot-scope="{row, index}" :key="index" :row="row" @update="update"></betting-records-row>
        <tr class="more-records" slot="ex-row" v-if="isShowMoreBetting">
          <td colspan="8">
            <router-link to="/fc/td" class="btn btn-link text-auxiliary">更多记录>></router-link>
          </td>
        </tr>
        <div class="empty-tip-container" slot="empty-tip">
          <span class="empty-tip"></span>
          暂无记录
        </div>
      </slot-static-grid>
      <static-grid v-show="type === 'chase'" :table-class="tableClass" :col-model="chaseOps.colModel" :min-height="minHeight"
                   :url="chaseOps.url" :reqData="chaseOps.data" :abort="false" :data-prop="chaseOps.dataProp"
                   :emptyTip="chaseOps.emptyTip" :scroll="false" v-model="chaseList"
                   ref="chaseGrid">
        <tr class="more-records" slot="ex-row" v-if="isShowMoreChase" key="ex-row">
          <td colspan="9">
            <router-link to="/fc/cr" class="btn btn-link text-auxiliary">更多记录>></router-link>
          </td>
        </tr>
        <div class="empty-tip-container" slot="empty-tip">
          <span class="empty-tip"></span>
          暂无记录
        </div>
      </static-grid>
    </div>
  </div>
</template>

<script>
  import BettingRecordsRow from './betting-records-row'

  export default {
    name: 'betting-records',

    props: {
      ticketId: {
        type: Number,
        required: true
      }
    },

    components: {
      BettingRecordsRow
    },

    data() {
      return {
        minHeight: 102,
        type: 'betting',
        tableClass: 'table table-similar table-center no-margin',

        bettingList: [],
        chaseList: [],
        bettingOps: {
          colModel: [
            {
              label: '投注时间',
              width: '12%',
            },
            {
              label: '玩法',
              width: '10%',
            },
            {
              label: '期号',
              width: '10%',
            },
            {
              label: '开奖号码 ',
              width: '14%',
            },
            {
              label: '投注内容 ',
              width: '12%',
            },
            {
              label: '投注金额',
              width: '10%',
            },
            {
              label: '状态',
              width: '10%',
            },
            {
              label: '操作 ',
              width: '10%',
            },
          ],
          emptyTip: '最近无投注记录',
          url: '/ticket/bethistory/userbethistory.json',
          data: {
            pageSize: 5,
            ticketId: this.ticketId,
          },
          dataProp: 'root.betList',
        },
        chaseOps: {
          colModel: [
            {
              label: '追号时间',
              name: 'chaseTime',
              width: '12%',
              formatter(val) {
                return _(val).toTime()
              },
            },
            {
              label: '彩种',
              name: 'ticketName',
              width: '10%',
              formatter(val) {
                return val
              },
            },
            {
              label: '玩法',
              name: 'playName',
              width: '10%',
            },
            {
              label: '开始奖期',
              name: 'ticketPlanId',
              width: '12%',
            },
            {
              label: '追号进度',
              name: 'chaseAllPeriods',
              width: '12%',
              formatter(val, index, bet) {
                return `${bet.chaseBetCount}/${bet.chaseAllPeriods}`
              },
            },
            {
              label: '追号总金额',
              name: 'chaseAllMoney',
              width: '12%',
              formatter(val, index, bet) {
                return `${_(bet.chaseBetMoney).convert2yuan()}/${_(bet.chaseAllMoney).convert2yuan()}`
              },
            },
            {
              label: '中奖金额',
              name: 'chasePrizeMoney',
              width: '12%',
              formatter(val) {
                return val === 0 ? '0' : _(val).fixedConvert2yuan()
              },
            },
            {
              label: '追号状态',
              name: 'chaseStatus',
              width: '10%',
              formatter(val) {
                let html = ''
                if (val === 0) {
                  html = '未开始'
                } else if (val === 1) {
                  html = '进行中'
                } else if (val === 2) {
                  html = '已完成'
                } else {
                  html = '已终止'
                }
                return html
              },
            },
            {
              label: '操作',
              name: 'ticketChaseId',
              width: '10%',
              formatter(val, index, bet) {
                return `<a class="btn-link btn-link-inverse js-gl-chase-detail-dialog"  data-id="${bet.ticketChaseId}" >查看</a>`
              },
            },
          ],
          emptyTip: '最近无追号记录',
          url: 'ticket/bethistory/userchasehistory.json',
          data: {
            pageSize: 5,
            ticketId: this.ticketId,
          },
          dataProp: 'root.chaseList',
        }
      }
    },
    watch: {
      ticketId() {
        this.bettingOps.data.ticketId = this.ticketId
        this.chaseOps.data.ticketId = this.ticketId
      }
    },

    computed: {
      isShowMoreBetting() {
        return this.bettingList.length > 0 && this.type === 'betting'
      },
      isShowMoreChase() {
        return this.chaseList.length > 0 && this.type !== 'betting'
      }
    },
    methods: {
      /**
       * 更新当前tab
       */
      update() {
        if (this.type === 'betting') {
          this.$refs.bettingGrid.update()
        } else {
          this.$refs.chaseGrid.update()
        }
      },

      toggleTab(type) {
        this.type = type
        this.update()
      },
    },
    mounted() {
      Vue.$global.bus.$on('cancel-bet', () => {
        this.update()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .bc-records-tabs-list {
    width: 100%;
    height: 36px;
    background-color: $sec-line-color;
    .bc-records-tab {
      display: inline-block;
      width: 140px;
      height: 36px;
      font-size: $font-md;
      color: $def-black-color;
      line-height: 36px;
      position: relative;
      text-align: center;
      cursor: pointer;

      &.active {
        background-color: $def-white-color;
        &:before {
          content: '';
          width: 100%;
          height: 3px;
          position: absolute;
          background-color: $main-deep-color;
          top: 0;
          left: 0;
        }
      }
    }
  }

  .more-records {
    text-align: center;
    font-size: 14px;
    margin: 8px 0;
    border-bottom: 0 !important;
  }

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

  .empty-tip-container {
    .empty-tip {
      background: url(./misc/record-empty.png);
      width: 22px;
      height: 22px;
      display: inline-block;
      vertical-align: middle;
      margin: 40px 0;
      top: -2px;
      position: relative;
    }
  }

</style>
