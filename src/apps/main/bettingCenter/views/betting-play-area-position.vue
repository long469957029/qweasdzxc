<template>
  <div class="form-inline tab-toolbar">
    <div class="bc-optional-main">
      <label class="m-right-mlg" v-for="(optional, index) in optionals.list">
        <span class="custom-checkbox checkbox-pleasant">
          <input type="checkbox" :id="'position-' + index" class="js-bc-playArea-position-item" name="optional" @change="change"
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
      optionals: Object
    },

    methods: {
      change() {
        this.$emit('positionChange', this.optionals);
      }
    }
  }
</script>

<style scoped>

</style>
