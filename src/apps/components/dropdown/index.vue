<template>
  <a href="javascript:void(0)" class="tool-dropdown">
    <div class="title">{{selected.name}} <span class="fa fa-chevron-down"></span></div>
    <ul class="dropdown">
      <li class="dropdown-item" v-for="(option, index) in options" :key="index" @click="select(option)">{{option.name}}</li>
    </ul>
  </a>
</template>

<script>
  export default {
    name: 'dropdown',

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
  .tool-dropdown {
    position: relative;
    cursor: pointer;
    color: #333333;
    font-size: 14px;
    display: inline-block;

    .fa-chevron-down {
      margin-left: 5px;
    }


    &:hover {
      .dropdown {
        border: 1px solid $def-gray-color;
      }
      .dropdown-item {
        overflow: hidden;
        height: 30px;
        padding: 5px 10px;
        line-height: 30px;
        background: rgba(0, 0, 0, 0);
        white-space: nowrap;
        color: rgba(51, 51, 51, 1);
        /*transition: 0.5s height cubic-bezier(0.73, 0.32, 0.34, 1.5),*/
        /*0.5s padding cubic-bezier(0.73, 0.32, 0.34, 1.5),*/
        /*0.5s margin cubic-bezier(0.73, 0.32, 0.34, 1.5),*/
        /*0.5s 0.2s color, 0.2s background-color;*/

        visibility: visible;
      }
    }

    .title {
      height: 18px;
      width: 100px;
      text-align: center;
    }
    .dropdown {
      min-width: 100%;
      position: absolute;
      z-index: 100;
      background: #ffffff;
      border-radius: 4px;
      border: 0 solid transparent;
      list-style: none;
      /*transition: 0.5s padding, 0.5s border cubic-bezier(0.73, 0.32, 0.34, 1.5);*/
      top: 105%;
    }
    .dropdown-item {
      visibility: hidden;
      height: 0;
      padding-top: 0;
      padding-bottom: 0;
      margin: 0;
      color: rgba(51, 51, 51, 0);
      /*transition: 0.5s 0.1s height, 0.5s 0.1s padding, 0.5s 0.1s margin, 0.3s color, 0.6s visibility;*/
      z-index: 99;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }

  }

</style>
