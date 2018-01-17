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
      <div class="balls-col" v-for="col in cols">
        <span class="ball-unit" v-for="row in rows">
          <span class="ball gray" v-if="(!fComboList[col].overflow && fComboList[col].combo >= row) || (fComboList[col].overflow && row === rows)">
            {{fComboList[col].result}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import analysisApi from 'api/analysis'
  import * as roadBalls from './misc/road-balls'

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
      }
    },

    computed: {
      fComboList() {
        let fComboList = []
        let disparityList = []

        for(let i = 0; this.comboList.length > i; ++i) {

          const comboInfo = this.comboList[i]

          if (this.comboList[i].combo > this.rows) {
            disparityList.push({
              disparity: comboInfo.combo - this.rows,
              title: comboInfo.result
            })

            fComboList.push(this.createComboCol(this.rows), comboInfo)

            // _.times(disparity, () => {
            //   fComboList.push({
            //     result: comboInfo.result,
            //     overflow: true
            //   })
            // })
          }

          fComboList.push(this.createComboCol(comboInfo.combo), comboInfo)
        }


        return fComboList
      }
    },

    methods: {

      createComboCol(combo, {result}) {
        return _.times(combo, () => {
          return {
            title: result
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
  }

  .balls-col {
  }
  .ball {
    width: 18px;
    height: 18px;
    line-height: 18px;
    display: inline-block;
    border-radius: 50px;
    &.gray {
      background-color: $im-line-color;
      color: $new-inverse-color;
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

</style>
