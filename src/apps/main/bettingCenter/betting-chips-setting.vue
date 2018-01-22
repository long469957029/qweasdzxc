<template>
<div class="betting-chips-setting">
  <div class="setting" @click="openSetting">
    <span class="setting-icon"></span>
    <span class="setting-title">筹码设置：</span>
  </div>
  <div class="chips-popover" :class="{in: show}">
    <div class="arrow"></div>
    <div class="popover-content">
      <span class="setting-title setting-title-setting">筹码设置</span>
      <div class="setting-group">
        <select class="chip-setting" v-for="i in 5" v-model="chips[i - 1]">
          <option v-for="n in 10" :value="n * Math.pow(10, i - 1)">{{n * Math.pow(10, i - 1)}}</option>
        </select>
      </div>
      <button class="btn btn-cool save-btn" @click="fadeSetting">
        确定
      </button>
    </div>
  </div>

  <div class="chips">
    <span class="chip" v-for="chip in chips" @click="addBetMoney(chip)">{{chip}}</span>
  </div>
</div>

</template>

<script>
  export default {
    name: "betting-chips-setting",

    props: {
      chips: Array,
    },

    data: function() {
      return {
        fChips: [5, 10, 200, 5000, 10000],
        show: false
      }
    },

    watch: {
      chips: {
        handler(newVal) {
          this.fChips = newVal
        }
      }
    },

    methods: {
      addBetMoney(chip) {
        this.$emit('addBetMoney', chip)
      },

      openSetting() {
        this.show = true
      },
      fadeSetting() {
        this.show = false
      }
    },

    mounted: function() {
      $(document).off(`click.chips-setting.${this._uid}`).on(`click.chips-setting.${this._uid}`, (e) => {
        if (!$.contains(this.$el, e.target)) {
          this.fadeSetting()
        }

      })
    }
  }
</script>

<style lang="scss" scoped>
  .betting-chips-setting {
    margin-right: 20px;
    position: relative;

    .setting {
      display: inline-block;
      cursor: pointer;
      transition: color .5s;

      :hover {
        color: $new-main-deep-color;
      }
    }
    .setting-icon {
      width: 26px;
      height: 27px;
      background: url(misc/chips-setting.png);
      display: inline-block;
    }
    .setting-title {
      font-size: 14px;
      color: $def-black-color;
      display: inline-block;
      position: relative;
      bottom: 8px;
    }
    .setting-title-setting {
      height: 27px;
      line-height: 27px;
      position: relative;
      top: -3px;
    }
    .chips {
      display: inline-block;
      position: relative;
      bottom: 10px;
    }

    .chip {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      line-height: 48px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      margin-right: 15px;
      position: relative;
      z-index: 1;

      &:before {
        content: '';
        position: absolute;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: inline-block;
        border: 2px solid #e6e6e6;
        z-index: -1;
        top: 3px;
        left: 3px;
      }
      &:after {
        content: '';
        position: absolute;
        width: 48px;
        height: 48px;
        top: 0;
        left: 0;
        border-radius: 50%;
        display: inline-block;
        z-index: -2;
        background-image: linear-gradient(#fefefe 0%, #f6f6f6 100%);
        transition: all .5s;
      }

      &:hover {
        color: $def-white-color;
        transition: color .5s;
        &:before {
          border: 2px solid #1198a1;
        }
        &:after {
          background-image: linear-gradient(0deg,
            #0f949c 0%,
            #1fa8b1 46%,
            #2ebcc5 100%);
        }
      }
    }

    .chips-popover {
      position: absolute;
      top: 40px;
      left: 5px;
      z-index: 10;
      display: none;
      width: 445px;
      padding: 15px 15px 5px;
      text-align: left;
      white-space: normal;
      border: 1px solid $def-gray-color;
      border-radius: 6px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
      background: #ffffff;

      &.in {
        display: block;
      }
      .arrow {
        position: absolute;
        display: block;
        width: 11px;
        height: 11px;
        border: 1px solid #999;
        background: #fff;
        z-index: -1;
        top: -7px;
        left: 60px;
        transform: rotate(45deg);
        float: left;
        border-right: none;
        border-bottom: none;
      }

      .setting-group {
        display: inline-block;
      }
      .chip-setting {
        width: auto;
        height: 27px;
        margin-right: 10px;
        font-size: 12px;
      }
      .save-btn {
        padding: 5px 18px;
        margin-right: 10px;
        vertical-align: top;
      }
    }
  }
</style>
