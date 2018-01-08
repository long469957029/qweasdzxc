<template>
  <div class="opening-balls">
    <div class="inline-block vertical-top"  v-for="i in counts" :key="i">
      <div class="ball-item-wrapper">
        <div class="ball-item">
          <div class="ball-item-inner" ref="balls">
            <div class="text-circle" :class="item.style" v-for="item in range">{{item.title}}</div>
            <div class="text-circle" :class="item.style" v-for="item in range">{{item.title}}</div>
          </div>
        </div>
      </div>
      <div class="add" v-if="counts - i === 1">+</div>
      <transition
        name="custom-classes-transition"
        enter-active-class="bounceInUp animated-quick"
        leave-active-class="bounceOutUp animated-quick"
      >
        <div class="ball-sx" v-if="!rollingStatus[i - 1]">{{fOpeningBalls[i - 1] && fOpeningBalls[i - 1].sx}}</div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "opening-mark6-balls",

    props: {
      counts: {
        type: Number,
        required: true
      },
      range: {
        type: Array,
        required: true
      },
      defaultOpening: {
        type: Array,
        required: true
      },
      openingBalls: {
        type: Array,
      }
    },
    data: function () {
      return {
        rollingStatus: R.repeat(false, this.counts),
        init: true,
        totalHeight: 0,
        fOpeningBalls: [],
        perHeight: 0,
      }
    },

    watch: {
      openingBalls: {
        handler(newOpeningBalls, oldOpeningBalls) {
          if (!_.isEmpty(newOpeningBalls) && !_.isEqual(newOpeningBalls, oldOpeningBalls) && !_.compact(this.rollingStatus).length) {
            this.fOpeningBalls = _.map(newOpeningBalls, ball => {
              return {
                num: ball,
                sx: bettingTypes.MARK6.sx[ball]
              }
            })
            this.rolling()
          }
        }
      }
    },

    methods: {
      rolling() {
        for(let i = 0; i < this.counts; ++i) {
          if (!this.init) {
            this.$refs.balls[i].style.top = `${this.$_getDes(i)}px`
          } else {
            _.delay(() => {
              this.$set(this.rollingStatus, i, true)
              // this.rollingStatus[i] = true
              this._rolling(this.$refs.balls[i], i, true)
            }, 500 * i)

            _.delay(() => {
              Velocity(this.$refs.balls[i], 'stop')
              this.$refs.balls[i].style.top = `${-this.totalHeight}px`

              Velocity(this.$refs.balls[i], {
                top: this.$_getDes(i),
              }, {
                duration: 2000,
                easing: 'ease-out',
                complete: () => {
                  this.$set(this.rollingStatus, i, false)
                  // this.rollingStatus[i] = false
                }
              })
            }, 500 * i + 5000)
          }
        }

        this.init = false
      },

      $_getDes(i) {
        return -this.perHeight * _.findIndex(this.range, {num: this.openingBalls[i]})
      },

      _rolling(ball, i, init = false) {
        Velocity(ball, {
          top: [ball.offsetTop, ball.offsetTop + -this.totalHeight]
        }, {
          duration: 3000,
          easing: init ? 'ease-in' : 'linear',
          complete: () => {
            if (this.rollingStatus[i]) {
              this._rolling(ball, i)
            }
          }
        })
      }
    },

    mounted() {
      this.totalHeight = this.$refs.balls[0].offsetHeight / 2
      this.perHeight = this.totalHeight / this.range.length
    }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .opening-balls{
    max-width: 395px;
    display: inline-block;

    .ball-item-wrapper {
      position: relative;
      display: inline-block;
      &:after{
        content: '';
        width: 18px;
        height: 4px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 20px rgba(0,0,0,1);
        position: absolute;
        top: 35px;
        left: 8px;
        transform: rotateX(65deg);
      }
    }

    .ball-item {
      height: 40px;
      overflow: hidden;
      position: relative;
      width: 30px;
      margin-right: 10px;
    }
    .ball-item-inner {
      position: relative;
    }

    .text-circle{
      font-family: Tahoma, Arial, "Microsoft YaHei UI", "Microsoft Yahei", sans-serif;
      position: relative;
      overflow: hidden;
      margin-bottom: 10px;
      height: 30px;
      width: 30px;
      font-size: 18px;
      line-height: 30px;

      &.red {
        background-color: #e06d69;
        color: $def-white-color;
      }
      &.green {
        background-color: #8dc782;
        color: $def-white-color;
      }
      &.blue {
        background-color: #4785b0;
        color: $def-white-color;
      }
    }
    .add {
      display: inline-block;
      font-size: 24px;
      position: relative;
      top: 5px;
      vertical-align: top;
      margin-right: 10px;
    }
    .ball-sx {
      font-size: 14px;
      text-indent: 8px;
    }
  }

</style>
