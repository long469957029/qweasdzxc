<template>
  <div class="opening-dices">
    <div :class="`dice dice_${i}`" v-for="i in counts" :key="i">
      <div class="cube" ref="dices">
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
  </div>
</template>

<script>

  const positionList = [
    {
      x: 180,
      y: 0
    },
    {
      x: 90,
      y: 0
    },
    {
      x: 0,
      y: -90,
    },
    {
      x: 0,
      y: 90,
    },
    {
      x: 90,
      y: 0
    },
    {
      x: 0,
      y: 0
    },
  ]

  export default {
    name: "opening-dice",

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
          if (!_.isEmpty(newOpeningBalls) && !_.isEqual(newOpeningBalls, oldOpeningBalls) && !_.compact(this.rollingStatus).length) {
          // if (!_.compact(this.rollingStatus).length) {
            this.rolling()
          }
        }
      }
    },

    methods: {
      rolling() {
        for(let i = 0; i < this.counts; ++i) {
          const pos = this.$_getDes(i)
          if (this.init) {
            this.$refs.dices[i].style.transform = `rotateX(${pos.x}deg) rotateY(${pos.y}deg)`
          } else {
            _.delay(() => {
              this.rollingStatus[i] = true
              this._rolling(this.$refs.dices[i], i, 1, true)
            }, 500 * i)

            _.delay(() => {
              Velocity(this.$refs.dices[i], 'stop')


              Velocity(this.$refs.dices[i], {
                rotateX: pos.x,
                rotateY: pos.y,
              }, {
                duration: 1000,
                easing: 'ease-out',
                complete: () => {
                  this.rollingStatus[i] = false
                }
              })
            }, 1000 * i + 5000)
          }
        }

        this.init = false
      },

      $_getDes(i) {
        return positionList[_.indexOf(this.range, this.openingBalls[i])]
      },

      _rolling(dice, i, count, init = false) {
          Velocity(dice, {
            rotateX: 1.5 * 280 * count,
            rotateY: 1.5 * 340 * count,
          }, {
            duration: 300,
            easing: init ? 'ease-in' : 'linear',
            complete: () => {
              if (this.rollingStatus[i]) {
                this._rolling(dice, i, ++count)
              }
            }
          })
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  $size: 48px;
  $dot-size: 9px;
  $des: 24px;

  .opening-dices {
    display: flex;

    .dice {
      width: $size;
      height: $size;
      margin-right: 15px;
      /*perspective: 400px;*/
    }

    .cube {
      position: relative;
      width: $size;
      height: $size;
      transform-style: preserve-3d;
      transform: translateZ(-50px) rotateX(0) rotateY(0);
      /*transition: transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);*/
    }

    .side {
      position: absolute;
      width: $size;
      height: $size;
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 5px;
      overflow: hidden;
      background-image: linear-gradient(0deg,
        #d7d7d7 0%,
        #ffffff 100%);
      backface-visibility: hidden;
    }

    .side_1 {
      transform: translateZ(-$des) rotateX(180deg);
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

    .dice {
      &[data-val="1"] .cube {
        transform: translateZ(-50px) rotateX(180deg) rotateY(0deg);
      }
      &[data-val="2"] .cube {
        transform: translateZ(-50px) rotateX(-90deg) rotateY(0deg);
      }
      &[data-val="3"] .cube {
        transform: translateZ(-50px) rotateX(0deg) rotateY(-90deg);
      }
      &[data-val="4"] .cube {
        transform: translateZ(-50px) rotateX(0deg) rotateY(90deg);
      }
      &[data-val="5"] .cube {
        transform: translateZ(-50px) rotateX(90deg) rotateY(0deg);
      }
      &[data-val="0"] .cube {
        transition: transform 1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
      }
    }

    .dot {
      position: absolute;
      width: $dot-size;
      height: $dot-size;
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
