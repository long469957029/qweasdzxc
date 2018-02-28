<template>
  <select class="x-select" v-model="selected">
    <option v-for="option in options" :value="option.value">
      {{option.text}}
    </option>
  </select>
</template>

<script>
  export default {
    name: 'x-select',

    props: {
      value: '',
      options: {
        type: Array,
      }
    },

    data() {
      return {
        selected: this.value
      }
    },

    watch: {
      selected: {
        handler(selected) {
          this.$emit('input', selected)
        }
      }
    }
  }
</script>

<style scoped>

</style>
