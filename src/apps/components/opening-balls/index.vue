<template>
  <div class="opening-balls">
    <div class="ball-item" v-for="i in counts" :key="i">
      <span class="text-circle" v-for="num in range">{{num}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "opening-balls",

    props: {
      counts: {
        type: Number,
        default: 5,
        required: true
      },
      range: {
        type: Array,
        default: _.range(10),
        required: true
      },
      openingBalls: {
        type: Array,
      }
    },
    data: function () {
      return {
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .opening-balls{
    .text-circle{
      font-family: din, Tahoma, Arial, "Microsoft YaHei UI", "Microsoft Yahei", sans-serif;
      position: relative;
      &:after{
        content: '';
        width: 18px;
        height: 4px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 20px rgba(0,0,0,1);
        position: absolute;
        bottom: -10px;
        left: 11px;
        transform: rotateX(65deg);
      }
    }
  }

</style>
