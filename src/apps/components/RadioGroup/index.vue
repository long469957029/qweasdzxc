<template>
  <div class="radio-group">
    <div class="radio-group-ui"></div>
    <label class="radio" v-for="radio in radioList" :class="{active: value === radio.value}">
      <input type="radio" name="blah" :value="radio.value" @change="change($event.target.value)"> {{radio.title}}
    </label>
  </div>
</template>

<script>
  export default {
    name: "radio-group",

    model: {
      event: 'change'
    },

    props: {
      value: Number,
      radioList: Array
    },

    methods: {
      change(value) {
        this.toggleActiveRadios();
        this.moveUiToActiveRadio();
        this.$emit('change', Number(value))
      },
      toggleActiveRadios() {
        $(this.$el).find('.radio').each(function() {
          if ($(this).find('input').is(':checked')) {
            $(this).addClass('active');
          } else {
            $(this).removeClass('active');
          }
        });
      },
      moveUiToActiveRadio() {
        $(this.$el).each(function() {
          var left = $(this).find('.radio.active').offset().left - $('.radio-group').offset().left;
          var margin = ($(this).outerWidth() - ($(this).find('.radio').length * $(this).find('.radio').outerWidth())) / 4;
          $(this).find('.radio-group-ui').animate({
            left: left - margin - 1.5 + 'px'
          }, 200);
        });
      }
    },
  }
</script>

<style lang="scss" scoped>


  .radio-group {
    box-sizing:border-box;
    display: inline-flex;
    border-radius: 50px;
    height: 26px;
    min-width: 200px;
    background: $sec-line-color;
    position: relative;
    border: 1px solid $def-gray-color;

    input {
      display: none;
    }


    .radio-group-ui, .radio {
      width: 55px;
      height: 24px;
      line-height: 24px;
      border-radius: 40px;
      cursor: pointer;
      text-align: center;
      top: 1px;
    }

    .radio {
      position: relative;

      &:not(:last-child) {
        margin-right: 0;
      }

      &.active{
        color: $new-main-deep-color;
      }
    }

    .radio-group-ui {
      border: 1px solid $new-main-deep-color;
      top: -1px;
      position: absolute;
      left: 0;
      background: #fff;
    }
  }
</style>
