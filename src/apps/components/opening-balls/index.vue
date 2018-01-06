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
        default: _.range(10),
        required: true
      },
      defaultOpening: {
        type: Array,
        default: function() {
          return[0, 0, 0, 0, 0]
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
          if (!_.isEqual(newOpeningBalls, oldOpeningBalls) && !_.compact(this.rollingStatus).length) {
            this.rolling()
          }
        }
      }
    },

    methods: {
      rolling() {
        for(let i = 0; i < this.counts; ++i) {
          if (this.init) {
              this.$refs.balls[i].style.top = `${-this.totalHeight + -this.perHeight * this.openingBalls[i]}px`
          } else {
            _.delay(() => {
              this.rollingStatus[i] = true
              this._rolling(this.$refs.balls[i], true)
            }, 500 * i)

            _.delay(() => {
              Velocity(this.$refs.balls[i], 'stop')
              this.$refs.balls[i].style.top = '0px'

              Velocity(this.$refs.balls[i], {
                top: -this.totalHeight + -this.perHeight * this.openingBalls[i],
                duration: 2000,
                easing: 'ease-out',
                complete: () => {
                  this.rollingStatus[i] = false
                }
              })
            }, 500 * i + 5000)
          }
        }

        this.init = false
      },

        _rolling(ball, init) {
          Velocity(ball, {
            top: [0, -this.totalHeight]
          }, {
            duration: init ? 2000 : 'normal',
            easing: init ? 'ease-in' : 'linear',
            complete: () => {
              if (this.rollingStatus) {
                this._rolling(ball)
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
    display: flex;

    .ball-item-wrapper {
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

    .ball-item {
      position: relative;
    }

    .text-circle{
      font-family: din, Tahoma, Arial, "Microsoft YaHei UI", "Microsoft Yahei", sans-serif;
      position: relative;
      overflow: hidden;
    }
    .text-circle-num {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }

</style>
