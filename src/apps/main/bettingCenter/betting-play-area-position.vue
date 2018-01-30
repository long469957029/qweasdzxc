<template>
  <div class="form-inline">
    <div class="bc-optional-main">
      <label class="m-right-mlg" v-for="(optional, index) in optionals.list">
        <span class="custom-checkbox">
          <input type="checkbox" :id="'position-' + index" class="js-bc-playArea-position-item" name="optional"
                 :value="optional.id" v-model="optional.checked">
          <label class="checkbox-label" :for="'position-' + index"></label>
        </span>
        {{optional.title}}
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "betting-play-area-position",
    props: {
      optionals: Object,
      value: Array
    },

    watch: {
      optionals: {
        handler(currentOptionals) {
          const selectedList = currentOptionals.list.filter(optional => optional.checked);
          this.$emit('input', _(selectedList).pluck('id'))
        },
        immediate: true,
        deep: true,
      }
    },
  }
</script>

<style scoped>
  .bc-optional-main {
    margin: 10px 0 0;
  }
</style>
