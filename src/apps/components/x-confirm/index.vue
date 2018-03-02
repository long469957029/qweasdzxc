<template>
  <x-dialog>
    <div slot="all">
      <div class="main">
        <div class="type-icon">
          <div class="sfa warn"></div>
        </div>
        <div class="title">{{title}}</div>
        <div class="content">{{content}}</div>
      </div>
      <div class="btn-panel">
        <button class="btn" >{{btnConfirm}}</button>
        <button class="btn btn-link">{{btnReject}}</button>
      </div>
    </div>
  </x-dialog>
</template>

<script>
  import XDialog from '../x-dialog'

  export default {
    name: 'x-confirm',

    components: {
      XDialog
    },

    props: {
      type: 'warn',
      title: {
        type: String,
        default: '温馨提示'
      },
      content: {
        type: String,
        default: ''
      },
      confirm: {
        type: Function,
      },
      reject: {
        type: Function,
      },
      btnConfirm: {
        type: String,
        default: '确认'
      },
      btnReject: {
        type: String,
        default: '取消'
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
