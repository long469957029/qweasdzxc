<template>
  <div class="x-address">
    <select class="input-select">
      <option disabled selected>省</option>
    </select>
    <select class="input-select">
      <option disabled selected>市</option>
    </select>
    <select class="input-select">
      <option disabled selected>区</option>
    </select>
  </div>
</template>

<script>
  import {getProvinceApi, getCityApi, getAreaApi} from 'api/address'
  export default {
    name: 'x-address',

    props: {

    },

    data() {
      return {
        province: null,
        city: null,
        area: null
      }
    },
  }
</script>

<style lang="scss" scoped>

  .x-address {
    display: flex;
    flex: 1 0 0;
    justify-content: space-between;
  }

  .input-select {
    height: 46px;
    background-color: #f8f8f8;
    border-radius: 3px;
    border: solid 1px #e6e6e6;
    width: auto;
    flex: 30% 0 0;
  }

</style>
