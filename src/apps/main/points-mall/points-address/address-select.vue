<template>
  <div class="address-select">
    <div class="address-main">
      <div class="address-cell"
           :class="[{'address-cell-default': !!address.isDef}, {selected: selectedAddress.rid === address.rid}]"
           v-for="address in addressList"
           :key="address.rid">
        <div class="default-address" v-if="address.isDef">默认</div>
        <div class="cell-select">
        <span class="custom-radio radio-inverse">
          <input type="radio" :id="address.rid" v-model="selectedAddress" :value="address">
          <label :for="address.rid"></label>
        </span>
        </div>
        <div class="cell-name">
          {{address.name}}
        </div>
        <div class="cell-location">
          {{address.provinceName}} {{address.cityName}} {{address.areaName}}
          {{address.address}}
        </div>
        <div class="cell-phone">
          {{address.phone}}
        </div>
        <div class="cell-operate">
          <div class="address-edit" @click="edit(address)">
            <span class="address-edit-icon"></span>
            修改
          </div>
          <div class="address-delete" @click="deleteAddress(address)">
            <span class="address-delete-icon"></span>
            删除
          </div>
        </div>
      </div>
    </div>
    <div class="btn-panel">
      <button type="button" class="btn address-confirm-btn" @click="addressConfirm">确定</button>
    </div>
  </div>
</template>

<script>
  import {addressDeleteApi} from 'api/points'

  export default {
    name: 'address-select',

    props: {
      addressList: {
        type: Array,
        default() {
          return {}
        }
      }
    },

    data() {
      return {
        selectedAddress: _.findWhere(this.addressList, {
          isDef: 1
        })
      }
    },

    methods: {
      edit(address) {
        this.$emit('edit', address)
      },

      deleteAddress(address) {
        addressDeleteApi({
          rid: address.rid
        }, ({data}) => {
          if (data && data.result === 0) {
            Global.ui.notification.show(`<div class="m-bottom-lg">删除地址成功!</div>`, {
              type: 'success',
              hasFooter: false,
              displayTime: 1000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })
            this.$emit('refresh')
          }
        })
      },

      addressConfirm() {
        this.$emit('address-selected', this.selectedAddress)
      }
    },
  }
</script>

<style lang="scss" scoped>

  //修改
  .address-edit-icon {
    background-image: url(../points-records/misc/address-edit.png);
    width: 14px;
    height: 14px;
    display: inline-block;
  }

  .address-delete-icon {
    background-image: url(../points-records/misc/address-delete.png);
    width: 15px;
    height: 15px;
    display: inline-block;
  }

  .address-select {
    margin-top: 10px;
  }

  .address-main {
    display: flex;
    flex-direction: column;
    height: 349px;
    overflow: auto;
    padding-top: 1px;
  }

  .address-cell {
    display: flex;
    position: relative;
    flex: 0 0 72px;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
    margin-top: -1px;
    &:first-of-type {
      border-top: 1px solid transparent;
    }
    &.selected {
      border: 1px solid #e6e6e6;
    }
  }

  .default-address {
    position: absolute;
    width: 70px;
    height: 17px;
    line-height: 17px;
    background-color: #14b1bb;
    color: #ffffff;
    top: 9px;
    right: -23px;
    transform: rotate(51deg);
    text-align: center;
  }

  .cell-select {
    flex: 0 0 34px;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .cell-name {
    flex: 0 0 62px;
  }

  .cell-location {
    flex: 0 0 225px;
  }

  .cell-phone {
    flex: 0 0 110px;
  }

  .cell-operate {
    flex: 1;
    display: flex;
  }

  .address-edit {
    display: flex;
    align-items: center;
    flex: 1;
    color: #666666;
    cursor: pointer;
  }

  .address-delete {
    display: flex;
    align-items: center;
    color: #666666;
    margin-right: 20px;
    cursor: pointer;
  }

  .address-edit-icon {
    margin-right: 5px;
  }

  .address-delete-icon {
    margin-right: 5px;
  }

  .btn-panel {
    text-align: center;
    margin-top: 36px;
    margin-bottom: 50px;
  }

  .address-confirm-btn {
    width: 360px;
    height: 54px;
    background-color: #14b1bb;
    border-radius: 3px;
  }
</style>
