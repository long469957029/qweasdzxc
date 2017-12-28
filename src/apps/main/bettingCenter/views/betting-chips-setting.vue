<template>
<div class="betting-chips-setting">
  <div class="setting" @click="openSetting">
    <span class="setting-icon"></span>
    <span class="">筹码设置</span>
  </div>
  <div class="chips">
    <span v-for="chip in chips">{{chip}}</span>
  </div>
</div>

</template>

<script>
  export default {
    name: "betting-chips-setting",

    data: function() {
      return {
        chips: [5, 10, 200, 5000, 10000]
      }
    },

    methods: {
      openSetting() {

      },
      saveSetting() {

      }
    }
  }
</script>

<style scoped>
</style>
