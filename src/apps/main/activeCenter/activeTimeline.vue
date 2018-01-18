<template>
  <div class="timeline-container">
    <transition name="timeline-grow">
      <div class="timeline" :style="{height: `${timelineHeight}px`}" v-if="timelineHeight > 1"></div>
    </transition>
    <figure v-is-in-view></figure>
    <div
      v-for="(item, index) in filterActivityList"
      :key="item.rid"
      :class="index % 2 === 0 ? 'timeline-item-top' : 'timeline-item-bottom'"
      v-is-in-view="{
        showIfPartial: true,
        callback: visibilityChanged
      }"
    >
      {{date(item.startDate)}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'active-timeline',
  props: ['timelineHeight', 'filterActivityList'],

  data() {
    return {
    }
  },
  methods: {
    date(time) {
      return _(time).toDate('MM/DD')
    },
    visibilityChanged(element) {
      if (!element) {
        return
      }
      element.classList.add('timeline-item-in')
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~base/styles/variable";

  .timeline-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 50px;
    margin: 0 auto;
    top: 130px;
  }
  .timeline {
    width: 1px;
    background: $main-deep-color;
    margin: 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    top: -30px;
  }
  .timeline-grow-enter-active {
    transition: all 3s;
    transform-origin: top;
  }

  .timeline-grow-enter {
    transform: scaleY(0);
  }

  .timeline-item-container {
    width: 50px;
    height: 1200px;
    margin: 0 auto;
    position: relative;
    top: 30px;
    margin-bottom: 40px;
  }

  .timeline-item-top, .timeline-item-bottom {
    width: 45px;
    height: 45px;
    line-height: 45px;
    border-radius: 100%;
    background: $main-deep-color;
    font-size: 12px;
    text-align: center;
    border: 4px solid #fff;
    margin: 110px auto 0;
    box-shadow: 0 0 5px 2px #dcdcdc;
    position: relative;
    transform: scale(0);

    &:after {
      display: block;
      content: '';
      border-bottom: solid 1px #b0e0e3;
      position: absolute;
      transform-origin: right;
      left: -51px;
      bottom: 22px;
      width: 46px;
      transform: scale(0, 1);
      transition: all 1s;
      transition-delay: .9s;
    }
  }

  .timeline-item-top {
    &:after {
      left: -51px;
      transform-origin: right;
    }
  }

  .timeline-item-bottom {
    margin-bottom: 185px;
    &:after {
      left: 51px;
      transform-origin: left;
    }
  }

  .timeline-item-in {
    animation: timeline-item-in 1s forwards;
    &:after {
      transform: scale(1, 1)
    }
  }

  @keyframes timeline-item-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
