<template>
  <div>
    <opening-dices :counts="ticketInfo.counts" :range="ticketInfo.range" :opening-balls="openingNum"
                   :default-opening="ticketInfo.defaultOpening"></opening-dices>
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
  import {quick3Sum} from 'filters'

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
          ({totalNum: this.totalNum, parity: this.parity, magnitude: this.magnitude} = quick3Sum(newVal))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>


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
