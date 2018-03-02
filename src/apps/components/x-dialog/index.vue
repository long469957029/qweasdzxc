<template>
  <transition
    @after-enter="afterEnter" :duration="{enter: 1}"
    leave-active-class="out"
  >
    <div class="x-modal fade hide" :class="[type, styles]" ref="modal" :style="`width: ${width}`" role="dialog"
         aria-hidden="true">
      <slot name="all">
        <slot name="head">
          <div class="x-modal-header">
            <a data-dismiss="modal" class="close btn-close">×</a>
            <slot name="head-main"></slot>
          </div>
        </slot>
        <slot name="body">
          <div class="x-modal-body">
            <slot></slot>
          </div>
        </slot>

        <slot name="footer" v-if="showFooter">
          <div class="x-modal-footer">
            <slot name="footer-main"></slot>
          </div>
        </slot>
      </slot>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'x-dialog',

    props: {
      width: {
        type: String,
        default: 'auto'
      },
      showFooter: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      styles: {
        type: String,
        default: 'x-modal-default'
      },
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },

    methods: {
      afterEnter() {
        this.$nextTick(() => {
          $(this.$refs.modal).modal(this.options)
            .on('hidden.modal', () => {
              this.$emit('modal-hidden')
            })
        })
      },
    },

    beforeDestroy() {
      $(this.$refs.modal).modal('hide')
    }
  }
</script>

<style lang="scss" scoped>
  .x-modal {
    position: fixed;
    left: 50%;
    z-index: 1050;
    transform: translate(-50%, 0) translateZ(0);
    outline: 0;
    background-clip: padding-box;
    color: #333333;
    &.x-modal-default {
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    }

    &.fade {
      top: -25%;
      transition: opacity .3s linear, top .3s ease-out;
      &.in {
        top: 10%;
      }
      &.v-out {
        top: -25%;
        opacity: 0;
      }
    }

    &.arc {
      .x-modal-header {
        background: url(./arc-header.png) no-repeat;
        width: 480px;
        height: 67px;
        padding: 0;
        border-bottom: 0;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
        line-height: 65px;
      }

    }
  }

  .x-modal-header {
    padding: 0 45px;
    border-bottom: 1px solid #eee;
    color: #333333;
    font-size: 16px;
    background-color: #f0f0f0;
    height: 50px;
    line-height: 50px;
    border-radius: 6px 6px 0 0;

    .close {
      margin-top: 2px;
    }
  }

  .x-modal-body {
    position: relative;
    /*max-height: 400px;*/
    overflow-y: auto;
  }

  .x-modal-form {
    margin-bottom: 0;
  }

  .x-modal-footer {
    padding: 14px 15px 15px;
    margin-bottom: 0;
    text-align: right;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    border-radius: 0 0 6px 6px;
    box-shadow: inset 0 1px 0 #fff;

    &:before, &:after {
      display: table;
      line-height: 0;
      content: "";
    }
    &:after {
      clear: both;
    }
  }


</style>
