<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="modal">
    <div class="modal-title">
      <slot name="title"></slot>
    </div>
    <slot name="body"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
  export default {
    name: 'x-dialog',

    mounted() {
      $(this.$refs.modal).modal()
        .on('hidden.modal', () => {
          this.showChaseModal = false
        })
    }
  }
</script>

<style scoped>

</style>
