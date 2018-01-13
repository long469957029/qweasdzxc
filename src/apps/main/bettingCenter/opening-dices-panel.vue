<template>
  <div>
    <opening-dices :counts="ticketInfo.counts" :range="ticketInfo.range" :opening-balls="openingNum" :default-opening="ticketInfo.defaultOpening"></opening-dices>
    <div class="dice-statistic">
      <div class="dice-total">和值 : <span class="font-md">{{totalNum}}</span></div>
      <div class="dice-form">
        形态 :
        <span class="dice-form-item">{{magnitude}}</span>
        <span class="dice-form-item">{{parity}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import openingDices from 'com/opening-dices'

  export default {
    name: "opening-dices-panel",

    components: {
      openingDices
    },

    props: {
      ticketInfo: Object,
      openingNum: Array,
    },

    data() {
      return {
        parity: '',
        magnitude: '',
        totalNum: 0,
      }
    },

    watch: {
      'openingNum': {
        handler(newVal) {
          this.totalNum = _.reduce(newVal, (total, num) => {
            return total + Number(num)
          }, 0)
          this.parity = this.totalNum % 2 ? '单' : '双'
          this.magnitude = this.totalNum > 9 ? '大' : '小'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .dice-statistic {
    width: 100px;
    display: inline-block;
    vertical-align: top;
  }
  .dice-form-item {
    width: 20px;
    height: 20px;
    text-align: center;
    border: 1px solid $def-white-color;
    display: inline-block;
    border-radius: 5px;
    margin-right: 2px;
  }
  .dice-total {
    line-height: 24px;
  }

</style>
