<template>
  <div class="opening-balls">
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
        init: true,
        totalHeight: 0,
        perHeight: 0,
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
          this.init = true
        }
      }
    },

    methods: {
      rolling() {
        for(let i = 0; i < this.counts; ++i) {
          if (this.init) {
            this.$refs.balls[i].style.top = `${this.$_getDes(i)}px`
          } else {
            _.delay(() => {
              this.rollingStatus[i] = true
              this._rolling(this.$refs.balls[i], i, true)
            }, 500 * i)

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
            }, 500 * i + 3500)
          }
        }

        this.init = false
      },

      $_getDes(i) {
        return -this.perHeight * _.indexOf(this.range, this.openingBalls[i])
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
    max-width: 295px;
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
        top: 45px;
        left: 11px;
        transform: rotateX(65deg);
      }
      &:nth-of-type(n + 6) {
        .text-circle {
          margin-bottom: 0;
        }
      }
    }

    .ball-item {
      position: relative;
    }

    .text-circle{
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
  }

</style>
