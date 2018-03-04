<template>
  <div class="bc-basic-rules bg-deep" :class="componentType || ''">
    <div class="tab-toolbar tab-pill tab-pill-deep">
      <div class="tab-title" v-if="title">{{title}}</div>
      <div :class="['tab-group',  !title ? 'no-margin' : '']">
        <span class="tab" :class="{active: rule.selected}" v-for="(rule, index) in rules" ref="tabs" @click="ruleChange(rule, index)"
            :key="index">
          <span class="tab-inner">{{rule.title}}</span>
        </span>
        <div class="underline" ref="underline"></div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "betting-rules",
    props: {
      type: String,
      id: Number,
      title: String,
      initialRules: Array,
      componentType: {
        type: String,
        default: ''
      },
    },

    data: function () {
      return {
        rules: []
      }
    },

    watch: {
      initialRules() {
        this.rules = this.initialRules

        this.$nextTick(() => {
          this.$_ruleSelect(this.rules[0], 0)
        })
      }
    },

    methods: {
      ruleChange(rule, index) {
        this.$_ruleSelect(rule, index)
      },
      $_ruleSelect(rule, index) {
        if (!rule) {
          return
        }
        this.rules.forEach(function (rule) {
          rule.selected = false
        })
        rule.selected = true

        this.$store.commit({
          type: types.SET_LEVEL,
          levelId: rule.id,
          levelName: rule.title
        });

        if (this.$refs.underline) {
          Velocity(this.$refs.underline, {
            left: this.$refs.tabs[index].offsetLeft,
            width: this.$refs.tabs[index].offsetWidth,
          })
        }
      }
    },

    // selectDefaultPlay() {
    //   let defaultSelectInfo = null
    //   if (this.ticketRuleId && this.ticketPlayId && !_.isUndefined(this.ticketRuleId) && !_.isUndefined(this.ticketPlayId)) {
    //     defaultSelectInfo = {
    //       lastPlayId: this.ticketPlayId,
    //       groupId: this.ticketRuleId,
    //     }
    //   } else {
    //     if (ticketInfo.lastPlayId) {
    //       const lastPlayId = ticketInfo.lastPlayId.toString()
    //       const groupId = lastPlayId.substring(0, lastPlayId.length - 4)
    //       defaultSelectInfo = {
    //         lastPlayId,
    //         groupId,
    //       }
    //     } else {
    //       defaultSelectInfo = self.options.ticketInfo.info.defaultSelectPlay.split(',')
    //     }
    //   }
    //
    //   if (!_(defaultSelectInfo).isEmpty()) {
    //     if (!_(defaultSelectInfo).isArray() && _(defaultSelectInfo).isObject()) {
    //       this.$basicRules.find(`.js-bc-basic-rule[data-id=${defaultSelectInfo.groupId}]`).trigger('click')
    //       this.$advanceRules.find(`.js-bc-advance-rule[data-id=${defaultSelectInfo.lastPlayId}]`).trigger('click')
    //     } else if (_(Number(defaultSelectInfo[0])).isFinite()) {
    //       this.$basicRules.find('.js-bc-basic-rule').eq(defaultSelectInfo[0]).trigger('click')
    //       if (_(Number(defaultSelectInfo[1])).isFinite()) {
    //         const levelRules = this.$advanceRules.find('.js-bc-rules-toolbar').eq(defaultSelectInfo[1])
    //
    //         if (_(Number(defaultSelectInfo[2])).isFinite()) {
    //           levelRules.find('.js-bc-advance-rule').eq(defaultSelectInfo[2]).trigger('click')
    //         }
    //       }
    //
    //       // 兼容默认玩法的中文名方式配置
    //     } else if (!_(Number(defaultSelectInfo[0])).isFinite() && _(defaultSelectInfo[0]).isString()) {
    //       const rule = _(this.$basicRules.find('.js-bc-basic-rule')).find((item) => {
    //         return $(item).html().indexOf(defaultSelectInfo[0]) >= 0
    //       })
    //       if (rule) {
    //         $(rule).trigger('click')
    //       }
    //     }
    //   } else {
    //     this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click')
    //   }
    // },
  }

</script>

<style lang="scss" scoped>
  .bc-basic-rules {
    height: 40px;
    .tab-group {
      padding-left: 0;
    }
  }
  .mmc {
    background-color: transparent;
    .tab {
      background-color: transparent !important;
      color: $new-inverse-color;
    }
    .tab-toolbar {
      padding-left: 20px;
    }
    .underline {
      position: absolute;
      height: 2px;
      width: 0;
      background-color: $new-main-deep-color;
      left: 0;
      bottom: 0;
    }
    .tab-toolbar.tab-pill.tab-pill-deep .tab {
      padding: 0 8px 0 9px;
    }
  }

</style>
