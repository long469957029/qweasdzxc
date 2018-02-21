<template>
  <x-dialog @modal-hidden="$emit('modal-hidden')" width="610px">
    <div slot="head-main">添加收货地址</div>
    <div class="modal-main">
      <div class="address-tip">
        <span class="tip-icon"></span>
        <span class="tip-main">温馨提示：请准确提供您的收货信息以便我们发货，在我们发货前您可以在礼物兑换列表修改您的收货信息</span>
      </div>
      <form class="address-add" action="javascript:void(0)" @submit="addressPush" ref="form">
        <div class="cell">
          <div class="address-title">收货人：</div>
          <div class="address-val">
            <input class="input-val" v-model="name" autocomplete="off" placeholder="收货人姓名" required />
          </div>
        </div>
        <div class="cell">
          <div class="address-title">收货手机：</div>
          <div class="address-val">
            <input class="input-val" v-model="phone" autocomplete="off" placeholder="请填写手机号码" required data-parsley-phone />
          </div>
        </div>
        <div class="cell">
          <div class="address-title">省市区：</div>
          <div class="address-val">
            <x-address v-model="addressInfo"
            :province="province"
            :city="city"
            :area="area"
            ></x-address>
          </div>
        </div>
        <div class="cell address-top">
          <div class="address-title">详细地址：</div>
          <div class="address-val">
            <textarea class="input-val" autocomplete="off" placeholder="请填写地址" v-model="address" required data-parsley-length="[0, 100]"></textarea>
          </div>
        </div>
        <div class="cell">
          <div class="address-title"></div>
          <div class="address-val">
            <button type="submit" class="btn address-confirm-btn">确定</button>
            <div class="address-return" v-if="type === 'have-select'">返回上一步</div>
          </div>
        </div>
      </form>
    </div>
  </x-dialog>
</template>

<script>
  import {XAddress} from 'build'
  import {addressPushApi} from 'api/points'

  export default {
    name: 'points-address',

    components: {
      XAddress
    },

    props: {
      type: {
        default: 'add'
      },
      currentAddress: {
        type: Object,
        default() {
          return {}
        }
      }
    },

    data() {
      return {
        addressInfo: {
        },
        name: this.currentAddress.name,
        phone: this.currentAddress.phone,
        province: this.currentAddress.province,
        city: this.currentAddress.city,
        area: this.currentAddress.area,
        address: this.currentAddress.address,
        rid: this.currentAddress.rid,
        parsley: null,
      }
    },

    methods: {
      addressPush() {
        if (!this.parsley.validate()) {
          return
        }

        addressPushApi({
          rid: this.rid,
          name: this.name,
          phone: this.phone,
          province: this.addressInfo.province.id,
          city: this.addressInfo.city.id,
          area: this.addressInfo.area.id,
          address: this.address
        }, ({data}) => {
          if (data && data.result === 0) {
            Global.ui.notification.show(`<div class="m-bottom-lg">${this.rid ? '修改' : '添加'}地址成功!</div>`, {
              type: 'success',
              hasFooter: false,
              displayTime: 1000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })
            if (this.type === 'add') {
              this.$emit('operate-complete')
            }
          }
        })
      }
    },

    mounted() {
      this.parsley = $(this.$refs.form).parsley({
        trigger: 'change',
      })
    }
  }
</script>

<style lang="scss" scoped>
  .modal-main {
    padding: 22px 33px;
  }
  .tip-icon {
    background-image: url(./tip-icon.png);
    width: 21px;
    height: 25px;
    display: block;
    margin-right: 5px;
  }

  .address-tip {
    background-color: #fffcee;
    border: solid 1px #edd28b;
    padding: 5px;
    color: #666666;
    display: flex;
  }

  .address-add {
    padding: 30px 30px 0;
  }

  .cell {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .address-title {
    width: 80px;
    text-align: right;
    font-size: 14px;
    color: #333333;
    flex: 100px 0 0;
    padding-right: 10px;
    box-sizing: border-box;
  }

  input.input-val {
    height: 46px;
    background-color: #f8f8f8;
    border-radius: 3px;
    border: solid 1px #e6e6e6;
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 10px 10px 22px;
  }

  textarea.input-val {
    height: 90px;
    background-color: #f8f8f8;
    border-radius: 3px;
    border: solid 1px #e6e6e6;
    width: 100%;
    resize: none;
    box-sizing: border-box;
    padding: 10px 10px 10px 22px;
  }
  .address-val {
    flex: 1 0 0;
  }

  .address-top {
    align-items: flex-start;
    .address-title {
      margin-top: 10px;
    }
  }

  .address-confirm-btn {
    height: 54px;
    background-color: #14b1bb;
    border-radius: 3px;
    width: 100%;
  }

  .address-return {
    margin-top: 10px;
    color: #666666;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
  }

</style>
