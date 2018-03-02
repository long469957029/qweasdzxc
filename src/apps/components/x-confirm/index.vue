<template>
  <x-dialog>
    <div slot="all">
      <div class="type-icon"></div>
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
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
