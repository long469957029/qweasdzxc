<template>
  <div class="analysis-center clearfix">
    <div class="top-panel">
      <span class="sfa sfa-tickets"></span>
      <span class="ticket-select-title">开奖记录</span>
      <select v-model="fTicketId" class="ticket-select inline-block">
        <option v-for="ticket in ticketList" :value="ticket.ticketId">{{ticket.ticketName}}</option>
      </select>

      <div class="top-right">
        <div class="btn-toolbar no-margin">

          <transition-group
            enter-active-class="animated fadeInLeftBig"
            leave-active-class="animated fadeOutRightBig absolute"
          >
            <div class="btn-group" v-for="period in analysis.periods" :key="period.value">
              <button class="btn btn-lg font-xs m-right-xs" :class="{'btn-white': pageSize !== period.value}"
                      @click="selectByPageSize(period.value)">
                {{period.title}}
              </button>
            </div>
          </transition-group>
          <div class="btn-group">
            <button class="btn btn-lg font-xs" :class="{'btn-white': date !== _.toDate(Date.now())}" @click="setToday">今天</button>
          </div>
        </div>
        <span class="date-title inline-block">
          按日期
        </span>
        <div class="date-panel timer-calendar-input timer-record-input">
          <input type="text" ref="date" v-model="date" />
          <span class="timer-calendar sfa-icon-time" @click="$($refs.date).data('DateTimePicker').show()"></span>
        </div>
      </div>
    </div>
    <div class="main">
      <table class="table table-border table-hover no-margin">
        <colgroup>
          <!--期数-->
          <col width="168">
          <!--开奖时间-->
          <col width="168">
          <!--号码-->
          <col width="300">
          <template v-if="analysis.doubleHead">
            <!--特码-->
            <col width="70">
            <col width="70">
            <col width="70">
            <col width="70">
            <col width="70">
            <col width="70">
          </template>
          <!--总和-->
          <col width="300" v-if="analysis.total">
          <!--龙虎-->
          <col width="167" v-if="analysis.longHu">
          <!--形态-->
          <col width="167" v-if="analysis.form">
        </colgroup>
        <thead>
        <tr>
          <th :rowspan="analysis.doubleHead ? 2 : 1">期数</th>
          <th :rowspan="analysis.doubleHead ? 2 : 1">开奖时间</th>
          <th v-if="analysis.numCol.num === 'balls' || analysis.numCol.num === 'square'">
            <button class="btn num-btn" :class="{'btn-white': showNumType !== 1}" @click="showNumType = 1">号码</button>
            <button class="btn num-btn m-LR-sm" :class="{'btn-white': showNumType !== 2}" @click="showNumType = 2">大小</button>
            <button class="btn num-btn" :class="{'btn-white': showNumType !== 3}" @click="showNumType = 3">单双</button>
          </th>
          <th v-else-if="analysis.doubleHead">
            {{analysis.doubleHead[0]}}
          </th>
          <th v-else="">
            号码
          </th>

          <th v-if="analysis.championAndRunnerUp" :colspan="3">冠亚和</th>

          <th v-if="analysis.specialCode" :colspan="3">特码</th>
          <th v-if="analysis.total" :colspan="analysis.doubleHead ? 3 : 1">总和</th>
          <th v-if="analysis.longHu">万个龙虎</th>
          <th v-if="analysis.form">形态<span class="sfa question"></span></th>

          <th v-if="analysis.compareLongHu" :colspan="3">
            <span class="left" @click="longHuPos = --longHuPos % analysis.compareLongHu.length < 0 ? analysis.compareLongHu.length - 1 : longHuPos"></span>
            <span v-for="(position, i) in analysis.compareLongHu" v-show="longHuPos === i">{{position.title}}</span>
            <span class="right" @click="longHuPos = Math.abs(++longHuPos % analysis.compareLongHu.length)"></span>
          </th>
        </tr>
        <tr v-if="analysis.doubleHead">
          <th>
            {{analysis.doubleHead[1]}}
          </th>
          <template v-if="analysis.championAndRunnerUp">
            <th>和数</th>
            <th>单双</th>
            <th>大小</th>
          </template>

          <template v-if="analysis.specialCode">
            <th>大小</th>
            <th>单双</th>
            <th>尾数</th>
          </template>
          <template v-if="analysis.total">
            <th>和值</th>
            <th>大小</th>
            <th>单双</th>
          </template>
          <!--pk10龙虎-->
          <template v-if="analysis.compareLongHu">
            <th>单双</th>
            <th>大小</th>
            <th>龙虎</th>
          </template>
        </tr>
        </thead>
      </table>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div ref="body" v-show="!loading">
          <table class="table table-border no-margin">
            <colgroup>
              <col width="168">
              <col width="168">
              <col width="300">
              <template v-if="analysis.doubleHead">
                <col width="70">
                <col width="70">
                <col width="70">
                <col width="70">
                <col width="70">
                <col width="70">
              </template>
              <template v-else>
                <col width="100">
                <col width="100">
                <col width="100">
                <col width="167">
              </template>
            </colgroup>
            <tbody>
            <tr v-for="opening in openedList">
              <td>{{opening.ticketPlanId}}</td>
              <td>{{opening.openDate | toTime('YYYY-MM-DD H:mm')}}</td>
              <td>
                <template v-for="(item, i) in opening.showTicketOpenNum">
                  <span v-if="analysis.numCol.num === 'balls'" :key="i" class="item blue circle m-right-xs" :class="item.style">{{item.title}}</span>
                  <dice v-else-if="analysis.numCol.num === 'dices'" :key="i" class="dice-sm m-right-xs" :class="item.style" :value="item.title"></dice>
                  <span v-else-if="analysis.numCol.num === 'square'" :key="i" class="item blue square m-right-xs" :class="item.style">{{item.title}}</span>
                </template>
                <opening-mark6-balls v-if="analysis.numCol.num === 'mark6'" class="opening-mark6-balls-sm no-shadow"
                                     :counts="ticketInfo.counts" :range="ticketInfo.range" :opening-balls="opening.fTicketOpenNum" :default-opening="ticketInfo.defaultOpening"
                ></opening-mark6-balls>
              </td>

              <template v-if="analysis.championAndRunnerUp">
                <td><span :class="opening.fChampionAndRunnerUp.total.style">{{opening.fChampionAndRunnerUp.total.title}}</span></td>
                <td><span :class="opening.fChampionAndRunnerUp.singleAndDouble.style">{{opening.fChampionAndRunnerUp.singleAndDouble.title}}</span></td>
                <td><span :class="opening.fChampionAndRunnerUp.size.style">{{opening.fChampionAndRunnerUp.size.title}}</span></td>
              </template>

              <template v-if="analysis.specialCode">
                <td><span :class="opening.fSpecialCode.size.style">{{opening.fSpecialCode.size.title}}</span></td>
                <td><span :class="opening.fSpecialCode.singleAndDouble.style">{{opening.fSpecialCode.singleAndDouble.title}}</span></td>
                <td><span :class="opening.fSpecialCode.total.style">{{opening.fSpecialCode.total.title.toString()[1]}}</span></td>
              </template>

              <template v-if="analysis.total">
                <td><span :class="opening.fTotal.total.style">{{opening.fTotal.total.title}}</span></td>
                <td><span :class="opening.fTotal.size.style">{{opening.fTotal.size.title}}</span></td>
                <td><span :class="opening.fTotal.singleAndDouble.style">{{opening.fTotal.singleAndDouble.title}}</span></td>
              </template>

              <!--龙虎-->
              <td v-if="analysis.longHu"><span :class="opening.fLongHu.style">{{opening.fLongHu.title}}</span></td>
              <!--形态-->
              <td v-if="analysis.form"><span :class="opening.fForm.style">{{opening.fForm.title}}</span></td>

              <!--pk10龙虎-->
              <template v-if="analysis.compareLongHu">
                <td><span :class="opening.fCompareLongHu.singleAndDouble.style">{{opening.fCompareLongHu.singleAndDouble.title}}</span></td>
                <td><span :class="opening.fCompareLongHu.size.style">{{opening.fCompareLongHu.size.title}}</span></td>
                <td><span :class="opening.fCompareLongHu.longHu.style">{{opening.fCompareLongHu.longHu.title}}</span></td>
              </template>
            </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import OpeningMark6Balls from 'com/opening-mark6-balls'
  import Dice from 'com/dice'
  import tickets from 'api/tickets'
  import * as analysis from './misc/analysis'

  const STYLE_CONFIG = {
    pk10: {
      '01': 'yellow',
      '02': 'deep-blue',
      '03': 'dark',
      '04': 'orange',
      '05': 'light-blue',
      '06': 'purple',
      '07': 'light-gray',
      '08': 'amber',
      '09': 'dark-brown',
      '10': 'green',
    }
  }

  export default {
    name: "analysis-center",

    components: {
      Dice,
      OpeningMark6Balls
    },

    props: {
      ticketId: Number
    },

    data() {
      return {
        date: '',
        pageSize: 100,
        ticketInfo: {},
        ticketList: [],
        openedList: [],
        showNumType: 1, //1 号码 2 大小 3 单双
        analysis: {},
        fTicketId: this.ticketId,
        longHuPos: 0, //pk10龙虎位置
        loading: true
      }
    },

    watch: {
      fTicketId: {
        handler() {
          this.ticketInfo = ticketConfig.getById(this.fTicketId)
          this.analysis = analysis[this.ticketInfo.type]
          this.styleConfig = STYLE_CONFIG[this.ticketInfo.type] || {}
          this.pageSize = this.analysis.periods[0].value
          this.date = ''
          this.loading = true

          this.resetData()
        },
        immediate: true
      },
      longHuPos() {
        this.$_formatPk10LongHu(this.longHuPos)
      },
      showNumType(type) {
        this.$_formatNumByType(type)
      }
    },

    methods: {
      selectByPageSize(pageSize) {
        this.date = ''
        this.pageSize = pageSize
        this.resetData()
      },

      setToday() {
        this.pageSize = null
        this.date = _.toDate(Date.now())
        this.resetData()
      },

      resetData() {
        this.openedList = []
        tickets.getTicketOpeningList({
            ticketId: this.fTicketId,
            pageSize: this.pageSize,
            date: this.date
          },
          ({data}) => {
            if (data && data.result === 0) {
              this.loading = false
              const openedList = data.root.openedList || []
              this.openedList = _.map(openedList, item => {
                item.fTicketOpenNum = item.ticketOpenNum.split(',')
                return item
              })
              this.formatData()
            }
          }
        )
      },
      formatData() {
        this.$_formatNumByType(this.showNumType)

        if (this.analysis.total) {
          _.each(this.openedList, item => {
            item.total = this.analysis.total(item.fTicketOpenNum)
            item.fTotal = {
              total: {
                title: item.total.total,
                style: ''
              },
              size: {
                title: item.total.size,
                style: item.total.size === '大' ? 'text-yellow' : ''
              },
              singleAndDouble: {
                title: item.total.singleAndDouble,
                style: item.total.singleAndDouble === '单' ? 'text-yellow' : ''
              },
            }
          })
        }

        if (this.analysis.championAndRunnerUp) {
          _.each(this.openedList, item => {
            item.championAndRunnerUp = this.analysis.championAndRunnerUp(item.fTicketOpenNum)
            item.fChampionAndRunnerUp = {
              total: {
                title: item.championAndRunnerUp.total,
                style: ''
              },
              size: {
                title: item.championAndRunnerUp.size,
                style: item.championAndRunnerUp.size === '大' ? 'text-yellow' : ''
              },
              singleAndDouble: {
                title: item.championAndRunnerUp.singleAndDouble,
                style: item.championAndRunnerUp.singleAndDouble === '单' ? 'text-yellow' : ''
              },
            }
          })
        }

        if (this.analysis.specialCode) {
          _.each(this.openedList, item => {
            item.specialCode = this.analysis.specialCode([_(item.fTicketOpenNum).last()])
            item.fSpecialCode = {
              total: {
                title: item.specialCode.total,
                style: ''
              },
              size: {
                title: item.specialCode.size,
                style: item.specialCode.size === '大' ? 'text-yellow' : ''
              },
              singleAndDouble: {
                title: item.specialCode.singleAndDouble,
                style: item.specialCode.singleAndDouble === '单' ? 'text-yellow' : ''
              },
            }
          })
        }

        if (this.analysis.longHu) {
          _.each(this.openedList, item => {
            item.longHu = this.analysis.longHu(item.fTicketOpenNum)
            item.fLongHu = {
                title: item.longHu,
                style: item.longHu === '龙' ? 'text-yellow' : item.longHu === '和' ? 'text-blue' : ''
            }
          })
        }
        if (this.analysis.form) {
          _.each(this.openedList, item => {
            item.form = this.analysis.form(item.fTicketOpenNum)
            item.fForm = {
              title: item.form,
              style: ''
            }
          })
        }
        if (this.analysis.compareLongHu) {
          this.longHuPos = 0
          this.$_formatPk10LongHu(this.longHuPos)
        }
      },

      $_formatPk10LongHu(pos) {
        _.each(this.openedList, item => {
          item.compareLongHu = this.analysis.compareLongHu[pos].algorithm(item.fTicketOpenNum)
          item.fCompareLongHu = {
            longHu: {
              title: item.compareLongHu.longHu,
              style: item.compareLongHu.longHu === '龙' ? 'text-yellow' : item.compareLongHu.longHu === '和' ? 'text-blue' : ''
            },
            size: {
              title: item.compareLongHu.size,
              style: item.compareLongHu.size === '大' ? 'text-yellow' : ''
            },
            singleAndDouble: {
              title: item.compareLongHu.singleAndDouble,
              style: item.compareLongHu.singleAndDouble === '单' ? 'text-yellow' : ''
            },
          }
        })
      },

      $_formatNumByType(type) {
        switch (type) {
          case 2:
            _.each(this.openedList, item => {
              item.showTicketOpenNum = _.map(item.fTicketOpenNum, num => {
                const numType = this.analysis.numCol.size(num)
                return {
                  title: numType,
                  style: numType === '大' ? 'gray' : ''
                }
              })
              return item
            })
            break;
          case 3:
            _.map(this.openedList, item => {
              item.showTicketOpenNum = _.map(item.fTicketOpenNum, num => {
                const numType = this.analysis.numCol.singleAndDouble(num)
                return {
                  title: numType,
                  style: numType === '单' ? 'gray' : ''
                }
              })
              return item
            })
            break;
          case 1:
          default:
            _.map(this.openedList, item => {
              item.showTicketOpenNum = _.map(item.fTicketOpenNum, num => {
                return {
                  title: num,
                  style: this.styleConfig[num] || ''
                }
              })
              return item
            })
            break;
        }
      }
    },

    mounted() {
      tickets.getTicketList(
        ({ data }) => {
          if (data && data.result === 0) {
            this.ticketList = data.root
          }
        }
      )

      // $(this.$refs.body).slimScroll({
      //   height: 1000,
      // })

      $(this.$refs.date).datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false,
        minDate: _(moment().endOf('day').add('-6', 'days')).toDate(),
        maxDate: _(moment().endOf('day')).toDate(),
      }).on('dp.change', (e) => {
        this.pageSize = ''
        this.date = e.currentTarget.value
        this.resetData()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .analysis-center {
    width: 1200px;
    margin: 0 auto;
    background: #ffffff;
    border-left: 1px solid $def-gray-color;
    border-right: 1px solid $def-gray-color;
    overflow: hidden;
  }

  .sfa-tickets {
    width: 21px;
    height: 20px;
    background: url(./misc/tickets.png);
  }

  .ticket-select-title {
    font-size: 16px;
    color: $def-black-color;
    vertical-align: super;
    margin: 0 20px 0 2px;
  }

  .ticket-select {
    font-size: 14px;
    height: 36px;
    width: 130px;
    background-color: #ffffff;
  }

  .top-panel {
    width: 1100px;
    height: 90px;

    padding: 28px 40px 0;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 5px;
    border: solid 1px #e6e6e6;
    box-sizing: border-box;
  }
  .main {
    margin: 20px auto;
    box-sizing: border-box;
    width: 1100px;
  }

  .btn-toolbar {
    top: -6px;
    position: relative;
    margin: 0;
    display: inline-block;
    vertical-align: bottom;
  }
  .top-right {
    color: $def-black-color;
    float: right;
  }
  .date-panel {
    color: #333;
    display: inline-block;
    height: 36px;
    border-radius: 5px;
    top: 0;
  }
  .date-title {
    position: relative;
    bottom: 13px;
    margin: 0 10px 0 30px;
  }
  .sfa-icon-time {
    margin-top: 9px;
    margin-right: 10px;
  }
  .btn-group {
    .btn {
      width: 70px;
      padding-left: 0;
      padding-right: 0;
    }
  }
  .num-btn {
    width: 62px;
  }
  .question {
    width: 16px;
    height: 17px;
    background: url(./misc/question.png);
    position: relative;
    top: 3px;
  }

  .red {
    background-color: $red;
    color: $def-white-color;
  }
  .green {
    background-color: $green;
    color: $def-white-color;
  }
  .blue {
    background-color: $blue;
    color: $def-white-color;
  }
  .gray {
    background-color: #f0f0f0;
    color: $new-inverse-color;
  }
  .text-yellow {
    color: #f09932;
  }
  .text-blue {
    color: $new-main-deep-color;
  }

  .yellow {
    background-color: #e8e048;
  }
  .deep-blue {
    background-color: #4b91cd;
  }
  .dark {
    background-color: #4f4f4f;
  }
  .orange {
    background-color: #ee8036;
  }
  .light-blue {
    background-color: #68dfe3;
  }
  .purple {
    background-color: #8d89bd;
  }
  .light-gray {
    background-color: #c1c1c1;
  }
  .amber {
    background-color: #dc6c68;
  }
  .dark-brown {
    background-color: #7b3d33;
  }
  .green {
    background-color: #8cc782;
  }

  .square {
    display: inline-block;
    width: 22px;
    height: 22px;
    line-height: 22px;
    border-radius: 5px;
    text-align: center;
    font-size: 12px;
    transition: background-color 0.5s, color 0.5s;
  }



  .circle {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    text-align: center;
    font-size: 12px;
    transition: background-color 0.5s, color 0.5s;
  }

  .left {
    float: left;
    margin-left: 5px;
    background: url(./misc/left.png);
    width: 10px;
    height: 18px;
    cursor: pointer;
  }

  .right {
    float: right;
    margin-right: 5px;
    background: url(./misc/left.png);
    width: 10px;
    height: 18px;
    transform: rotate(180deg);
    cursor: pointer;
  }
</style>
