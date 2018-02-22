<template>
  <div class="tool-cell">
    <span class="tool-title" v-if="title" v-html="title"></span>
    <component :is="type" @change="change" v-model="iValue" :options="options"></component>
  </div>
</template>

<script>
  import Dropdown from '../dropdown'
  import SelectGroup from '../select-group'
  import SortGroup from '../sort-group'

  export default {
    name: 'tool-cell',

    components: {
      'dropdown': Dropdown,
      'select-group': SelectGroup,
      'sort': SortGroup,
    },

    model: {
      event: 'change',
    },

    props: {
      value: {},
      //dropdown select-group sort
      type: {
        type: String,
        default: 'dropdown'
      },
      options: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        required: '',
        default: '',
      },
    },

    data() {
      return {
        iValue: this.value
      }
    },

    methods: {
      change(selected) {
        this.$emit('change', selected)
      }
    }

  }
</script>

<style lang="scss" scoped>
  .tool-cell {
    display: flex;
    align-items: center;

    .tool-title {
      font-size: 14px;
      margin-right: 12px;
    }
  }
</style>
