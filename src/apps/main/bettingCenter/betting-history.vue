<template>
  <div class="betting-history">
    <div class="his-main">
      <div class="his-top p-bottom-md p-top-md p-left-md">
        <span class="sfa sfa-double-ball vertical-middle"></span>
        <span class="font-md text-default vertical-middle">{{title}}</span>
      </div>
      <static-grid class="his-draw" :wrapper-class="gridOps.wrapperClass" :col-model="gridOps.colModel" :height="700"
                   :url="gridOps.url" :reqData="gridOps.data" :init-remote="false" :data-prop="gridOps.dataProp"
                   :emptyTip="gridOps.emptyTip"
                   ref="historyGrid"></static-grid>
      <div class="text-center p-top-smd p-LR-xs border-top">
        <router-link class="btn btn-link more-analysis" :to="{name: 'analysis', params: {ticketId: ticketInfo.ticketId}}" target="_blank">
          更多历史开奖
        </router-link>
      </div>
    </div>
    <div class="his-main js-his-both hidden">
      <div class="his-top">
        <div class="text-center his-both-top font-sm">
          两面长龙排行
        </div>
      </div>
      <div class="his-draw js-his-both-list"></div>
    </div>
  </div>
</template>

<script>
  import {getTwoSideApi} from 'api/analysis'
  import {StaticGrid} from 'build'

  const GRID_OPS = {
    ssc: {
      pageSize: 15,
        formats: [
        function (val) {
          return val
        },
        function (val) {
          const html = ['<div class="open-nums clearfix m-center">']
          const numList = val.split(',')
          const keyPositionRelly = _(this.playRule.keyPosition).filter((item) => {
            return item
          })
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index] && keyPositionRelly.length !== 5) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        function (val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType)
        },
      ],
    },
    choose15: {
      pageSize: 15,
        formats: [
        null,
        function (val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          _(numList).each((num, index) => {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index]) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        null,
      ],
    },
    p5p3: {
      pageSize: 15,
        formats: [
        function (val) {
          return val.substring(4)
        },
        function (val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          const keyPosition = _(this.playRule.keyPosition).filter((item) => {
            return item
          })
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index] && keyPosition.length < 3) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        function (val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType)
        },
      ],
    },
    threeD: {
      pageSize: 15,
      formats: [
        function (val) {
          return val.substring(4)
        },
        function (val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          const keyPosition = _(this.playRule.keyPosition).filter((item) => {
            return item
          })
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index] && keyPosition.length < 3) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        function (val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType)
        },
      ],
    },
    pk10: {
      pageSize: 15,
        formats: [
        null,
        function (val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index]) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        function (val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType)
        },
      ],
    },
  }

  // TODO
  // QUICK3,
  //   MARK6,

  export default {
    components: {StaticGrid},
    name: "betting-history",

    props: {
      title: {
        type: String,
        default: '最近15期开奖号码',
      },
      ticketInfo: {
        type: Object,
        required: true
      },
      playRule: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        tableClass: 'table table-center table-default',
        gridOps: {

        }
      }
    },

    watch: {
      ticketInfo: {
        handler() {
          this.gridOps = this.generateGridOptions(GRID_OPS[this.ticketInfo.type])

          this.$nextTick(() => {
            this.$refs.historyGrid.update()
          })
        },
        immediate: true
      },
    },

    methods: {
      update() {
        this.$refs.historyGrid.update()
      },
      generateGridOptions(ops) {
        const options = {
          tableClass: this.tableClass,
          url: this.ticketInfo.id !== 19 ? '/ticket/ticketmod/openhistory.json' : '/ticket/bet/openHistory.json',
          // emptyTip: '最近无开奖记录',
          emptyTip: '',
          abort: false,
          height: this.height,
          colModel: [],
          data: {
            pageSize: ops.pageSize,
            ticketId: this.ticketInfo.id,
          },
          dataProp: ops.dataProp ? ops.dataProp : 'root.openedList',
        }

        if (this.ticketInfo.id === 19) {
          options.colModel.push({
            label: '开奖号码',
            name: 'ticketOpenNum',
            width: '50%',
            formatter: ops.formats && ops.formats[1] ? function () {
              return ops.formats[1].apply(self, arguments)
            } : null,
          })
        } else {

          options.colModel.push({
            label: '期号',
            name: 'ticketPlanId',
            width: '32%',
            formatter: ops.formats && ops.formats[0] ? function () {
              return ops.formats[0].apply(self, arguments)
            } : null,
          })

          options.colModel.push({
            label: '开奖号码',
            name: 'ticketOpenNum',
            width: '50%',
            formatter: ops.formats && ops.formats[1] ? function () {
              return ops.formats[1].apply(self, arguments)
            } : null,
          })
        }


        if (this.playRule && this.playRule.formType && ops.formats && ops.formats[2]) {
          const fromData = ops.formats[2].apply(this, arguments)
          options.colModel.push({
            label: fromData.name,
            name: fromData.keyName,
            width: '18%',
            // formatter: ops.formats && ops.formats[2] ? function () {
            //   return ops.formats[2].apply(self, arguments)
            // } : null,
          })
        }

        return options
      },
    }

  }
</script>

<style lang="scss" scoped>
  .his-main {
    th {
      position: relative;
      &:after {
        width: 1px;
        height: 15px;
        content: '';
        background-color: $def-line-color;
        display: block;
        position: absolute;
        right: 0px;
        top: 11px;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
    }
    td {
      padding: 12px 0;
    }
    .open-nums {
      max-width: 150px;
      span {
        width: 20px;
        height: 20px;
        border: 1px solid $third-line-color;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        float: left;
        margin-left: 4px;
        margin-bottom: 2px;
      }
      .key-num {
        border-color: $new-main-deep-color;
        color: $new-main-deep-color;
      }
    }
  }
</style>
