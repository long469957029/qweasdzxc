<template>
  <div class="betting-history">
    <div class="his-main">
      <div class="his-top p-bottom-md p-top-md p-left-md">
        <span class="sfa sfa-double-ball vertical-middle"></span>
        <span class="font-md text-default vertical-middle">{{title}}</span>
      </div>
      <static-grid class="his-draw" :wrapper-class="gridOps.wrapperClass" :col-model="gridOps.colModel" :height="height"
                   :url="gridOps.url" :reqData="gridOps.data" :init-remote="false" :data-prop="gridOps.dataProp"
                   :emptyTip="gridOps.emptyTip"
                   ref="historyGrid"></static-grid>
      <div class="text-center p-top-smd p-LR-xs border-top">
        <router-link class="btn btn-link more-analysis" :to="{name: 'analysis', params: {ticketId: ticketInfo.id}}" target="_blank">
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

  const llhKeysArr = ['w', 'k', 'b', 's', 'g']

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
          function(val) {
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
          return val
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
          return val
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
      },
      height: {
        type: Number,
        default: 700,
      },
    },

    data() {
      return {
        tableClass: 'table table-center table-default',
        gridOps: {

        }
      }
    },

    watch: {
      playRule: {
        handler() {
          this.gridOps = this.generateGridOptions(GRID_OPS[this.ticketInfo.type])

          // this.$nextTick(() => {
          //   this.$refs.historyGrid.update()
          // })
        },
      },
    },

    methods: {
      update() {
        this.$refs.historyGrid.update()
      },
      generateGridOptions({pageSize = 15, dataProp = 'root.openedList', formats} = {}) {
        const options = {
          tableClass: this.tableClass,
          url: this.ticketInfo.id !== 19 ? '/ticket/ticketmod/openhistory.json' : '/ticket/bet/openHistory.json',
          // emptyTip: '最近无开奖记录',
          emptyTip: '',
          abort: false,
          height: this.height,
          colModel: [],
          data: {
            pageSize,
            ticketId: this.ticketInfo.id,
          },
          dataProp: dataProp,
        }

        if (this.ticketInfo.id === 19) {
          options.colModel.push({
            label: '开奖号码',
            name: 'ticketOpenNum',
            width: '50%',
            formatter: formats && formats[1] ? (val, index, list) => {
              return formats[1].apply(this, [val, index, list])
            } : null,
          })
        } else {

          options.colModel.push({
            label: '期号',
            name: 'ticketPlanId',
            width: '32%',
            formatter: formats && formats[0] ? (val, index, list) => {
              return formats[0].apply(this, [val, index, list])
            } : null,
          })

          options.colModel.push({
            label: '开奖号码',
            name: 'ticketOpenNum',
            width: '50%',
            formatter: formats && formats[1] ? (val, index, list) => {
              return formats[1].apply(this, [val, index, list])
            } : null,
          })
        }


        if (this.playRule && this.playRule.formType && formats && formats[2]) {
          const fromData = formats[2].apply(this, arguments)
          options.colModel.push({
            label: fromData.name,
            name: fromData.keyName,
            width: '18%',
          })
          // options.colModel.push({
          //   label: '形态',
          //   name: 'ticketOpenNum',
          //   width: '18%',
          //   formatter: ops.formats && ops.formats[2] ? (val, index, list) => {
          //     return ops.formats[2].apply(this, [val, index, list])
          //   } : null,
          // })
        }

        return options
      },


      // 取得形态
      getFormType(nums, keyPosition, type) {
        let formType
        // const numList = nums.split(',')
        switch (type) {
          case 'SUM':
            formType = this.getFormSumAndSpan(keyPosition, 1)
            break
          case 'SPAN':
            formType = this.getFormSumAndSpan(keyPosition, 2)
            break
          case 'GROUP':
            formType = this.getFormGroup(keyPosition)
            break
          case 'PAIR':
            formType = this.getFormPair(keyPosition)
            break
          case 'DRAGON':
            formType = this.getFormDragon(keyPosition)
            break
          default:
            formType = ''
            break
        }

        return formType
      },
      getFormSumAndSpan(keyPosition, type) { // type 1 代表和值 2代表跨度
        const formType = {
          name: type === 1 ? '和值' : '跨度',
          keyName: '',
        }
        const tempList = _(keyPosition).filter((val) => {
          return val
        })
        if (tempList.length === 3) {
          if (!_.isNull(keyPosition[0])) {
            formType.keyName = type === 1 ? 'sum.qianSan' : 'span.qianSan'
          } else if (_.isNull(keyPosition[0]) && !_.isNull(keyPosition[1])) {
            formType.keyName = type === 1 ? 'sum.zhongSan' : 'span.zhongSan'
          } else {
            formType.keyName = type === 1 ? 'sum.houSan' : 'span.houSan'
          }
        } else if (tempList.length === 2) {
          if (!_.isNull(keyPosition[0]) && !_.isNull(keyPosition[1])) {
            formType.keyName = type === 1 ? 'sum.qianEr' : 'span.qianEr'
          } else if (!_.isNull(keyPosition[3]) && !_.isNull(keyPosition[4])) {
            formType.keyName = type === 1 ? 'sum.houEr' : 'span.houEr'
          }
        }
        return formType
      },
      getFormGroup(keyPosition) {
        const formType = {
          name: '形态',
          keyName: '',
        }

        const tempList = _(keyPosition).filter((val) => {
          return val
        })
        if (tempList.length === 5) {
          formType.keyName = 'star5Type'
        } else if (tempList.length === 4) {
          formType.keyName = 'star4Type'
        } else if (tempList.length === 3) {
          if (!_.isNull(keyPosition[0])) {
            formType.keyName = 'qianSan'
          } else if (_.isNull(keyPosition[0]) && !_.isNull(keyPosition[1])) {
            formType.keyName = 'zhongSan'
          } else {
            formType.keyName = 'houSan'
          }
        }
        return formType
      },

      getFormDragon(keyPosition) {
        const formType = {
          name: '形态',
          keyName: '',
        }
        const v = _(keyPosition).filter((val) => {
          return val
        })
        const keys = _(v).map((item) => {
          return _(keyPosition).indexOf(item)
        })

        formType.keyName = this.getDragonValue(keys)

        // const tempList = _(numList).filter((val, index) => {
        //   return keyPosition[index]
        // })
        // if (tempList[0] > tempList[1]) {
        //   formType = '龙'
        // } else if (tempList[0] < tempList[1]) {
        //   formType = '虎'
        // } else {
        //   formType = '和'
        // }
        return formType
      },
      getDragonValue(keys) {
        return `lhh.${llhKeysArr[keys[0]]}${llhKeysArr[keys[1]]}`
      },

      // getFormType(nums, keyPosition, type) {
      //   var formType;
      //   var numList = nums.split(',');
      //   switch (type) {
      //     case 'GROUP':
      //       formType = this.getFormGroup(numList, keyPosition);
      //       break;
      //     case 'PAIR':
      //       formType = this.getFormPair(numList, keyPosition);
      //       break;
      //     case 'DRAGON':
      //       formType = this.getFormDragon(numList, keyPosition);
      //       break;
      //     default:
      //       formType = '';
      //       break;
      //   }
      //
      //   return formType;
      // },
      //
      // getFormGroup(numList, keyPosition) {
      //   var formType = '';
      //
      //   var tempList = _(numList).chain().filter(function (val, index) {
      //     return keyPosition[index];
      //   }).union().value('');
      //   switch (tempList.length) {
      //     case 1:
      //       formType = '豹子';
      //       break;
      //     case 2:
      //       formType = '组三';
      //       break;
      //     case 3:
      //       formType = '组六';
      //       break;
      //     default:
      //       break;
      //   }
      //
      //   return formType;
      // },
      //
      // getFormPair(numList, keyPosition) {
      //   var formType = '';
      //
      //   var tempList = _(numList).chain().filter(function (val, index) {
      //     return keyPosition[index];
      //   }).union().value('');
      //   switch (tempList.length) {
      //     case 1:
      //       formType = '对子';
      //       break;
      //     case 2:
      //       formType = '单号';
      //       break;
      //     default:
      //       break;
      //   }
      //
      //   return formType;
      // },
      //
      // getFormDragon(numList, keyPosition) {
      //   var formType = '';
      //
      //   var tempList = _(numList).filter(function (val, index) {
      //     return keyPosition[index];
      //   });
      //   if (tempList[0] > tempList[1]) {
      //     formType = '<div class="text-circle text-circle-xs text-circle-hot">龙</div>';
      //   } else if (tempList[0] < tempList[1]) {
      //     formType = '<div class="text-circle text-circle-xs text-circle-sky">虎</div>';
      //   } else {
      //     formType = '<div class="text-circle text-circle-xs text-circle-peaceful">和</div>';
      //   }
      //
      //   return formType;
      // }
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
  }
</style>

