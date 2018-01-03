<template>
  <div class="form-inline">
    <div class="bc-optional-main">
      <label class="m-right-mlg" v-for="(optional, index) in fOptionals.list">
        <span class="custom-checkbox">
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

    computed: mapState({
      fOptionals: function() {
        return this.optionals
      }
    }),

    methods: {
      change() {
        this.$emit('positionChange', this.fOptionals);
      }
    },
    mounted: function() {
      this.$emit('positionChange', this.fOptionals);
    }
  }
</script>

<style scoped>
  .bc-optional-main {
    margin: 15px 0;
  }
</style>
