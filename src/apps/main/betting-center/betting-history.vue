<template>
  <div class="betting-history" v-if="!ticketInfo.twoSide">
    <div class="his-main">
      <div class="his-top">
        <span class="sfa sfa-mmc-double-ball vertical-middle"></span>
        <span class="font-sm text-default vertical-middle">{{title}}</span>
      </div>
      <div class="his-draw" ref="history">
        <div ref="historyInner">
          <static-grid :wrapper-class="gridOps.wrapperClass" :col-model="gridOps.colModel" :height="height" empty-tip=""
                       table-class="table"
                       :url="gridOps.url" :reqData="gridOps.data" :init-remote="false" :data-prop="gridOps.dataProp"
                       :emptyTip="gridOps.emptyTip"
                       ref="historyGrid">

            <tr slot="ex-row" key="ex-row">
              <td colspan="3">
                <div class="text-center p-TB-smd border-top">
                  <router-link class="btn btn-link more-analysis"
                               :to="{name: 'analysis', params: {ticketId: ticketInfo.id}}"
                               target="_blank">
                    更多历史开奖
                  </router-link>
                </div>
              </td>
            </tr>
          </static-grid>
        </div>
      </div>
    </div>
  </div>
  <div class="betting-history handicap" v-else>
    <div class="his-main" :class="{reverse: currentPanel !== 'twoSide'}">
      <!--开奖号码-->
      <div class="his-top cursor-pointer" @click="togglePanel()">
        <span class="his-icon">
        <span class="sfa sfa-mmc-double-ball double-ball-sm vertical-middle"></span>
        </span> <span class="font-sm text-default vertical-middle">{{title}}</span>
        <span class="arrow cursor-pointer sfa sfa-mmc-down-arrow" v-if="currentPanel === 'twoSide'"
        ></span>
      </div>
      <!--两面长龙-->
      <div class="his-top cursor-pointer" @click="togglePanel()">
        <span class="his-icon">
        <span class="sfa sfa-mmc-two-side vertical-middle"></span>
        </span>
        <span class="font-sm text-default vertical-middle">两面长龙排行</span>
        <span class="arrow cursor-pointer sfa sfa-mmc-down-arrow" v-if="currentPanel !== 'twoSide'"
        ></span>
      </div>
    </div>
    <div class="his-draw" ref="history" v-show="currentPanel !== 'twoSide'">
      <static-grid :wrapper-class="gridOps.wrapperClass" :col-model="gridOps.colModel" :height="height" empty-tip=""
                   table-class="table"
                   :url="gridOps.url" :reqData="gridOps.data" :init-remote="false" :data-prop="gridOps.dataProp"
                   ref="historyGrid">
        <tr slot="ex-row" key="ex-row">
          <td colspan="3">
            <div class="text-center p-TB-smd border-top">
              <router-link class="btn btn-link more-analysis"
                           :to="{name: 'analysis', params: {ticketId: ticketInfo.id}}"
                           target="_blank">
                更多历史开奖
              </router-link>
            </div>
          </td>
        </tr>
      </static-grid>
    </div>
    <!--<div class="his-main" v-if="ticketInfo.twoSide">-->
    <div class="his-draw two-side" v-show="currentPanel === 'twoSide'">
      <div class="two-side-inner" ref="twoSideInner">
        <div class="two-side-title">统计至第{{lastOpenId}}期</div>
        <transition-group class="two-side-main"
                          enter-active-class="animated-quick fadeIn"
                          leave-active-class="animated-quick fadeOut"
                          tag="div"
        >
          <div class="two-side-cell" v-for="(item, i) in twoSideList" :key="i">
            <div class="cell-left">{{item.type | twoSideType(ticketInfo.type)}}------{{item.result}}</div>
            <div class="cell-right">{{item.count}}期</div>
          </div>
        </transition-group>
      </div>
    </div>
    <!--</div>-->
  </div>
</template>

<script>
  import {getTwoSideApi} from 'api/analysis'
  import {StaticGrid, twoSideType, quick3Sum} from 'build'

  const GRID_OPS = {
    ssc: {
      pageSize: 15,
      formats: [
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
        function (val, index, item) {
          return this.getFormType(val, this.playRule.keyPosition, this.playRule.formType, item)
        },
      ],
    },
    choose15: {
      pageSize: 15,
      formats: [
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
        function (val, index, item) {
          return this.getFormType(val, this.playRule.keyPosition, this.playRule.formType, item)
        },
      ],
    },
    threeD: {
      pageSize: 15,
      formats: [
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
        function (val, index, item) {
          return this.getFormType(val, this.playRule.keyPosition, this.playRule.formType, item)
        },
      ],
    },
    pk10: {
      pageSize: 15,
      formats: [
        function (val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index]) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
            if (index === 4) {
              html.push(`<br />`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        function (val, index, item) {
          return this.getFormType(val, this.playRule.keyPosition, this.playRule.formType, item)
        },
      ],
    },
    quick3: {
      pageSize: 15,
      formats: [
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
        function (val, index, item) {
          return this.getFormType(val, this.playRule.keyPosition, this.playRule.formType, item)
        },
      ],
    },
    mark6: {
      cols: ['20%', '50%'],
      pageSize: 15,
      formats: [
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
        null
      ],
    },
  }

  const getFormDragon = (numList, keyPosition) => {
    let formType = '';

    let tempList = _(numList).filter(function (val, index) {
      return keyPosition[index];
    });
    if (tempList[0] > tempList[1]) {
      formType = '龙';
    } else if (tempList[0] < tempList[1]) {
      formType = '虎';
    } else {
      formType = '和';
    }

    return formType;
  }

  const getFormQuick = (numList, keyPosition) => {
    let formType = '';

    let tempList = _(numList).chain().filter(function (val, index) {
      return keyPosition[index];
    }).union().value('');
    switch (tempList.length) {
      case 1:
        formType = '三同号';
        break;
      case 2:
        formType = '二同号';
        break;
      case 3:
        tempList = _.sortBy(tempList)
        let isContinuous = true
        _.times(2, (index) => {
          if (Number(tempList[index]) + 1 !== Number(tempList[index + 1])) {
            isContinuous = false
          }
        })
        formType = isContinuous ? '三连号' : '三不同'
        break;
      default:
        break;
    }

    return formType;
  }

  //接口访问频率限制
  const callTimeLimit = 500

  export default {
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
      lastOpenId: {
        type: String,
      },
      height: {
        type: Number,
        default: 745,
      },
    },

    data() {
      return {
        tableClass: 'table table-center table-default',
        currentPanel: this.ticketInfo.twoSide ? 'twoSide' : 'record',
        twoSideList: [],
        timeLimit: false
      }
    },

    filters: {
      twoSideType
    },

    watch: {
      '$route': {
        handler() {
          this.$nextTick(() => {
            if (!this.ticketInfo.twoSide) {
              this.togglePanel('record')
              // this.currentPanel = 'record'
            } else {
              this.togglePanel('twoSide')
              // this.currentPanel = 'twoSide'
            }
            this.twoSideList = []
            this.$refs.historyGrid.clean()
          })

        },
        immediate: true
      },
      currentPanel: {
        handler() {
          this.update()
        },
      }
    },

    computed: {
      gridOps() {
        return this.generateGridOptions(GRID_OPS[this.ticketInfo.type])
      }
    },

    methods: {
      twoSideUpdate() {
        if (!this.timeLimit) {
          getTwoSideApi({
            ticketId: this.ticketInfo.id,
            isOfficial: this.ticketInfo.isOfficial
          }, (data) => {
            if (data && data.result === 0) {
              this.twoSideList = data.root.slice(0, 10)
            }
          })

          this.timeLimit = true
          _.delay(() => {
            this.timeLimit = false
          }, this.callTimeLimit)

        }
      },

      togglePanel(currentPanel) {
        if (currentPanel) {
          this.currentPanel = currentPanel
        } else {
          this.currentPanel = this.currentPanel === 'record' ? 'twoSide' : 'record'
        }
      },

      update() {
        if (this.currentPanel === 'twoSide') {
          this.twoSideUpdate()
        } else {
          this.$refs.historyGrid.update()
        }
      },
      generateGridOptions({pageSize = 15, dataProp = 'root.openedList', formats, cols} = {}) {
        const url = this.ticketInfo.id !== 19 ? '/ticket/ticketmod/openhistory.json' : '/ticket/bet/openHistory.json'
        const options = {
          tableClass: this.tableClass,
          url,
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
            width: '40%',
            formatter: formats && formats[0] ? (val, index, list) => {
              return formats[0].apply(this, [val, index, list])
            } : null,
          })
        } else {

          options.colModel.push({
            label: '期号',
            name: 'ticketPlanId',
            width: cols ? cols[0] : '24%',
            formatter: (ticketPlanId) => {
              if (this.ticketInfo.abbreviated) {
                return ticketPlanId.substring(4)
              } else {
                return ticketPlanId
              }
            },
          })

          options.colModel.push({
            label: '开奖号码',
            name: 'ticketOpenNum',
            width: cols ? cols[1] : '48%',
            formatter: formats && formats[0] ? (val, index, list) => {
              return formats[0].apply(this, [val, index, list])
            } : null,
          })
        }


        if (this.playRule.formType && formats[1]) {
          const fromData = this.getFormName(formats, this.playRule.keyPosition, this.playRule.formType)
          options.colModel.push({
            label: fromData.name,
            name: fromData.keyName,
            width: this.ticketInfo.id !== 19 ? '22%' : '25%',
            formatter: formats && formats[1] ? (val, index, list) => {
              return formats[1].apply(this, [val, index, list])
            } : null,
          })
        }

        return options
      },

      // 取得形态
      getFormName(nums, keyPosition, type) {
        let formType = {}
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
          case 'QUICk_SUM':
            formType = {
              name: '和值',
              keyName: '',
            }
            break;
          case 'DRAGON':
          case 'QUICK':
            formType = {
              name: '形态',
              keyName: '',
            }
            break;
          default:
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
      getFormType(nums, keyPosition, type, item) {
        let formType;
        let numList = item.ticketOpenNum.split(',');
        switch (type) {
          case 'QUICK':
            formType = getFormQuick(numList, keyPosition);
            break;
          case 'QUICk_SUM':
            formType = _.chain(quick3Sum(numList)).values().value().join(' ');
            break;
          case 'DRAGON':
            formType = getFormDragon(numList, keyPosition);
            break;
          default:
            // formType = '';
            formType = nums
            break;
        }

        if (_.indexOf(this.playRule.formHighlight, formType) > -1) {
          formType = `<span class="text-cool">${formType}</span>`
        }
        return formType;
      },
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
    }

  }
</script>

<style lang="scss" scoped>
  .his-top {
    position: relative;
    /*margin: 0 auto;*/
    padding: 15px 20px 15px 30px;
    height: 26px;
    .arrow {
      position: relative;
      float: right;
      margin-top: 8px;
      transition: transform .5s;
      &.up {
        transform: rotateX(180deg);
      }
    }
  }

  .betting-history {
    &.handicap {

      .his-top {
        padding: 10px 20px 10px 30px;
      }
    }
  }

  .his-main {
    display: flex;
    flex-direction: column;

    &.reverse {
      flex-direction: column-reverse;
    }

    th {
      position: relative;
      &:after {
        width: 1px;
        height: 15px;
        content: '';
        background-color: $def-line-color;
        display: block;
        position: absolute;
        right: 0;
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

  .his-draw {
    position: relative;
    /*overflow: hidden;*/
  }

  .text-center.his-both-top.font-sm {
    color: $def-black-color;
  }

  .his-top {
    font-size: 14px;
    color: $def-black-color;
    border-bottom: 1px solid $im-line-color;
  }

  .two-side-title {
    height: 30px;
    background-color: $sec-line-color;
    padding-left: 30px;
    line-height: 30px;
  }

  .two-side-inner {
    color: $new-inverse-color;
  }

  .two-side-main {
    box-sizing: border-box;
    margin: 0 5px;
  }

  .two-side-cell {
    height: 42px;
    line-height: 42px;
    border-bottom: 1px dashed $sec-line-color;
    padding: 0 25px;
    display: flex;
  }

  .cell-left {
    flex: 1;
  }

  .cell-right {
    color: $new-main-deep-color;
  }

  .double-ball-sm {
    transform: scale(0.8);
    margin-left: -6px;
  }

  .his-icon {
    width: 40px;
    display: inline-block;
  }
</style>

