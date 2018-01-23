<template>
  <div class="opening-balls">
    <div class="ball-item-wrapper" v-for="i in counts" :key="i">
      <div class="text-nums">
        <div class="ball-item clearfix" ref="balls">
          <div class="text-num " :class="(i === 0 && init) ? `sfa-mmc-0-disabled` : `sfa-mmc-${num}`"  v-for="(num, i) in range"></div>
          <div class="text-num" :class="`sfa-mmc-${num}`"  v-for="(num, i) in range"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "mmc-opening-num-group",

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
        default: function() {
          return['0', '0', '0', '0', '0']
        },
        required: true
      },
      openingBalls: {
        type: Array,
      }
    },
    data: function () {
      return {
        rollingStatus: R.repeat(false, this.counts),
        totalHeight: 0,
        perHeight: 0,
        init: true
      }
    },

    watch: {
      openingBalls: {
        handler(newOpeningBalls, oldOpeningBalls) {
          if (!_.isEmpty(newOpeningBalls) && !_.isEqual(newOpeningBalls, oldOpeningBalls) && !_.compact(this.rollingStatus).length) {
            this.rolling()
          }
        }
      },
      '$route': {
        handler() {
          this.rollingStatus = R.repeat(false, this.counts)
        }
      }
    },

    methods: {
      rolling() {
        this.init = false
        for(let i = 0; i < this.counts; ++i) {
          _.delay(() => {
            this.rollingStatus[i] = true
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
                this.rollingStatus[i] = false
                if (!_.compact(this.rollingStatus).length) {
                  this.$emit('openCompleted')
                }
              }
            })
          }, 500 * i + 5000)
        }
      },

      $_getDes(i) {
        return -this.perHeight * _.indexOf(this.range, this.openingBalls[i])
      },

      _rolling(ball, i, init = false) {
        Velocity(ball, {
          top: [ball.offsetTop - 23, ball.offsetTop + -this.totalHeight - 23]
        }, {
          duration: init ? 2000 : 'normal',
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


  .opening-balls{
    display: inline-block;
    position: absolute;
    left: 56px;
    top: 35px;

    .ball-item-wrapper {
      position: relative;
      display: inline-block;
      &:nth-of-type(n + 6) {
        .text-circle {
          margin-bottom: 0;
        }
      }
    }

    .ball-item {
      position: relative;
    }

    .text-nums {
      height: 89px;
      overflow: hidden;
      width: 82px;
      padding-top: 23px;
    }
    .text-circle-num {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    .text-num {
      margin: 0 auto 46px;
    }
  }

</style>
