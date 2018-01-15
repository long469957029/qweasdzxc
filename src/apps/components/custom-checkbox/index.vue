<template>
  <span class="custom-checkbox">
    <input type="checkbox" :id="uid"
           :value="value" @change="change" v-model="pChecked">
    <label class="checkbox-label" :for="uid"></label>
  </span>
</template>

<script>
  export default {
    name: "custom-checkbox",

    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      checked: Boolean,
      value: String
    },

    data() {
      return {
        pChecked: this.checked,
        uid: _.uniqueId()
      }
    },

    methods: {
      change() {
        this.$emit('change', this.pChecked)
      }
    }
  }
</script>

<style scoped>

</style>
