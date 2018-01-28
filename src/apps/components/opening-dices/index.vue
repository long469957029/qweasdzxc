<template>
  <div class="opening-dices">
    <dice v-for="i in counts" :key="i" ref="dices"></dice>
  </div>
</template>

<script>
  import Dice from '../dice'

  const positionList = [
    {
      x: 180,
      y: 0
    },
    {
      x: -90,
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

    components: {
      Dice
    },

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
          const curentDice = this.$refs.dices[i].getDice()
          if (this.init) {
            curentDice.style.transform = `rotateX(${pos.x}deg) rotateY(${pos.y}deg)`
          } else {
            _.delay(() => {
              this.rollingStatus[i] = true
              this._rolling(curentDice, i, 1, true)
            }, 500 * i)

            _.delay(() => {
              Velocity(curentDice, 'stop')


              Velocity(curentDice, {
                rotateX: pos.x,
                rotateY: pos.y,
              }, {
                duration: 1000,
                easing: 'ease-out',
                complete: () => {
                  this.rollingStatus[i] = false
                }
              })
            }, 1000 * i + 3500)
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

  .opening-dices {
    display: inline-block;
    .dice {
      margin-right: 15px;
    }
  }

</style>
