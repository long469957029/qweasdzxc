<template>
  <div class="address-manage-panel">
    <div class="address-top">
      <span class="title">
        已保存的收货地址
      </span>
      <span class="detail">
        您已经创建<span class="text-cool">{{addressList.length}}</span>个收货地址，最多可创建<span class="text-cool">10</span>个
      </span>
    </div>

    <div class="address-main">
      <div class="address-cell" :class="{'address-cell-default': !!address.isDef}" v-for="address in addressList" :key="address.rid">
        <div class="default-address">默认地址</div>
        <div class="cell-top">
          <div class="top-left">
            <span class="user-avatar"></span>
            {{address.name}}
          </div>
          <div class="top-right" @click="setDefault(address)">设为默认地址</div>
        </div>
        <div class="cell-main">
          <span class="location-icon"></span>
          <span class="location-detail">
            {{address.provinceName}} {{address.cityName}} {{address.areaName}}
            {{address.address}}
          </span>
        </div>
        <div class="cell-bottom">
          <div class="bottom-left">
            <span class="phone-icon"></span>
            <span class="phone-detail">{{address.phone}}</span>
          </div>
          <div class="bottom-right">
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

      <div class="address-add cursor-pointer" @click="add">
        <div class="add-icon"></div>
        <div class="add-brief">添加收货地址</div>
      </div>
    </div>
    <div v-transfer-dom>
      <points-address v-if="isShowAddressModal" :current-address="address" @operate-complete="refresh" @modal-hidden="isShowAddressModal = false"></points-address>
    </div>
  </div>
</template>

<script>
  import {getAddressListApi, addressDeleteApi, setDefaultAddressApi} from 'api/points'
  import PointsAddress from '../points-address'

  export default {
    name: 'address-manage',

    components: {
      PointsAddress
    },

    data() {
      return {
        isShowAddressModal: false,
        addressList: [],
        address: {},
        maxCount: 10,
      }
    },

    methods: {
      getList() {
        getAddressListApi(({data}) => {
          if (data && data.result === 0) {
            this.addressList = data.root
          }
        })
      },

      refresh() {
        this.isShowAddressModal = false
        this.getList()
      },

      add() {
        if (this.addressList.length > this.maxCount) {
          Global.ui.notification.show(`<div class="m-bottom-lg">地址已经达到最大数量!</div>`, {
            type: 'success',
            hasFooter: false,
            displayTime: 1000,
            size: 'modal-xs',
            bodyClass: 'no-border no-padding',
            closeBtn: false,
          })

          return false
        }
        this.address = {}
        this.isShowAddressModal = true
      },

      edit(address) {
        this.address = address
        this.isShowAddressModal = true
      },

      setDefault(address) {
        setDefaultAddressApi({
          rid: address.rid
        }, ({data}) => {
          if (data && data.result === 0) {
            Global.ui.notification.show(`<div class="m-bottom-lg">设置默认地址成功!</div>`, {
              type: 'success',
              hasFooter: false,
              displayTime: 1000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })

            this.refresh()
          }
        })
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
            this.refresh()
          }
        })
      }
    },

    mounted() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  .address-manage-panel {

    .address-main {
      display: flex;
      flex-flow: row wrap;
    }

    .address-cell {
      background-image: url(./misc/address-border.png);
      width: 343px;
      height: 202px;
      margin-right: 30px;

      &:nth-of-type(3n) {
        margin-right: 0;
      }

      .default-address {
        display: none;
      }

      &.address-cell-default {
        background-image: url(./misc/address-border-selected.png);
        .top-right {
          display: none;
        }
        .default-address {
          display: flex;
        }
      }
    }

    .user-avatar {
      background-image: url(./misc/address-user.png);
      width: 17px;
      height: 21px;
      display: inline-block;
    }

    .phone-icon {
      background-image: url(./misc/address-phone.png);
      width: 14px;
      height: 20px;
      display: inline-block;
    }

    .location-icon {
      background-image: url(./misc/location.png);
      width: 17px;
      height: 23px;
      display: inline-block;
      flex: 0 0 auto;
    }

    .add-icon {
      background-image: url(./misc/address-add.png);
      width: 40px;
      height: 40px;
      display: inline-block;
    }

    .address-edit-icon {
      background-image: url(./misc/address-edit.png);
      width: 14px;
      height: 14px;
      display: inline-block;
    }

    .address-delete-icon {
      background-image: url(./misc/address-delete.png);
      width: 15px;
      height: 15px;
      display: inline-block;
    }
    .add-icon {
      background-image: url(./misc/address-add.png);
      width: 40px;
      height: 40px;
    }
  }


  .main-content {
    margin-top: 50px;
    margin-left: 20px;
  }

  .address-top {
    margin-bottom: 35px;
  }

  .title {
    font-size: 14px;
    color: #333333;
    margin-right: 10px;
  }

  .detail {
    color: #666666;
  }

  .address-cell {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 15px;
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }

  .cell-top {
    padding: 18px 0;
    display: flex;
    align-items: center;
    border-bottom: dotted 1px #e5e5e5;
  }

  .title {
    font-size: 14px;
    color: #333333;
  }

  .top-left {
    flex: 1;
    align-items: center;
    display: flex;
  }

  .top-right {
    font-size: 12px;
    color: #999999;
    cursor: pointer;
  }

  .cell-main {
    display: flex;
    align-items: flex-start;
    padding: 22px 0 0;
    height: 85px;
    box-sizing: border-box;
    border-bottom: dotted 1px #e5e5e5;
  }

  .location-icon {
    margin-right: 10px;
  }

  .cell-bottom {
    display: flex;
    padding: 17px 0;
  }

  .bottom-left {
    flex: 1;
    display: flex;
  }

  .bottom-right {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #666666;
    width: 105px;
  }

  .address-edit {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .address-delete {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .user-avatar {
    margin-right: 10px;
  }

  .default-address {
    position: absolute;
    right: -29px;
    top: -16px;
    transform: rotate(36deg);
    font-size: 12px;
    color: #ffffff;
    background: #14b1bb;
    height: 50px;
    width: 91px;
    text-align: center;
    align-items: flex-end;
    display: flex;
    justify-content: center;
  }

  .address-edit-icon {
    margin-right: 3px;
  }

  .address-delete-icon {
    margin-right: 3px;
  }

  .phone-icon {
    margin-right: 10px;
  }

  .address-add {
    width: 343px;
    height: 202px;
    border: solid 2px #e6e6e6;
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    box-sizing: border-box;
  }

  .add-brief {
    font-size: 16px;
    color: #999999;
    margin-top: 10px;
  }

</style>
