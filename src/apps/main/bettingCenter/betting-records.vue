<template>
  <div class="">
    <div class="bc-records-tabs-list">
      <div class="font-md bc-records-tab" :class="{active: type === 'betting'}" @click="toggleTab('betting')">我的投注</div>
      <div class="font-md bc-records-tab" :class="{active: type === 'chase'}" @click="toggleTab('chase')">我的追号</div>
    </div>
    <div class="bc-records-tables">
      <static-grid v-show="type === 'betting'" :table-class="tableClass" :col-model="bettingOps.colModel" :height="height"
                   :url="bettingOps.url" :reqData="bettingOps.data" :abort="false" :data-prop="bettingOps.dataProp"
                   :emptyTip="bettingOps.emptyTip"
                   ref="bettingGrid"></static-grid>
      <static-grid v-show="type === 'chase'" :table-class="tableClass" :col-model="chaseOps.colModel" :height="height"
                   :url="chaseOps.url" :reqData="chaseOps.data" :abort="false" :data-prop="chaseOps.dataProp"
                   :emptyTip="chaseOps.emptyTip"
                   ref="chaseGrid"></static-grid>
    </div>
    <div class="text-center font-sm m-top-sm">
      <router-link to="/fc/td" class="btn btn-link text-auxiliary">更多记录>></router-link>
    </div>

    <button v-popover="{ name: 'foo' }">daf</button>
    <popover name="foo">
      Hello
    </popover>
  </div>
</template>

<script>
  import {StaticGrid} from 'build'

  export default {
    name: 'betting-records',

    components: {StaticGrid},

    props: {
      ticketId: {
        type: Number,
        required: true
      }
    },

    data() {
      return {
        height: 125,
        type: 'betting',
        tableClass: 'table table-similar table-center no-margin',

        bettingOps: {
          colModel: [
            {
              label: '投注时间',
              name: 'betTime',
              width: '12%',
              formatter(val) {
                return _(val).toTime()
              },
            },
            {
              label: '玩法',
              name: 'playName',
              width: '10%',
            },
            {
              label: '期号',
              name: 'ticketPlanId',
              width: '12%',
              // formatter(val, index, bet) {
              //   return `<a class="router btn-link btn-link-inverse" href="#bc/br/detail/${self.options.ticketId}/${bet.ticketTradeNo}">${val}</a>`
              // },
            },
            {
              label: '开奖号码 ',
              name: 'ticketResult',
              width: '12%',
            },
            {
              label: '投注内容 ',
              name: 'betNum',
              width: '12%',
              formatter(val) {
                let betNum = val
                let tryCompact = betNum.split(' ')
                if (tryCompact[0].length === 1) {
                  betNum = tryCompact.join('')
                }
                if (val.length > 20) {
                  betNum = `<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link" data-num="${val}">${
                    betNum.slice(0, 20)}...</a>`
                }
                return betNum
              },
            },
            {
              label: '投注金额',
              name: 'betTotalMoney',
              width: '10%',
              formatter(val) {
                return _(val).fixedConvert2yuan()
              },
            },
            {
              label: '状态',
              name: 'prizeTotalMoney',
              width: '10%',
              formatter(val, index, bet) {
                // 0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
                let status = ''
                if (bet.ticketBetStatus === 2) {
                  status = '用户撤单'
                } else if (bet.ticketBetStatus === 3) {
                  status = '系统撤单'
                } else if (bet.hasException) {
                  status = '等待开奖'
                } else if (bet.ticketResult === null) {
                  if (bet.ticketOpenStatus > 0) {
                    status = '未中奖'
                  } else {
                    status = '等待开奖'
                  }
                } else if (bet.prizeTotalMoney === 0) {
                  status = '未中奖'
                } else {
                  status = `<span class="text-pink">${_(bet.prizeTotalMoney).convert2yuan()}</span>`
                }
                return status
              },
            },
            {
              label: '操作 ',
              name: 'ticketTradeNo',
              width: '10%',
              formatter(ticketTradeNo, index, bet) {
                let btnlist = `<a class="btn btn-link btn-link-inverse js-gl-bet-detail-dialog" data-id="${ticketTradeNo}">查看</a>`
                if (bet.canCancel) {
                  btnlist = `<a class="btn btn-link btn-link-inverse js-bc-records-cancel" data-id="${ticketTradeNo}">撤单</a> / ${btnlist}`
                }
                return btnlist
              },
            },
          ],
          emptyTip: '最近无投注记录',
          url: '/ticket/bethistory/userbethistory.json',
          data: {
            pageSize: 10,
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
                return val === 0 ? '—' : _(val).fixedConvert2yuan()
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
            pageSize: 20,
            ticketId: this.ticketId,
          },
          dataProp: 'root.chaseList',
        }
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

      popup() {
        if (!$(e.currentTarget).data('popover')) {
          $(e.currentTarget).popover({
            title: '详细号码',
            trigger: 'click',
            html: true,
            container: 'body',
            content: `<div class="js-pf-popover">${e.currentTarget.dataset.num}</div>`,
            placement: 'right',
          }).popover('show')
        }
      }
    },
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

  .bc-records-tables {
    width: 100%;
    height: 168px;
    table {
      thead {
        border-bottom: 1px solid $def-line-color;
      }
      th {
        color: $new-inverse-color;
      }
      tr {
        border-bottom: 1px dashed $sec-line-color;
      }
    }
  }
</style>
