<template>
  <div class="trend-center">
    <div class="trend-panel">
      <span class="ticket-list-title">
        彩种：
      </span>
      <select class="ticket-list" v-model="ticketId">
        <option v-for="ticket in ticketList" :value="ticket.id">{{ticket.zhName}}</option>
      </select>
      <transition
        enter-active-class="animated-quick fadeIn"
        leave-active-class="animated-quick fadeOut"
      >
        <div class="distribution-change-panel btn-toolbar" v-if="ticketInfo.trendOps.splitTrend">
          <div class="btn-group" v-for="(split, i) in ticketInfo.trendOps.splitTrend" :key="i">
            <button class="btn btn-lg font-xs m-right-xs" :class="{'btn-white': currentSplit === split}" @click="changeShowPos(split)">{{split.title}}</button>
          </div>
        </div>
      </transition>
    </div>
    <div class="trend-main">
      <div class="trend-select">
        走势图
        <label class="m-left-sm">
          <custom-checkbox v-model="missing"></custom-checkbox>
          遗漏
        </label>
        <label class="m-left-sm">
          <custom-checkbox v-model="missingLine"></custom-checkbox>
          遗漏条
        </label>
        <label class="m-left-sm">
          <custom-checkbox v-model="line"></custom-checkbox>
          走势
        </label>
        <label class="m-left-sm">
          <custom-checkbox v-model="hot"></custom-checkbox>
          热号
        </label>

        <div class="btn-group m-left-sm">
          <span class="btn-select cursor-pointer font-sm m-right-xs" v-for="(period, index) in ticketInfo.trendOps.periods" :key="period.value"
                :class="{'btn-selected': currentSearchIndex === index}" @click="selectBy(period.name, period.value, index)">
            {{period.title}}
          </span>
        </div>
      </div>
    </div>
    <table id="trend-table" class="table table-border no-margin">
      <colgroup>
        <col width="150">
        <col width="90">
      </colgroup>
      <thead>
      <tr>
        <th rowspan="2">
          期号
        </th>
        <th rowspan="2">
          开奖号码
        </th>
        <th v-for="position in fPositions" :colspan="ticketInfo.range.length">
          {{position}}
        </th>
        <th :colspan="ticketInfo.range.length" v-if="ticketInfo.trendOps.distribution">号码分布</th>
      </tr>
      <tr>
        <template v-for="position in fPositions">
          <th class="title-num" v-for="(num, index) in ticketInfo.range" :class="{'title-num-last': ticketInfo.range.length === index + 1}">
            {{num}}
          </th>
        </template>
        <th class="title-num" v-for="(num, index) in ticketInfo.range" :class="{'title-num-last': ticketInfo.range.length === index + 1}" v-if="ticketInfo.trendOps.distribution">
          {{num}}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in fTrendsList">
        <td class="title-deep">{{item.ticketPlanId}}</td>
        <td class="title-deep">
          <template v-for="num in item.openNums">
            {{num}}
          </template>
        </td>
        <template v-for="(position, i) in fPositions">
          <template v-for="(miss, index) in item.fMissList[i]">
            <td v-if="miss.title !== 0" class="title-num" :class="{'title-num-last': ticketInfo.range.length === index + 1, 'missing-line': missingLine && miss.missingLine}">
              {{!missing ? '' : miss.title}}
            </td>
            <td v-else class="charball title-num" :class="{'title-num-last': ticketInfo.range.length === index + 1}">
              <span class="circle-num" :class="hot && item.fOpenResult[i].isHot ? 'yellow' : 'blue'">{{item.fOpenResult[i].title}}</span>
            </td>
          </template>
        </template>
        <template v-for="(miss, index) in item.fTotalMissList" v-if="ticketInfo.trendOps.distribution">
          <td v-if="miss.title !== 0" class="title-num" :class="{'title-num-last': ticketInfo.range.length === index + 1, 'missing-line': missingLine && miss.missingLine}">
            {{!missing ? '' : miss.title}}
          </td>
          <td class="title-num" v-else>
            <span class="circle-num" :class="miss.repeat ? 'purple' : 'green'">{{miss.num}}</span>
          </td>
        </template>
      </tr>
      </tbody>
      <thead class="bottom-head">
      <tr>
        <th>出现总次数</th>
        <th></th>
        <template v-for="hotNums in hotNumList">
          <template v-for="hotNum in hotNums">
            <th>{{hotNum}}</th>
          </template>
        </template>
        <template v-for="hotNum in totalNumList" v-if="ticketInfo.trendOps.distribution">
          <th>{{hotNum}}</th>
        </template>
      </tr>
      <tr>
        <th>平均遗漏值</thj>
        <th></th>
        <template v-for="missings in averageMissingList">
          <template v-for="num in missings">
            <th>{{num}}</th>
          </template>
        </template>
      </tr>
      <tr>
        <th>最大遗漏值</th>
        <th></th>
        <template v-for="missings in maxMissingList">
          <template v-for="num in missings">
            <th>{{num}}</th>
          </template>
        </template>
      </tr>
      <tr>
        <th>最大连出值</th>
        <th></th>
        <template v-for="maxContinuous in maxContinuousList">
          <template v-for="numItem in maxContinuous">
            <th>{{numItem.maxCount}}</th>
          </template>
        </template>
      </tr>
      <tr class="bottom-title">
        <th rowspan="2">
          期号
        </th>
        <th rowspan="2">
          开奖号码
        </th>
        <template v-for="position in fPositions">
          <th class="title-num" v-for="(num, index) in ticketInfo.range" :class="{'title-num-last': ticketInfo.range.length === index + 1}">
            {{num}}
          </th>
        </template>
        <th class="title-num" v-for="(num, index) in ticketInfo.range" :class="{'title-num-last': ticketInfo.range.length === index + 1}" v-if="ticketInfo.trendOps.distribution">
          {{num}}
        </th>
      </tr>
      <tr class="bottom-title">
        <th v-for="position in fPositions" :colspan="ticketInfo.range.length">
          {{position}}
        </th>
        <th :colspan="ticketInfo.range.length" v-if="ticketInfo.trendOps.distribution">号码分布</th>
      </tr>
      </thead>
    </table>
    <div class="trend-des">
      <div class="top">
        <span class="icon-tip"></span> 参数说明
      </div>
      <div class="main-des">
        <div class="main-des-item">
          <span class="main-des-title">号码分布：</span>
          <span class="main-des-content">指对开奖号码去除重复的顺序分布。例如开奖号码为22478，号码分布为2、4、7、8。</span>
        </div>

        <div class="main-des-item">
          <span class="main-des-title">出现总次数：</span>
          <span class="main-des-content">指在选定的期数范围内开出号码的总次数。</span>
        </div>

        <div class="main-des-item">
          <span class="main-des-title">平均遗漏值：</span>
          <span class="main-des-content">指在选定的期数范围内的平均遗漏值。计算公式为：当前期数÷出现次数=平均遗漏值。例如：万位号码01在近30期的出现次数为4，需计算平均遗漏值，则计算公式为30÷4= 7.5，向下取整数，那么万位号码01在近30期的平均遗漏值为7。</span>
        </div>

        <div class="main-des-item">
          <span class="main-des-title">最大遗漏值：</span>
          <span class="main-des-content">指在选定的期数范围内未开出号码的最长间隔期数，例如：万位号码01在近30期中最多有连续20期未开出，则万位01在近30期中的最大遗漏值为20。</span>
        </div>

        <div class="main-des-item">
          <span class="main-des-title">最大连出值：</span>
          <span class="main-des-content">指在选定的期数范围内连续开出号码次数最大值。例如：万位号码01在近30期中最多有连续4期开出，则万位03在近30期中的最大连出值为4。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import analysisApi from 'api/analysis'
  import Draw from './draw-line'

  export default {
    name: "main-trend",
    data() {
      return {
        ticketList: ticketConfig.getAllBy({trend: true}),
        ticketId: Number(_.getUrlParam('ticketId')),
        ticketInfo: {},
        fTrendsList: [],
        trendsList: [],
        //号码分布 各位置出现次数
        hotNumList: [[]],
        //号码分布 总出现次数
        totalNumList: [],
        //平均遗漏值
        averageMissingList: [[]],
        //最大遗漏值
        maxMissingList: [[]],
        //最大连出值
        maxContinuousList: [[]],
        missing: true,
        line: true,
        missingLine: false,
        hot: false,
        date: 0,
        pageSize: 30,
        currentSearch: 'pageSize',
        currentSearchIndex: 0,
        currentSplit: {},
        fPositions: []
      }
    },

    watch: {
      ticketId: {
        handler(ticketId) {
          this.ticketInfo = ticketConfig.getById(ticketId)
          this.currentSplit = _.first(this.ticketInfo.trendOps.splitTrend)
          if (this.currentSplit) {
            this.fPositions = _.slice(this.ticketInfo.positions, this.currentSplit.pos[0], this.currentSplit.pos[1])
          } else {
            this.fPositions = this.ticketInfo.positions
          }
          this.currentSearch = 'pageSize'
          this.currentSearchIndex = 0

          this.checkoutData()
          this.getData()
        },
        immediate: true
      },
      line() {
        Draw.DrawLine.show(this.line)
      }
    },

    methods: {
      changeShowPos(split) {
        this.currentSplit = split
        this.fPositions = _.slice(this.ticketInfo.positions, split.pos[0], split.pos[1])
        this.formatData()
      },
      checkoutData() {
        this.fTrendsList = []
        this.trendsList = []
        this.hotNumList = [[]]
        this.totalNumList = []
        this.averageMissingList = [[]]
        this.maxMissingList = [[]]
        this.maxContinuousList = [[]]

        Draw.DrawLine.remove()
      },
      selectBy(name, value, index) {
        this[name] = value
        this.currentSearch = name
        this.currentSearchIndex = index

        this.checkoutData()
        this.getData()
      },
      getData() {
        if (this.ticketInfo.trendType === 'old') {
          analysisApi.getTrendByOld({
            ticketId: this.ticketId,
            days: this.currentSearch === 'date' ? this.date : '',
            limit: this.currentSearch === 'pageSize' ? this.pageSize : ''
            // startDate,
            // endDate,
          }, ({data}) => {
            if (data && data.result === 0) {
              let missingList = _.times(this.ticketInfo.counts, () => _.fill(Array(this.ticketInfo.range.length), 0))
              this.trendsList = _.map(data.root.openedList || [], opening => {
                const openResult = opening.ticketOpenNum.split(',')
                return {
                  missList: this.$_computedMissing(missingList, openResult),
                  openResult,
                  ticketPlanId: opening.ticketPlanId
                }
              })

              this.formatData()
            }
          })
        } else {
          analysisApi.getTrend({
            trendTypeId: 1,
            ticketId: this.ticketInfo.isOfficial ? this.ticketId : this.ticketId + 10000,
            // playSeriesId: this.ticketInfo.playSeriesIdList[0].id,
            days: this.currentSearch === 'date' ? this.date : '',
            limit: this.currentSearch === 'pageSize' ? this.pageSize : ''
          }, (res) => {
            if (res && res.result === 0) {
              this.trendsList = res.root.trendsList || []
              this.formatData()
            }
          })
        }
      },

      /**
       * 计算遗漏
       */
      $_computedMissing(missingList, openList) {
        missingList.forEach((list, i) => {
          list.forEach((num, pos) => {
            if (pos === _.indexOf(this.ticketInfo.range, openList[i])) {
              missingList[i][pos] = 0
            } else {
              ++missingList[i][pos]
            }
          })
        })

        return _.cloneDeep(missingList)
      },

      formatData() {
        this.fTrendsList = []

        let totalMissList = _.map(this.ticketInfo.range, (num) => {
          return {
            title: 0,
            num,
            repeat: false,
            missingLine:false
          }
        })
        _.each(this.trendsList, (item) => {
          item.openNums = _.isString(item.openResult) ? _.times(item.openResult.length / this.ticketInfo.trendOps.split, (i) => {
            return item.openResult.slice((this.ticketInfo.trendOps.split * i), (this.ticketInfo.trendOps.split * (i + 1)))
          }) : item.openResult
          item.fOpenResult = _.map(item.openNums, num => {
            return {
              title: num,
              isHot: false
            }
          })
          let repeat = []
          _.each(item.openNums, (num) => {
            repeat[num] = (repeat[num] || 0) + 1
          })
          let openDistributed = _.chain(item.openNums).union().sortBy(num => Number(num)).value()
          totalMissList = _.map(totalMissList, (item) => {
            item.title += 1
            item.repeat = false
            return item
          })
          _.each(openDistributed, num => {
            const findedIndex = _.indexOf(this.ticketInfo.range, num)
            if (findedIndex > -1) {
              totalMissList[findedIndex].title = 0
            }
            if (repeat[num] > 1) {
              _(totalMissList).findWhere({num}).repeat = true
            }
          })
          item.totalMissList = _.cloneDeep(totalMissList)
        })

        let missLine = _.fill(Array(this.ticketInfo.range.length * this.ticketInfo.counts), true)
        let totalMissLine = _.fill(Array(this.ticketInfo.range.length), true)

        //号码分布 各位置出现次数
        this.hotNumList = _.times(this.ticketInfo.counts, () => _.fill(Array(this.ticketInfo.range.length), 0))
        //号码分布 总出现次数
        this.totalNumList = _.fill(Array(this.ticketInfo.range.length), 0)

        //最大遗漏值
        this.maxMissingList = _.times(this.ticketInfo.counts, () => _.fill(Array(this.ticketInfo.range.length), 0))
        //最大连出值
        this.maxContinuousList = _.times(this.ticketInfo.counts, () => _.times(this.ticketInfo.range.length, () => {
          return {
            count: 0,
            isContinuous: false,
            continuousList: [0],
            maxCount: 0
          }
        }))

        for(let i = this.trendsList.length - 1; i >= 0; --i) {
          _.each(this.trendsList[i].openNums, (num, pos) => {
            const innerPos = _.indexOf(this.ticketInfo.range, num)
            ++this.hotNumList[pos][innerPos]


            //最大连出数
            _.each(this.maxContinuousList[pos], (numItem, index) => {
              if (innerPos === index) {
                numItem.isContinuous = true
                ++numItem.count
              } else {
                numItem.isContinuous = false
                if (numItem.count) {
                  numItem.continuousList.push(numItem.count)
                  numItem.count = 0
                }
              }

              if (numItem.length -1 === index) {
                if (numItem.count) {
                  numItem.continuousList.push(numItem.count)
                  numItem.count = 0
                }
              }
            })

            _.each(this.maxContinuousList[pos], (numItem) => {
              numItem.maxCount = _.max(numItem.continuousList)
            })
          })

          _.each(this.trendsList[i].totalMissList, (item, index) => {
            if (item.title === 0) {
              ++this.totalNumList[index]
            }
          })

          let fMissList = _.map(this.trendsList[i].missList, (missList, index) => {
            let numIndex = 0
            return _.map(missList, (miss, missIndex) => {
              let fMiss = {
                title: miss,
                missingLine: false,
              }

              const pos = index * _.size(missList) + numIndex
              if (miss === 0) {
                missLine[pos] = false
              }

              if (missLine[pos]) {
                fMiss.missingLine = true
              }

              //最大遗漏
              if (miss > this.maxMissingList[index][numIndex]) {
                this.maxMissingList[index][numIndex] = miss
              }
              ++numIndex

              return fMiss
            })
          })


          let fTotalMissList = _.map(this.trendsList[i].totalMissList, (miss, index) => {
            if (miss.title === 0) {
              totalMissLine[index] = false
            }

            if (totalMissLine[index]) {
              miss.missingLine = true
            }

            return miss
          })

          this.fTrendsList.unshift(Object.assign(this.trendsList[i], {
            fMissList,
            fTotalMissList,
          }))
        }

        //
        const totalMaxMissingList = _.fill(Array(this.ticketInfo.range.length), 0)
        //最大连出数
        const totalMaxContinuousList = _.times(this.ticketInfo.range.length, () => {
          return {
            count: 0,
            isContinuous: false,
            continuousList: [0],
            maxCount: 0
          }
        })

        _.each(this.trendsList, item => {
          _.each(item.fOpenResult, (openNum, pos) => {
            const innerPos = _.indexOf(this.ticketInfo.range, openNum.title)
            if (this.hotNumList[pos][innerPos] === _.max(this.hotNumList[pos])) {
              openNum.isHot = true
            }
          })

          _.each(item.totalMissList, (miss, index) => {
            if (miss.title > totalMaxMissingList[index]) {
              totalMaxMissingList[index] = miss.title
            }

            const numItem = totalMaxContinuousList[index]
            if (miss.title === 0) {
              numItem.isContinuous = true
              ++numItem.count
            } else {
              numItem.isContinuous = false
              if (numItem.count) {
                numItem.continuousList.push(numItem.count)
                numItem.count = 0
              }
            }
            if (numItem.length -1 === index) {
              if (numItem.count) {
                numItem.continuousList.push(numItem.count)
                numItem.count = 0
              }
            }
          })

          _.each(totalMaxContinuousList, (numItem) => {
            numItem.maxCount = _.max(numItem.continuousList)
          })
        })

        if (this.ticketInfo.trendOps.distribution) {
          this.maxContinuousList.push(totalMaxContinuousList)
        }


        //平均遗漏值
        this.averageMissingList = _.map(this.hotNumList, hotNums => {
          return _.map(hotNums, num => {
            return num ? Math.floor(this.trendsList.length / num) : this.trendsList.length
          })
        })


        //总平均遗漏
        if (this.ticketInfo.trendOps.distribution) {
          this.averageMissingList.push(_.map(this.totalNumList, num => {
            return num ? Math.ceil(this.trendsList.length / num) : this.trendsList.length
          }))
        }

        //最大遗漏
        if (this.ticketInfo.trendOps.distribution) {
          this.maxMissingList.push(totalMaxMissingList)
        }

        if (this.currentSplit) {
          this.maxMissingList = _.slice(this.maxMissingList, this.currentSplit.pos[0], this.currentSplit.pos[1])
          this.averageMissingList = _.slice(this.averageMissingList, this.currentSplit.pos[0], this.currentSplit.pos[1])
          this.maxContinuousList = _.slice(this.maxContinuousList, this.currentSplit.pos[0], this.currentSplit.pos[1])
          this.hotNumList = _.slice(this.hotNumList, this.currentSplit.pos[0], this.currentSplit.pos[1])
          this.totalNumList = _.slice(this.totalNumList, this.currentSplit.pos[0], this.currentSplit.pos[1])

          this.fTrendsList = this.fTrendsList.map(info => {
            info.fMissList = _.slice(info.fMissList, this.currentSplit.pos[0], this.currentSplit.pos[1])
            info.fOpenResult = _.slice(info.fOpenResult, this.currentSplit.pos[0], this.currentSplit.pos[1])
            info.fTotalMissList = _.slice(info.fTotalMissList, this.currentSplit.pos[0], this.currentSplit.pos[1])
            return info
          })
        }


        this.$nextTick(() => {
          this.draw()
        })
      },

      draw() {
        const $body = $('body');
        $body.find('.trend-panel, .trend-main, .trend-des').css('width', $body.find("#trend-table").width());

        const colors = '#14b1bb';

        $body.find('canvas').remove();

        Draw.Chart.init();
        Draw.DrawLine.bind("trend-table");

        const num = this.ticketInfo.range.length

        _(this.ticketInfo.counts).times((index) => {
          Draw.DrawLine.color(colors);
          Draw.DrawLine.add((parseInt(index) * num + 2), 2, num, 0);
        })

        Draw.DrawLine.draw(Draw.Chart.ini.default_has_line);
        Draw.DrawLine.show(this.line)
      },
    },
    mounted() {
      window.onresize = () => {
        this.draw()
      }
    }
  }
</script>

<style lang="scss" scoped>


  .trend-center {
    background-color: #ffffff;
    min-width: 1366px;
  }
  .trend-panel {
    height: 80px;
    background-color: #129098;
    box-sizing: border-box;
    padding: 20px 30px;
    font-size: 16px;
  }
  .ticket-list-title {
    position: relative;
    bottom: 3px;
  }
  .ticket-list {
    border-radius: 40px;
    height: 40px;
    padding-left: 30px;
    color: #ffffff;
    border: none;
    background: #0e737a url(./select-arrow.png) no-repeat scroll 95% center;
    option {
      color: #ffffff;
    }
  }
  .trend-select {
    color: $new-inverse-color;
    height: 60px;
    line-height: 60px;
    padding-left: 30px;
    border-bottom: 1px solid $im-line-color;
    font-size: 14px;
  }
  .btn-select {
    &:hover {
      color: #14b1bb;
    }
  }
  .btn-selected {
    color: #14b1bb;
  }
  .title-num {
    border-top: 0;
    border-right: 0;
    border-left: 0;
    text-align: center;
    color: #333333;
    padding: 0;
    white-space: nowrap;
    min-width: 20px;
    transition: background-color .5s;

    &.title-num-last {
      border-right: 1px solid #e6e6e6;
    }
  }
  .circle-num {
    width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 10px;
    display: inline-block;
    color: #ffffff;

    transition: background-color .5s;
  }
  .blue {
    background-color: #14b1bb;
  }
  .yellow {
    background-color: #f09932;
  }
  .purple {
    background-color: #af4dcd;
  }
  .green {
    background-color: #60b839;
  }

  .missing-line {
    background-color: rgba(20, 177, 187, 0.1);
  }

  .table {
    max-width: inherit;
    th {
      background-color: #f7f7f7;
    }
    th, td {
      padding: 5px 0;
      white-space: nowrap;
      &.title-deep {
        color: $new-inverse-color;
      }
    }
    tr {
      td {
        border-bottom: 1px solid #ffffff;
        color: #999999;
      }
      &:nth-of-type(5n) {
        td {
          border-bottom: 1px solid #e6e6e6;
        }
      }
    }
  }

  .trend-des {
    color: $new-main-deep-color;
    font-size: 16px;
    margin: 30px;
    .top {
      margin-bottom: 10px;
    }
  }

  .main-des {
  }
  .icon-tip {
    width: 18px;
    height: 18px;
    background: url(./tip.png);
    display: inline-block;
    vertical-align: bottom;
  }
  .main-des-item {
    margin-bottom: 15px;
  }
  .main-des-title {
    font-size: 14px;
    color: $def-black-color;
  }
  .main-des-content {
    font-size: 12px;
    color: $new-inverse-color;
  }
  .bottom-head {
    tr {
      th {
        font-size: 12px;
        color: $font-auxiliary-color;
      }
      &.bottom-title {
        th {
          color: $def-black-color;
        }
      }
    }
  }
  .distribution-change-panel {
    display: inline-block;
    position: relative;
    margin-left: 30px;
    bottom: 10px;
  }

</style>
