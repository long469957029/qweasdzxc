<template>
  <div class="play-area-input" :class="componentType || ''">

    <!--选择位置-->
    <div class="tab-toolbar tab-circle tab-default" v-if="!_.isEmpty(playRule.optionals)">
      <div class="select-item-title tab-title">
        <div>位置</div>
      </div>
      <div class="tab-group no-margin inline-block">
        <div class="clearfix inline-block">
          <betting-play-area-position :optionals="playRule.optionals" v-model="selectOptionals"></betting-play-area-position>
        </div>
      </div>
    </div>

    <div class="clearfix m-TB-md">
      <div class="js-bc-numbers-container bc-textarea-main pull-left" @click="focusInput">
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

      <div class="input-operate-area pull-left">
        <div class="m-bottom-md">
          <button type="button" class="btn btn-white btn-linear bc-input-btn" @click="delRepeat">清理错误与重复</button>
        </div>
        <div class="m-bottom-md" ref="fileLoad"></div>
        <div class="m-bottom-md">
          <button type="button" class="btn btn-white btn-linear bc-input-btn" @click="empty">清空号码</button>
        </div>
      </div>
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

    data: function () {
      return {
        // 回车 逗号 分号 冒号 竖线 空白字符
        splitReg: /[\r\n,\;:\|\s]+/,
        selectOptionals: [],
        coefficient: 1,
        numbers: '',
        splitNumbers: [],
        type: 'input'
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

        const html = ['<div class=" max-height-smd overflow-auto">']
        if (!_.isEmpty(repeat.repeatNumbers)) {
          html.push(`<p class="word-break">以下号码重复，已进行自动过滤<br />${repeat.repeatNumbers.join(',')}</p>`)
        }
        if (!_.isEmpty(_.compact(validate.errorNumbers))) {
          html.push(`<p class="word-break">以下号码错误，已进行自动过滤<br />${validate.errorNumbers.join(',')}</p>`)
        }
        html.push('</div>')

        if (html.length > 2) {
          Global.ui.notification.show(html.join(''))
        }

        this.$_statisticsLottery()
      },

      empty() {
        $(this.$refs.fileTip).removeClass('hidden')
        $(this.$refs.numbersArea).addClass('hidden')
        this.numbers = ''
        // this.$store.commit(types.SET_STATISTICS, 0)
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
    }
  }
</script>

<style lang="scss" scoped>
  .play-area-input {
    padding: 0 15px;
  }

  .bc-textarea-main {
    width: 680px;
    height: 170px;
    padding: 10px;
    border-radius: 5px;
    border: solid 1px #d7d7d7;
  }

  .input-operate-area {
    margin-left: 30px;
    margin-top: 20px;
  }

  .mmc {
    .bc-textarea-main {
      width: 615px;
    }
  }
</style>