<template>
  <div class="betting-vouchers">
    <span class="sfa sfa-bc-vouchers" @click="togglePopover"></span>
    <div class="vouchers-popover" :class="{in: show}">
      <div class="arrow"></div>
      <div class="popover-content">
        <div class="vouchers-title">
          <label>
            <custom-checkbox v-model="systemRecommend"></custom-checkbox>
            系统推荐
          </label>
          <div class="title-right">
            代金券 <span class="text-prominent">3</span> 张，<span class="text-prominent">2</span> 张可用
          </div>
        </div>
        <div class="vouchers-main">
          <div class="vouchers-unit" v-for="(item, i) in list">
            <!--{-->
            <!--"rid": 35,-->
            <!--"ticketId": 1,-->
            <!--"betAmount": 1000000,-->
            <!--"bonus": 100000,-->
            <!--"validStartDate": 1517370920705,-->
            <!--"validEndDate": 1517821199000-->
            <!--},-->
            <div class="unit-left sfa-bc-vouchers-usable">
              ¥{{item.bonus | convert2yuan}}
            </div>
            <div class="unit-right">
              <div class="unit-comment">单笔投注满{{item.betAmount | convert2yuan}}元即可用</div>
              <div class="unit-expired">有效期至 {{item.validEndDate | toTime}}</div>
            </div>
          </div>
          <div class="vouchers-unit">
            <div class="unit-left sfa-bc-vouchers-disabled">
              ¥20
            </div>
            <div class="unit-right">
              <div class="unit-comment">单笔投注满30元即可用</div>
              <div class="unit-expired">有效期至 2017-10-19 17:54:42</div>
            </div>
          </div>
          <div class="vouchers-unit">
            <div class="unit-left sfa-bc-vouchers-selected">
              ¥20
            </div>
            <div class="unit-right">
              <div class="unit-comment">单笔投注满30元即可用</div>
              <div class="unit-expired">有效期至 2017-10-19 17:54:42</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "betting-vouchers",

    data() {
      return {
        show: false,
        systemRecommend: false,
      }
    },

    methods: {
      togglePopover() {
        this.show = !this.show
      }
    },

    computed: {
      ...mapState({
        list(state) {
          return _.map(state.bettingVouchers.list, (item) => {
            return {
              selected: false,
              ...item
            }
          })
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
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
      width: 355px;
      height: 220px;
      transform-origin: top left;
      animation: q cubic-bezier(.22,.58,.12,.98) .4s;

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
      height: 160px;
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
      line-height: 37px;
      color: #108f97;
      margin-right: 15px;
      cursor: pointer;
    }

    .vouchers-unit {
      display: flex;
      flex-direction: row;
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .unit-expired {
      color: $font-auxiliary-color;
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
