<template>
  <div class="select-group">
    <span class="select-btn" v-for="(option, index) in options" :key="index"
          :class="{active: value === option.id}"
          @click="select(option)">{{option.name}}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'select-group',

    model: {
      event: 'change',
    },

    props: {
      value: {
      },
      options: {
        type: Array,
        required: true
      },
    },

    computed: {
      selected() {
        return _.findWhere(this.options, {
          id: this.value
        })
      }
    },

    methods: {
      select(option) {
        this.$emit('change', option.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-btn {
    font-size: 14px;
    color: rgba(51, 51, 51, 0.7);
    padding: 2px 5px;
    text-align: center;
    cursor: pointer;
    margin-right: 10px;
    transition: all .3s;
    display: inline-block;

    &:last-of-type {
      margin-right: 0;
    }
    &.active {
      background-color: #14b1bb;
      border-radius: 4px;
      color: #fff;
    }
  }
</style>
