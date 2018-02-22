<template>
  <div class="sort-group">
    <span class="sort-btn" v-for="(option, index) in iOptions" :key="index"
          :class="{active: value.sortFlag === option.sortFlag}"
          @click="select(option)">
      <span class="btn-name">
      {{option.name}}
      </span>
      <span class="sort-icon fa" :class="value.sortFlag === option.sortFlag ? currentSortIcon : option.sortIcons.default"></span>
    </span>
  </div>
</template>

<script>

  const SORT_ICON = {
    sort: {
      up: 'fa-sort-up',
      down: 'fa-sort-down',
      default: 'fa-sort'
    },
    arrow: {
      up: 'fa-long-arrow-up',
      down: 'fa-long-arrow-down',
      default: 'fa-long-arrow-down'
    }
  }

  export default {
    name: 'sort-group',

    model: {
      event: 'change',
    },

    props: {
      value: {
      },
      /**
       * sortFlag: 2,
       * name: '所需积分',
       * sortType: 0,
       * type: 'sort',
       */
      options: {
        type: Array,
        required: true
      },
    },

    computed: {
      iOptions() {
        return _.map(this.options, option => {
          return {...option, sortIcons: SORT_ICON[option.type]}
        })
      },
      selected() {
        return _.findWhere(this.iOptions, {
          sortFlag: this.value.sortFlag
        })
      },
      currentSortIcon() {
        return this.value.sortType === 0 ? this.selected.sortIcons.down : this.selected.sortIcons.up
      },
    },

    methods: {
      select(option) {
        //第多次点击
        let sortType
        if (this.selected === option) {
          if (!_.isUndefined(option.sortType)) {
            sortType = option.sortType
          } else {
            sortType = this.value.sortType === 0 ? 1: 0
          }
        } else {
          sortType = 0
        }

        this.$emit('change', {
          sortFlag: option.sortFlag,
          sortType,
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sort-btn {
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
