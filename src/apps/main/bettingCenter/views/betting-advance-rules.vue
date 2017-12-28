<template>
  <div class="bc-advance-rules p-top-smd pull-left">
    <div class="tab-toolbar tab-pill tab-pill-main" v-for="(rules, index) in rulesList">
      <div class="tab-title" v-if="rules.title">{{rules.title}}</div>
      <div :class="['tab-group',  !rules.title ? 'no-margin' : '']">
      <span class="tab" :class="{active: rule.selected}" v-for="rule in rules.playList" @click="ruleChange(rule, rules, index)">
        <span class="tab-inner">{{rule.title}}</span>
      </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "betting-advance-rules",

    data: function() {

      return {
        rulesList: []
      }
    },

    watch: {
      levelId: {
        handler(newVal, oldVal) {
          this.rulesList = this.$store.getters.playGroups(newVal)


          const rules = this.rulesList[0]

          ruleSelect(this, rules.playList[0], rules, 0)
          // this.$set(this.rulesList, 0, rules)
          this.$emit('modeChange', _.chain(this.rulesList).pluck('playList').flatten().value().length === 1 ? 'single' : 'classic')
        }
      }
    },

    computed: mapState({
      levelId () {
        return this.$store.state.bettingChoice.levelId
      }
    }),

    methods: {
      ruleChange(rule, rules, index) {
        ruleSelect(this, rule, rules, index)
      }
    },
  }

  function ruleSelect({rulesList, $store, $set}, rule, rules, index) {
    if (!rule) {
      return
    }

    //目前默认选中第一个玩法
    rulesList.forEach(function(rules) {
      rules.playList.forEach(function(rule) {
        rule.selected = false
      });
    })
    rule.selected = true
    $set(rulesList, index, rules)

    $store.commit({
      type: types.SET_PLAY,
      groupId: rules.id,
      groupName: rules.title,
      playId: rule.id,
      playName: rule.title
    });
  }
</script>

<style scoped>

</style>
