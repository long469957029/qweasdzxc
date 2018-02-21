<template>
  <div class="x-address">
    <div class="cell">
      <select class="input-select" v-model.number="iProvince" required>
        <option disabled selected value="">省</option>
        <option v-for="province in provinceList" :key="province.provinceId" :value="province.provinceId">{{province.province}}</option>
      </select>
    </div>
    <div class="cell">
    <select class="input-select" v-model.number="iCity" required>
      <option disabled selected value="">市</option>
      <option v-for="city in cityList" :key="city.cityId" :value="city.cityId">{{city.city}}</option>
    </select>
    </div>
    <div class="cell">
      <select class="input-select" v-model.number="iArea" required>
        <option disabled selected value="">区</option>
        <option v-for="area in areaList" :key="area.areaId" :value="area.areaId">{{area.area}}</option>
      </select>
    </div>
  </div>
</template>

<script>
  import {getAddressApi} from 'api/address'

  export default {
    name: 'x-address',

    model: {
      prop: 'address',
      event: 'change'
    },

    props: {
      address: Object,
      province: {
        default: ''
      },
      city: {
        default: ''
      },
      area: {
        default: ''
      },
    },

    data() {
      return {
        requestPromise: this.getAddress(),
        provinceList: [],
        iProvince: '',
        iCity: '',
        iArea: '',
        iAddress: {}
      }
    },

    watch: {
      requestPromise: {
        handler() {
          this.requestPromise.then(() => {
            this.iProvince = Number(this.province)
            this.$nextTick(() => {
              this.iCity = Number(this.city)
              this.$nextTick(() => {
                this.iArea = Number(this.area)
              })
            })
          })
        },
        immediate: true
      },

      iArea(iArea) {
        if (iArea) {
          const {area, areaId} = _.findWhere(this.areaList, {areaId: this.iArea})
          this.iAddress.area = {title: area, id: areaId}
          this.$emit('change', this.iAddress)
        }
      }
    },

    computed: {
      cityList() {
        if (this.iProvince) {
          const current = _.findWhere(this.provinceList, {provinceId: this.iProvince})

          this.iCity = this.iArea = ''
          this.iAddress.province = {title: current.province, id: current.provinceId}
          this.iAddress.city = {}
          this.iAddress.area = {}
          this.$emit('change', this.iAddress)

          return current.cityList
        } else {
          return []
        }
      },
      areaList() {
        if (this.iCity) {
          const current = _.findWhere(this.cityList, {cityId: this.iCity})

          this.iArea = ''
          this.iAddress.city = {title: current.city, id: current.cityId}
          this.iAddress.area = {}
          this.$emit('change', this.iAddress)

          return current.areaList
        } else {
          return []
        }
      },
    },

    methods: {
      getAddress() {
        return getAddressApi(({data}) => {
          if (data && data.result === 0) {
            this.provinceList = data.root
          }
        })
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

  .cell {
    flex: 30% 0 0;
  }

  .input-select {
    height: 46px;
    background-color: #f8f8f8;
    border-radius: 3px;
    border: solid 1px #e6e6e6;
    padding-left: 22px;
    /*flex: 30% 0 0;*/
    width: 100%;
  }

</style>
