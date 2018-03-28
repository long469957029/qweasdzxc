<template>
  <div class="play-area-input" :class="componentType || ''">

    <!--选择位置-->
    <div class="tab-toolbar tab-circle tab-default" v-if="!_.isEmpty(playRule.optionals)">
      <div class="select-item-title tab-title">
        <div>位置</div>
      </div>
      <div class="tab-group no-padding inline-block">
        <div class="clearfix inline-block">
          <betting-play-area-position :optionals="playRule.optionals" v-model="selectOptionals"></betting-play-area-position>
        </div>
      </div>
    </div>

    <div class="input-play-area">
      <div class="js-bc-numbers-container bc-textarea-main" @click="focusInput">
        <div class="height-100 width-100 cursor-text" ref="fileTip">
          <p style="font-size:12px;line-height:170%;">
            说明：<br>
            1、每一注号码之间的间隔符支持 回车 逗号[,] 分号[;] 冒号[:] 竖线 [|]<br>
            2、文件格式必须是.txt格式。<br>
            3、导入文本内容后将覆盖文本框中现有的内容。
          </p>
        </div>
        <textarea class="height-100 width-100 no-resize no-padding no-margin no-border hidden" ref="numbersArea"
                  @blur="blurInput" @keyup="betChange" v-model="numbers"></textarea>
      </div>

      <div class="input-operate-area">
        <div class="m-bottom-md">
          <button type="button" class="btn btn-white btn-linear bc-input-btn" @click="delRepeat">清理错误与重复</button>
        </div>
        <div class="m-bottom-md" ref="fileLoad"></div>
        <div class="m-bottom-md">
          <button type="button" class="btn btn-white btn-linear bc-input-btn" @click="empty">清空号码</button>
        </div>
      </div>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showCheckModal">
        <div slot="head-main" class="text-center">提示</div>
        <div class="check-modal">
          <ul class="check-list">
            <li class="check-cell" v-if="repeatNumbers.length">
              <div class="check-title">以下号码重复，已进行自动去重</div>
              <div class="check-content">{{repeatNumbers.join(',')}}</div>
            </li>
            <li class="check-cell" v-if="errorNumbers.length">
              <div class="check-title">以下号码错误，已进行自动过滤</div>
              <div class="check-content">{{errorNumbers.join(',')}}</div>
            </li>
          </ul>
          <div class="btn-panel">
            <button class="btn check-confirm-btn" @click="showCheckModal = false">确定</button>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import betRulesAlgorithm from './misc/betRulesAlgorithm'
  import BettingPlayAreaPosition from "./betting-play-area-position"

  export default {
    name: "betting-play-area-input",

    components: {BettingPlayAreaPosition},

    props: {
      playRule: Object,
      componentType: {
        type: String,
        default: ''
      },
    },

    data() {
      return {
        // 回车 逗号 分号 冒号 竖线 空白字符
        splitReg: /[\r\n,\;:\|\s]+/,
        selectOptionals: [],
        coefficient: 1,
        numbers: '',
        splitNumbers: [],
        type: 'input',
        showCheckModal: false,
        repeatNumbers: [],
        errorNumbers: [],
      }
    },

    watch: {
      numbers: {
        handler(newval, oldval) {
          this.splitNumbers = this.$_split()
        }
      },
      playRule: {
        handler(newVal) {
          this.selectOptionals = []
          this.lotteryList = []
          this.empty()
        }
      },
      selectOptionals: {
        handler() {
          this.$_calculateCoefficient()
          this.$nextTick(() => {
            this.$_statisticsLottery()
          })
        }
      },
    },

    mounted() {
      $(this.$refs.fileLoad).fileLoad({
        title: '导入文件',
        accept: '.txt',
        done: (res) => {
          if (res && res.result === 0) {
            this.numbers = res.root
            $(this.$refs.fileTip).addClass('hidden')
            $(this.$refs.numbersArea).removeClass('hidden')
            this.$_statisticsLottery()
          }
        },
        fail() {

        },
      })
    },

    methods: {
      focusInput() {
        $(this.$refs.fileTip).addClass('hidden')
        $(this.$refs.numbersArea).removeClass('hidden').focus()
      },
      blurInput() {
        if (!_(this.numbers).trim()) {
          $(this.$refs.numbersArea).addClass('hidden')
          $(this.$refs.fileTip).removeClass('hidden')
        }
      },
      betChange() {
        this.$_statisticsLottery()
      },
      delRepeat() {
        const repeat = this.$_checkRepeat(this.$_split())
        const validate = this.$_validate(repeat.passNumbers)

        this.numbers = validate.passNumbers.join(',')

        this.repeatNumbers = repeat.repeatNumbers
        this.errorNumbers = validate.errorNumbers

        this.$_statisticsLottery()

        const hasError = !!(this.repeatNumbers.length || this.errorNumbers.length)

        this.showCheckModal = hasError

        this.blurInput()

        return !hasError
      },

      empty() {
        $(this.$refs.fileTip).removeClass('hidden')
        $(this.$refs.numbersArea).addClass('hidden')
        this.numbers = ''
      },

      create(createTimes) {
        let results = []

        if (this.coefficient) {
          results = _(createTimes).times(this.playRule.create, this.options)
          _(results).each(function (result) {
            result.statistics = Math.round(_(this.coefficient).mul(result.statistics))
            result.selectOptionals = this.selectOptionals
          }, this)
        }

        return results
      },

      addBetting(options) {

        const repeat = this.$_checkRepeat(this.$_split())
        const validate = this.$_validate(repeat.passNumbers)


        this.$store.commit(types.SET_STATISTICS, validate.statistics)

        repeat.repeatNumbers = repeat.repeatNumbers.concat(validate.repeatNumbers)

        let bettingInfo = {
          lotteryList: [_(validate.passNumbers).map((passNumber) => {
            const splitNum = passNumber.split(',')
            return {
              title: splitNum,
              num: splitNum
            }
          })],
          format: this.playRule.format,
          selectOptionals: this.selectOptionals,
          repeatNumbers: repeat.repeatNumbers,
          errorNumbers: validate.errorNumbers,
        }

        this.$store.commit(types.ADD_PREV_BET, {
          bettingInfo,
          options
        })

        return bettingInfo
      },

      $_statisticsLottery() {
        const validated = this.$_validate(this.$_split())

        this.$store.commit(types.SET_MAX_PRIZE_MULTIPLE, this.playRule.maxPrizeAlgorithm({
          lotteryList: validated.passNumbers,
          ...this.playRule.maxPrizeAlgorithmProps,
          selectOptionals: this.selectOptionals,
          count: validated.statistics
        }))

        this.$store.commit(types.SET_STATISTICS, validated && validated.statistics || 0)
      },

      $_calculateCoefficient() {
        let coefficient = 1

        if (!_.isEmpty(this.selectOptionals)) {
          coefficient = betRulesAlgorithm.optional(
            this.playRule.optionals.coefficient,
            this.selectOptionals.length,
          )
        }
        this.coefficient = coefficient
      },

      $_checkRepeat(numberList) {
        const results = _(numberList).unique()

        return {
          passNumbers: results.unique,
          repeatNumbers: results.repeat,
        }
      },

      $_split() {
        const contents = _(this.numbers).trim()
        return contents.split(this.playRule.splitReg || this.splitReg)
      },

      $_validate(numberList) {
        let result

        if (this.coefficient) {
          result = this.playRule.validate.call(this.playRule, numberList)

          result.statistics = Math.round(_(this.coefficient).mul(result.statistics))
        } else {
          result = {
            statistics: 0,
          }
        }

        return result
      }
    },

    activated() {
      this.empty()
    }
  }
</script>

<style lang="scss" scoped>
  .play-area-input {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
  }
  .input-play-area {
    display: flex;
    margin-top: 10px;
  }

  .bc-textarea-main {
    width: 680px;
    height: 170px;
    padding: 10px;
    border-radius: 5px;
    border: solid 1px #d7d7d7;
    flex: 1 0 0;
  }

  .input-operate-area {
    margin-left: 30px;
    margin-top: 20px;
  }


  //错误弹窗
  .check-modal {
    .check-list {
      width: 450px;
      margin: 20px 10px 20px 20px;
      box-sizing: border-box;
      max-height: 153px;
      overflow: auto;
      list-style: none;
    }

    .check-cell {
      padding-left: 20px;
      position: relative;
      margin-bottom: 20px;
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 5px;
        height: 5px;
        background: #cccccc;
        top: 7px;
        left: 7px;
        border-radius: 50%;
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .check-title {
      font-size: 14px;
      color: #666666;
      margin-bottom: 5px;
    }

    .check-content {
      font-size: 14px;
      color: #999999;
      word-wrap: break-word;
      padding-right: 15px;
    }

    .check-confirm-btn {
      width: 108px;
      height: 36px;
      background-color: #14b1bb;
      border-radius: 3px;
      border: solid 1px #13a6af;
    }

    .btn-panel {
      text-align: center;
      margin-bottom: 30px;
    }
  }

  .mmc {
    .bc-textarea-main {
      width: 615px;
    }
  }
</style>
