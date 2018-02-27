<template>
  <div class="betting-vouchers" v-click-outside="hidePopover">
    <div class="sfa-bc-vouchers" @click.stop.prevent="togglePopover"></div>
    <div class="vouchers-popover" :class="{in: show}">
      <div class="arrow"></div>
      <div class="popover-content">
        <div class="vouchers-title">
          <label>
            <custom-checkbox v-model="systemRecommend"></custom-checkbox>
            系统推荐
          </label>
          <div class="title-right">
            代金券 <span class="text-prominent">{{list.length}}</span> 张，
            <span class="text-prominent">{{_.where(list, {available: true}).length}}</span> 张可用
          </div>
        </div>
        <transition-group name="flip-list" tag="div" class="vouchers-main">
          <div class="vouchers-unit" v-for="item in fList" :key="item.rid" @click="select(item)">
            <div class="unit-left" :class="[item.available ? 'sfa-bc-vouchers-usable' : 'sfa-bc-vouchers-disabled', {selected: item.selected}]"
            >
              ¥{{item.bonus | convert2yuan}}
            </div>
            <div class="unit-right">
              <div class="unit-comment">单笔投注满{{item.betAmount | convert2yuan}}元即可用</div>
              <div class="unit-expired">有效期至 {{item.validEndDate | toTime}}</div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>

  import {ClickOutside, TransferDom} from 'build'

  export default {
    name: "betting-vouchers",

    directives: {
      ClickOutside,
      TransferDom
    },

    props: {
      bettingMoney: {
        type: Number,
        default: 0
      },
    },

    data() {
      return {
        show: false,
        systemRecommend: false,
        fList: []
      }
    },

    watch: {
      list: {
        handler() {
          this.fList = this.list
          this.$emit('input', {})
        },
        immediate: true
      },
      bettingMoney() {
        this.fList = _.chain(this.fList).each((item) => {
          item.available = this.bettingMoney > item.betAmount
          if (item.selected && !item.available) {
            item.selected = false
            this.$emit('input', {})
          }

        }).sortBy((item) => {
          if (item.available) {
            return true
          } else {
            return item.validEndDate
          }
        }).value()
      },

      systemRecommend(systemRecommend) {
        if (systemRecommend) {
          const maxItem = _.chain(this.fList).filter((item) => {
            return item.available
          }).max((item) => {
            return item.bonus
          }).value()

          if (!_.isEmpty(maxItem)) {
            const maxItemList = _.filter(this.fList, (item) => {
              return maxItem.bonus === item.bonus
            })

            let recommend = _.min(maxItemList, (item) => {
              return item.validEndDate
            })

            this.select(recommend, {
              isEvent: false,
              toggle: true
            })
          }
        } else {
          this.clearSelect()
        }
      }
    },

    methods: {
      hidePopover() {
        this.togglePopover({toggle: false})
      },
      togglePopover({toggle} = {}) {
        this.show = !_.isUndefined(toggle) ? toggle : !this.show
      },

      clearSelect() {
        _.chain(this.fList).each((item) => {
          item.selected = false
        })
      },

      select(selectItem, {
        isEvent = true,
        toggle = false,
      } = {}) {
        if (!selectItem.available) {
          return
        }
        if (isEvent) {
          this.systemRecommend = false

          this.$nextTick(() => {
            this.$_setSelect(selectItem, {
              toggle
            })
          })
          return
        }

        this.$_setSelect(selectItem, {
          toggle
        })
      },

      $_setSelect(selectItem, {
        toggle
      }) {
        this.fList.forEach((item) => {
          if (selectItem !== item) {
            item.selected = false
          } else {
            item.selected = toggle ? true : !item.selected

            this.$emit('input', item.selected ? item : {})
          }
        })
      }
    },

    computed: {
      ...mapState({
        list(state) {
          return _.chain(state.bettingVouchers.list).map((item) => {
            return {
              available: false,
              selected: false,
              ...item
            }
          }).sortBy((item) => {
            return !item.available
          }).value()
        }
      })
    },

    beforeDestroy() {
      this.$emit('input', {})
    }
  }
</script>

<style lang="scss" scoped>
  @import '~base/styles/_spritesBC';

  .betting-vouchers {
    display: inline-block;
    position: relative;

    .vouchers-popover {
      position: absolute;
      top: 40px;
      left: 5px;
      z-index: 10;
      display: none;
      padding: 15px 15px 5px;
      text-align: left;
      white-space: normal;
      border: 1px solid $def-gray-color;
      border-radius: 6px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
      background: #ffffff;
      width: 324px;
      height: 220px;
      transform-origin: top left;
      animation: q cubic-bezier(.22,.58,.12,.98) .4s;
      box-sizing: border-box;

      &.in {
        display: block;
      }

      .arrow {
        position: absolute;
        display: block;
        width: 11px;
        height: 11px;
        border: 1px solid $def-gray-color;
        background: #fff;
        z-index: -1;
        top: -7px;
        left: 30px;
        transform: rotate(45deg);
        float: left;
        border-right: none;
        border-bottom: none;
      }
    }
    .sfa-bc-vouchers {
      cursor: pointer;
    }

    .vouchers-main {
      overflow: auto;
      height: 140px;
    }

    .vouchers-title {
      display: flex;
      padding-bottom: 5px;
      margin-bottom: 15px;
      border-bottom: 1px dashed $im-line-color;
    }

    .vouchers-title label {
      flex: 1;
      font-size: 12px;
      color: #333333;
    }

    .title-right {
      color: $font-auxiliary-color;
    }

    .unit-left {
      font-size: 14px;
      text-align: center;
      line-height: 32px;
      color: #108f97;
      margin-right: 15px;
    }

    .unit-right {
      line-height: 16px;
    }

    .unit-comment {
      color: #484848;
    }

    .vouchers-unit {
      display: flex;
      flex-direction: row;
      margin-bottom: 20px;
      cursor: pointer;
      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .unit-expired {
      color: $font-auxiliary-color;
    }

    .sfa-bc-vouchers-disabled {
      color: $font-auxiliary-color;
    }
  }


  .flip-list-move {
    transition: transform 1s;
  }

  .flip-list-leave-active {
    transition: opacity 0.3s;
    opacity: 0;
    position: absolute;
  }

  .sfa-bc-vouchers-usable {
    &.selected {
      @include sprite($sfa-bc-vouchers-selected);
    }
  }

  @keyframes q {
    0% {
      transform: scale(0)
    }

    50% {
      transform: scale(1.1)
    }

    to {
      transform: scale(1)
    }
  }

</style>
