<template>
  <div class="road-balls-analysis">
    <div class="panel">
      <div class="panel-main">
        <div class="btn-group">
          <button class="btn" v-for="operate in roadBalls.operates" :class="{active: typeId === operate.id}" @click="changeType(operate.id)">
            {{operate.title}}
          </button>
        </div>
        <div class="panel-advance">
        <template v-for="(advanceType, n) in advanceTypes">
        <span class="advance-btn" :class="{active: advanceTypeId === advanceType.id}" @click="changeAdvanceType(advanceType.id)">
          {{advanceType.title}}
        </span>
          {{advanceTypes.length !== n + 1 ? ' | ' : ''}}
        </template>
        </div>
      </div>
    </div>
    <div class="balls-main">
      <div class="balls-col" v-for="col in cols" :key="col">
        <transition-group class="ball-unit" v-for="row in rows" :key="row"
                          v-on:before-enter="beforeEnter"
                          v-on:enter="enter"
                          v-on:leave="leave"
                          v-bind:css="false">
          <span class="ball" :key="`${col}-${row}`" :class="fComboList[col - 1][row - 1].style" v-if="fComboList[col - 1] && fComboList[col - 1][row - 1] && fComboList[col - 1][row - 1].title">
            {{fComboList[col - 1][row - 1].title}}
          </span>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
  import analysisApi from 'api/analysis'
  import * as roadBalls from './misc/road-balls'

  const ballStyle = {
    '大': 'blue',
    '小': 'gray',
    '双': 'blue',
    '单': 'gray',
    '虎': 'blue',
    '龙': 'gray',
    '和': 'yellow',
    '': ''
  }

  export default {
    name: "road-balls-analysis",

    props: {
      ticketInfo: {
        type: Object,
      }
    },

    data() {
      return {
        roadBalls: {},
        typeId: 10,
        advanceTypeId: 0,
        advanceTypes: [],
        currentAdvanceType: {},
        roadInfo: {},
        comboList: [],
        cols: 35,
        rows: 6,
      }
    },

    watch: {
      ticketInfo: {
        handler() {
          this.roadBalls = roadBalls[this.ticketInfo.type]
          this.typeId = 10
          this.advanceTypeId = 0
          this.advanceTypes = []
          this.currentAdvanceType = {}
          this.roadInfo = {}
          this.comboList = []

        },
        immediate: true
      },
      roadBalls: {
        handler() {
          this.advanceTypes = _.findWhere(this.roadBalls.operates, {
            id: this.typeId
          }).pos
          this.setCurrentAdvanceType(0)
        },
        immediate: true
      },

      currentAdvanceType: {
        handler() {
          this.getData()
        },
        immediate: true
      },
      lastOpenId() {
        this.getData()
      }

    },

    computed: {
      fComboList() {
        let fComboList = []
        let disparityList = []
        let flattenComboList = []
        let prevLH = ''

        for(let i = 0; this.comboList.length > i; ++i) {
          //龙虎和的特殊判断,如果是和 合并到上一列
          let comboCol
          if (this.comboList[i].result === '和') {
            //当前第一期就拿到和 则直接跳过
            comboCol = flattenComboList.pop()
            if (!comboCol) {
              continue
            }
            prevLH = comboCol[comboCol.length - 1].title
            comboCol = comboCol.concat(_.times(this.comboList[i].combo, () => {
              return {
                title: this.comboList[i].result,
                style: ballStyle[this.comboList[i].result]
              }
            }))
          } else if (prevLH === this.comboList[i].result) {
            comboCol = flattenComboList.pop()

            comboCol = comboCol.concat(_.times(this.comboList[i].combo, () => {
              return {
                title: this.comboList[i].result,
                style: ballStyle[this.comboList[i].result]
              }
            }))

            prevLH = ''
          } else {
            comboCol = _.times(this.comboList[i].combo, () => {
              return {
                title: this.comboList[i].result,
                style: ballStyle[this.comboList[i].result]
              }
            })
            prevLH = ''
          }

          flattenComboList.push(comboCol)
        }

        for(let i = 0; flattenComboList.length > i; ++i) {

          let comboCol = flattenComboList[i]

          let leftRow = this.rows - disparityList.length

          if (comboCol.length > leftRow && leftRow !== 0) {

            let currentRowLeftDisparity = comboCol.splice(leftRow, comboCol.length - leftRow)

            // let isMostRight = true

            for(let disIndex = disparityList.length - 1; disIndex >= 0; --disIndex) {
              let disparity = disparityList[disIndex]

              if (!_.isEmpty(disparity)) {
                comboCol.push(disparity.pop())
              } else {
                comboCol.push({
                  title: '',
                  style: ''
                })
              }

            }

            disparityList.push(currentRowLeftDisparity)
          } else if (comboCol.length <= leftRow) {

            comboCol = [...comboCol, ..._.times(leftRow - comboCol.length, () => {
              return {
                title: '',
                style: ''
              }
            })]

            let isMostRight = true

            _.forEachRight(disparityList, (disparity) => {
              if (!_.isEmpty(disparity)) {
                comboCol.push(disparity.pop())
              } else {
                comboCol.push({
                  title: '',
                  style: ''
                })
              }

              if (isMostRight && _.isEmpty(disparity)) {
                this.spliceEmpty(disparityList)
              } else {
                isMostRight = false
              }
            })
          } else {

            let isMostRight = true

            _.forEachRight(disparityList, (disparity) => {
              if (!_.isEmpty(disparity)) {
                comboCol.push(disparity.pop())
              } else {
                comboCol.push({
                  title: '',
                  style: ''
                })
              }

              if (isMostRight && _.isEmpty(disparity)) {
                this.spliceEmpty(disparityList)
              } else {
                isMostRight = false
              }
            })

            if (disparityList.length === this.rows) {
              --i
            }
          }

          fComboList.push(comboCol)
        }

        while(disparityList.length > 0) {
          let leftRow = this.rows - disparityList.length
          let comboCol = _.times(leftRow, () => {
            return {
              title: '',
              style: ''
            }
          })

          let isMostRight = true
          _.forEachRight(disparityList, (disparity) => {
            if (!_.isEmpty(disparity)) {
              comboCol.push(disparity.pop())
            } else {
              comboCol.push({
                title: '',
                style: ''
              })
            }

            if (isMostRight && _.isEmpty(disparity)) {
              this.spliceEmpty(disparityList)
            } else {
              isMostRight = false
            }
          })
          fComboList.push(comboCol)
        }


        return _.last(fComboList, this.cols)
      },
      ...mapState({
        lastOpenId: state => state.bettingInfo.lastOpenId
      }),
    },

    methods: {
      beforeEnter: function (el) {
        el.style.opacity = 0
        // el.style.transform = 'translateY(200px)'
        Velocity(el, {
          translateY: '200px',
        }, {
          duration: 0,
        })
      },
      enter: function (el, done) {
        Velocity(el, {
          translateY: '0px',
          opacity: .5,
        }, {
          duration: 500,
        })
        Velocity(el, {
          opacity: 1,
          rotateZ: '360deg',
        }, {
          duration: 500,
        })
        Velocity(el, {
          scaleX: 1.2,
          scaleY: 1.2,
        }, {
          duration: 300
        })
        Velocity(el, {
          scaleX: 1.0,
          scaleY: 1.0,
        }, {
          duration: 300,
          complete: done
        })
      },
      leave: function (el, done) {
        Velocity(el, {
          translateY: '200px',
          opacity: 0,
        }, {
          duration: 1000,
          complete: done
        })
      },
      spliceEmpty(disparityList) {
        for(let disIndex = disparityList.length - 1; disIndex >= 0; --disIndex) {
          if (_.isEmpty(disparityList[disIndex])) {
            disparityList.pop()
          } else {
            break
          }
        }
      },

      createComboCol(combo, {result}) {
        return _.times(combo, () => {
          return {
            title: result,
            style: ballStyle[result]
          }
        })
      },

      changeType(typeId) {
        this.typeId = typeId
        this.advanceTypes = _.findWhere(this.roadBalls.operates, {
            id: typeId
          }).pos
        this.changeAdvanceType(0)
      },
      changeAdvanceType(advanceTypeId) {
        this.setCurrentAdvanceType(advanceTypeId)
      },

      setCurrentAdvanceType(advanceTypeId) {
        this.advanceTypeId = advanceTypeId
        this.currentAdvanceType = _.findWhere(this.advanceTypes, {
          id: advanceTypeId
        })
      },
      getData() {
        analysisApi.getRoadBalls({
          ticketId: this.ticketInfo.id,
          types: this.typeId,
          locations: this.advanceTypeId
        }, (res) => {
          if (res && res.result === 0) {
            const data = res.root
            this.roadInfo = _.reduce(this.currentAdvanceType.variable.split('.'), (roadInfo, variable) => roadInfo[variable], data)
            this.comboList = this.roadInfo.comboList
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .road-balls-analysis {
    margin: 0 15px 90px;
    background-color: #f0f0f0;
    border-radius: 5px;
    border: solid 1px #e6e6e6;
    font-size: 12px;
  }

  .panel {
    padding: 5px;
  }

  .btn-group {
    border-radius: 5px;
    overflow: hidden;
    border: solid 1px #d7d7d7;
  }
  .btn {
    width: 66px;
    height: 27px;
    border-radius: 0;
    color: #666666;
    border-left: 0;
    border-top: 0;
    border-bottom: 0;
    border-right: 1px solid #d7d7d7;
    background-color: #f0f0f0;
    box-shadow: initial;
    font-size: 12px;
    &:last-of-type {
      border: 0;
    }
    &.active, &:hover {
      background-color: #ffffff;
    }
  }
  .btn-group {
    margin-right: 20px;
    > .btn + .btn {
      margin-left: 0;
    }
  }
  .panel-advance {
    display: inline-block;
  }
  .advance-btn {
    cursor: pointer;
    color: $new-inverse-color;
    padding: 0 7px;
    &.active, &:hover {
      color: $new-main-deep-color;
    }
  }

  .balls-main {
    margin: 5px;
    display: flex;
    border: 1px solid $sec-line-color;
    overflow: hidden;
  }

  .balls-col {
  }
  .ball {
    width: 18px;
    height: 18px;
    line-height: 18px;
    display: inline-block;
    border-radius: 50px;
    transform: translateY(200px);
    &.gray {
      background-color: $im-line-color;
      color: $new-inverse-color;
    }
    &.yellow {
      background-color: #fd9502;
      color: #ffffff;
    }
    &.blue {
      background-color: $new-main-deep-color;
      color: #ffffff;
    }
  }

  span.ball-unit {
    width: 24px;
    height: 24px;
    display: inline-block;
    border: 1px solid $sec-line-color;
    text-align: center;
    line-height: 24px;
    border-right: 0;
    border-top: 0;
    margin-left: -1px;
    vertical-align: bottom;
    background-color: $def-white-color;
  }

  .flip-list-move {
    transition: transform 1s;
  }

</style>
