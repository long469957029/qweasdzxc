<template>
  <div class="x-modal hide fade" ref="modal">
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

      <slot name="footer">
        <div class="x-modal-footer">
          <slot name="footer-main"></slot>
        </div>
      </slot>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'x-dialog',

    mounted() {
      $(this.$refs.modal).modal()
        .on('hidden.modal', () => {
          this.$emit('modal-hidden')
        })
    }
  }
</script>

<style lang="scss" scoped>
  .modal-x-body {
    position: relative;
    max-height: 400px;
    padding: 15px;
    overflow-y: auto;
  }

  .x-modal {
    position: fixed;
    top: 10%;
    left: 50%;
    z-index: 1050;
    transform: translate(-50%, 0);
    background-color: #fff;
    border-radius: 6px;
    outline: 0;
    box-shadow: 0 3px 7px rgba(0,0,0,0.3);
    background-clip: padding-box;
    color: #333333;

    &.fade {
      top: -25%;
      transition: opacity .3s linear,top .3s ease-out;
      &.in {
        top: 10%;
      }
    }
  }

  .x-modal-header {
    padding: 9px 15px;
    border-bottom: 1px solid #eee;

    .close {
      margin-top: 2px;
    }
  }

  .x-modal-body {
    position: relative;
    max-height: 400px;
    padding: 15px;
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

    &:before,&:after {
      display: table;
      line-height: 0;
      content: "";
    }
    &:after {
      clear: both;
    }
  }

</style>
