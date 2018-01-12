<template>
  <div class="dice" :class="value ? `dice-${value}` : ''">
    <div class="cube" ref="dice">
      <div class="side side_1">
        <span class="dot dot_5"></span>
      </div>
      <div class="side side_2">
        <span class="dot dot_3"></span><span class="dot dot_7"></span>
      </div>
      <div class="side side_3">
        <span class="dot dot_3"></span><span class="dot dot_5"></span><span class="dot dot_7"></span>
      </div>
      <div class="side side_4">
        <span class="dot dot_1"></span><span class="dot dot_3"></span><span class="dot dot_7"></span><span class="dot dot_9"></span>
      </div>
      <div class="side side_5">
        <span class="dot dot_1"></span><span class="dot dot_3"></span><span class="dot dot_5"></span><span class="dot dot_7"></span><span class="dot dot_9"></span>
      </div>
      <div class="side side_6">
        <span class="dot dot_1"></span><span class="dot dot_4"></span><span class="dot dot_7"></span><span class="dot dot_3"></span><span class="dot dot_6"></span><span class="dot dot_9"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dice",

    props: ['value'],

    methods: {
      getDice() {
        return this.$refs.dice
      }
    }
  }
</script>

<style lang="scss">
  @import
  "~base/styles/variable";

  $dices: (
    default: (
      size: 48px,
      dot-size: 9px,
      des: 24px,
    ),
    sm: (
      size: 28px,
      dot-size: 5px,
      des: 14px,
    )
  );

  @mixin dice($class, $prop) {
    $size: map_get($prop, size);
    $dot-size: map_get($prop, dot-size);
    $des: map_get($prop, des);

    width: $size;
    height: $size;

    .cube {
      width: $size;
      height: $size;
    }

    .side {
      width: $size;
      height: $size;
    }

    .side_1 {
      transform: translateZ(-$des) rotateX(180deg);
    }

    .side_2 {
      transform: translateY(-$des) rotateX(90deg);
    }

    .side_3 {
      transform: translateX($des) rotateY(90deg);
    }

    .side_4 {
      transform: translateX(-$des) rotateY(270deg);
    }
    .side_5 {
      transform: translateY($des) rotateX(270deg);
    }

    .side_6 {
      transform: translateZ($des);
    }

    .dot {
      width: $dot-size;
      height: $dot-size;
    }
  }

  @mixin dices($styles) {
    @each $class, $props in $styles {
      @if ($class == default) {
        @include dice($class, $props);
      } @else {
        &.dice-#{$class} {
          @include dice($class, $props);
        }
      }
    }
  }

  .dice {
    display: inline-block;
    /*perspective: 400px;*/
    @include dices($dices);

    &.dice-1 .cube {
      transform: translateZ(-50px) rotateX(180deg) rotateY(0deg);
    }
    &.dice-2 .cube {
      transform: translateZ(-50px) rotateX(-90deg) rotateY(0deg);
    }
    &.dice-3 .cube {
      transform: translateZ(-50px) rotateX(0deg) rotateY(-90deg);
    }
    &.dice-4 .cube {
      transform: translateZ(-50px) rotateX(0deg) rotateY(90deg);
    }
    &.dice-5 .cube {
      transform: translateZ(-50px) rotateX(90deg) rotateY(0deg);
    }
    &.dice-0 .cube {
      transition: transform 1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }

    .cube {
      position: relative;
      transform-style: preserve-3d;
      transform: translateZ(-50px) rotateX(0) rotateY(0);
      /*transition: transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);*/
    }

    .side {
      position: absolute;
      box-sizing: border-box;
      border: 1px solid $def-gray-color;
      border-radius: 5px;
      overflow: hidden;
      background-image: linear-gradient(0deg,
      #d7d7d7 0%,
      #ffffff 100%);
      backface-visibility: hidden;
    }

    .side_1 {
      .dot_5 {
        width: 13px;
        height: 13px;
        background-color: #ac3d46;
        box-shadow: 0px -1px 0px 0px
        #ffffff,
        inset 0px 1px 2px 0px
        rgba(0, 0, 0, 0.2);
        left: 27px;
        top: 28px;
      }
    }


    .dot {
      position: absolute;
      margin: -10px 0 0 -10px;
      border-radius: 10px;
      background-color: #363b4b;
      box-shadow: 0px -1px 0px 0px;
    }

    .dot_1, .dot_2, .dot_3 {
      top: 17px;
    }

    .dot_4, .dot_5, .dot_6 {
      top: 30px;
    }

    .dot_7, .dot_8, .dot_9 {
      top: 43px;
    }

    .dot_1, .dot_4, .dot_7 {
      left: 18px;
    }

    .dot_2, .dot_5, .dot_8 {
      left: 30px;
    }

    .dot_3, .dot_6, .dot_9 {
      left: 40px;
    }
  }
</style>
