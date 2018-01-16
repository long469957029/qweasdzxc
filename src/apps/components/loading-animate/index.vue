<template>
  <div class="height-100" v-html="loading"></div>
</template>
<script>
  export default {
    data() {
      return{
        loading: Global.ui.loader.get()
      }
    }
  }
</script>
