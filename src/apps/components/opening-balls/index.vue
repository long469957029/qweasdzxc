<template>
  <div class="opening-balls" :class="sizeStyle">
    <div class="ball-item-wrapper" v-for="i in counts" :key="i">
      <div class="text-circle">
        <div class="ball-item" ref="balls">
          <div class="text-circle-num" v-for="num in range">{{num}}</div>
          <div class="text-circle-num" v-for="num in range">{{num}}</div>
        </div>
      </div>
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
        default: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true
      },
      defaultOpening: {
        type: Array,
        default: function () {
          return ['0', '0', '0', '0', '0']
        },
        required: true
      },
      openingBalls: {
        type: Array,
      },
      autoStopRolling: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: 'normal'
      }
    },
    data() {
      return {
        rollingStatus: R.repeat(false, this.counts),
        init: true,
        totalHeight: 0,
        perHeight: 0,
      }
    },

    computed: {
      sizeStyle() {
        return this.size === 'normal' ? '' : 'sm'
      }
    },

    watch: {
      openingBalls: {
        handler(newOpeningBalls, oldOpeningBalls) {
          //正常模式 - 在号码开出后rolling
          //手动模式 - 在手动rolling后 在开出号码后停止
          if (!_.isEmpty(newOpeningBalls)) {
            if (this.init) {
              this.$_setInit()
              return true
            }

            if (!_.isEqual(newOpeningBalls, oldOpeningBalls)) {
              if (!this.autoStopRolling) {
                for (let i = 0; i < this.counts; ++i) {
                  this.$_easeOutRolling({delay: 0, i})
                }
              } else {
                this.rolling()
              }
            }
          }

        }
      },
      '$route': {
        handler() {
          this.rollingStatus = R.repeat(false, this.counts)
          this.init = true
        }
      },
      sizeStyle: {
        handler() {
          this.$nextTick(() => {
            this.$_updateSize()
            this.$_setInit()
            this.init = true
          })
        }
      }
    },

    methods: {

      $_setInit() {
        for (let i = 0; i < this.counts; ++i) {
          this.$refs.balls[i].style.top = `${this.$_getDes(i)}px`
        }

        this.init = false
      },

      rolling() {
        if (!_.compact(this.rollingStatus).length) {
          for (let i = 0; i < this.counts; ++i) {
            this.rollingStatus[i] = true
            _.delay(() => {
              this._rolling(this.$refs.balls[i], i, true)
            }, 500 * i)

            if (this.autoStopRolling) {
              this.$_easeOutRolling({i, delay: 3500})
            }
          }
        }
      },

      $_easeOutRolling({delay, i} = {delay: 3500}) {
        _.delay(() => {
          Velocity(this.$refs.balls[i], 'stop')

          Velocity(this.$refs.balls[i], {
            top: -this.totalHeight + this.$_getDes(i)
          }, {
            duration: 0
          })

          Velocity(this.$refs.balls[i], {
            top: this.$_getDes(i),
          }, {
            duration: 1500,
            easing: 'ease-out',
            complete: () => {
              this.rollingStatus[i] = false
            }
          })
        }, 500 * i + delay)
      },

      $_getDes(i) {
        return -this.perHeight * _.indexOf(this.range, this.openingBalls[i] ? this.openingBalls[i] : this.defaultOpening[i])
      },

      _rolling(ball, i, init = false) {
        Velocity(ball, {
          top: [ball.offsetTop, ball.offsetTop + -this.totalHeight]
        }, {
          duration: init ? 2000 : 'normal',
          easing: init ? 'ease-in' : 'linear',
          complete: () => {
            if (this.rollingStatus[i]) {
              this._rolling(ball, i)
            }
          }
        })
      },
      $_updateSize() {
        this.totalHeight = this.$refs.balls[0].offsetHeight / 2
        this.perHeight = this.totalHeight / this.range.length
      }
    },

    mounted() {
      this.$_updateSize()
    }
  }
</script>

<style lang="scss" scoped>


  .opening-balls {
    max-width: 295px;
    display: inline-block;

    .ball-item-wrapper {
      position: relative;
      display: inline-block;
      &:after {
        content: '';
        width: 18px;
        height: 4px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 20px rgba(0, 0, 0, 1);
        position: absolute;
        bottom: 5px;
        left: 0;
        transform: rotateX(65deg) translateX(50%);
      }
      /*&:nth-of-type(n + 6) {*/
        /*.text-circle {*/
          /*margin-bottom: 0;*/
        /*}*/
      /*}*/
    }

    .ball-item {
      position: relative;
    }

    .text-circle {
      font-family: dokchamp, Tahoma, Arial, "Microsoft YaHei UI", "Microsoft Yahei", sans-serif;
      position: relative;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .text-circle-num {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    &.sm {
      .text-circle {
        margin-right: 14px;
        width: 36px;
        height: 36px;
        font-size: 24px;
        line-height: 36px;
      }

      .text-circle-num {
        height: 36px;
        width: 36px;
        line-height: 36px;
      }
    }
  }

</style>
