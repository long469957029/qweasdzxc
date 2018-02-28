<template>
  <x-dialog @modal-hidden="$emit('modal-hidden')" width="610px" :options="modalOptions">
    <div slot="head-main">
      <template v-if="currentModal === 'select'">
        <div class="address-select-title">
          <div class="select-title">收货地址</div>
          <button class="btn-address-add btn" @click="currentModal = 'have-select'">+收货地址</button>
        </div>
      </template>
      <template v-else>
        {{title}}
      </template>
    </div>
    <div class="modal-main">
      <!--选择收货地址-->
      <transition mode="out-in"
                  enter-active-class="animated-02s fadeIn"
                  leave-active-class="animated-02s fadeOut">
      <template v-if="currentModal === 'select'">
        <status-cell :has-data="addressList.length" :status="loadingStatus" height="440px">
          <address-select :address-list="addressList"
                          @refresh="getList" @edit="edit"
                          @address-selected="addressSelected"
          ></address-select>
        </status-cell>
      </template>
      <!--新增修改-->
      <template v-else>
        <div>
          <div class="address-tip">
            <span class="tip-icon"></span>
            <span class="tip-main">温馨提示：请准确提供您的收货信息以便我们发货</span>
          </div>
          <form class="address-add" action="javascript:void(0)" @submit="addressPush" ref="form">
            <div class="cell">
              <div class="address-title">收货人：</div>
              <div class="address-val">
                <input class="input-val" v-model="name" autocomplete="off" placeholder="收货人姓名" required/>
              </div>
            </div>
            <div class="cell">
              <div class="address-title">收货手机：</div>
              <div class="address-val">
                <input class="input-val" v-model="phone" autocomplete="off" placeholder="请填写手机号码" required
                       data-parsley-phone/>
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
              <textarea class="input-val" autocomplete="off" placeholder="请填写地址" v-model="address" required
                        data-parsley-length="[0, 100]"></textarea>
              </div>
            </div>
            <div class="cell">
              <div class="address-title"></div>
              <div class="address-val">
                <button type="submit" class="btn address-confirm-btn">确定</button>
                <div class="address-return" v-if="currentModal === 'have-select' && !_.isEmpty(addressList)"
                     @click="currentModal = 'select';clearModifyAddress()">返回上一步</div>
              </div>
            </div>
          </form>
        </div>
      </template>
      </transition>
    </div>
  </x-dialog>
</template>

<script>
  import {XAddress} from 'build'
  import {addressPushApi, getAddressListApi} from 'api/points'
  import AddressSelect from "./address-select";

  export default {
    name: 'points-address',

    components: {
      AddressSelect,
      XAddress
    },

    props: {
      currentAddress: {
        type: Object,
        default() {
          return {}
        }
      },

      type: {
        type: String,
        default: 'add'
      }
    },

    data() {
      return {
        modalOptions: {
          backdrop: 'static'
        },
        addressInfo: {},
        name: this.currentAddress.name,
        phone: this.currentAddress.orgPhone,
        province: this.currentAddress.province,
        city: this.currentAddress.city,
        area: this.currentAddress.area,
        address: this.currentAddress.address,
        rid: this.currentAddress.rid,
        isDef: this.currentAddress.isDef,
        parsley: null,
        currentModal: !_.isEmpty(this.addressList) ? 'select' : 'add',
        addressList: [],
        loadingStatus: 'loading'
      }
    },

    watch: {
      type: {
        handler(currentType) {
          if (currentType === 'select') {
            this.getList()

          }
        },
        immediate: true
      },
    },

    computed: {
      title() {
        if (this.currentModal !== 'select') {
          return !this.rid ? '添加收货地址' : '修改收货地址'
        }
      }
    },

    methods: {
      addressPush() {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进行此操作，请先注册正式游戏账号')
          return false
        }
        this.parsley = $(this.$refs.form).parsley({
          trigger: 'change',
        })
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
          address: this.address,
          isDef: this.isDef
        }, ({data}) => {
          if (data && data.result === 0) {
            if (this.currentModal === 'add') {
              this.$emit('operate-complete')
              this.clearModifyAddress()

              Global.ui.notification.show(`<div class="m-bottom-lg">${this.rid ? '修改' : '添加'}地址成功!</div>`, {
                type: 'success',
                hasFooter: false,
                displayTime: 1000,
                size: 'modal-xs',
                bodyClass: 'no-border no-padding',
                closeBtn: false,
              })

            } else if (this.currentModal === 'have-select') {
              this.$_getList()
                .then(() => {
                  //只有一个地址,并且是新增时时直接传数据
                  if (this.addressList.length === 1 && !this.rid) {
                    this.addressSelected(this.addressList[0])
                  } else {
                    this.clearModifyAddress()
                    this.currentModal = 'select'
                  }
                })
            }
          }
        })
      },

      addressSelected(selectedAddress) {
        this.$emit('address-selected', selectedAddress)
      },

      $_getList() {
        return getAddressListApi(({data}) => {
          if (data && data.result === 0) {
            this.addressList = data.root
          }
          return data
        })
      },

      getList() {
        this.loadingStatus = 'loading'

        this.$_getList()
          .then((data) => {
            if (data && data.result === 0) {
              this.currentModal = _.isEmpty(this.addressList) ? 'have-select' : 'select'
            }
          })
          .finally(() => {
            this.loadingStatus = 'completed'
          })
      },
      edit(address) {
        this.name = address.name
        this.phone = address.orgPhone
        this.province = address.province
        this.city = address.city
        this.area = address.area
        this.address = address.address
        this.rid = address.rid
        this.isDef = address.isDef
        this.currentModal = 'have-select'
      },

      clearModifyAddress() {
        this.name = ''
        this.phone = null
        this.province = null
        this.city = null
        this.area = null
        this.address = null
        this.rid = null
        this.isDef = null
      }
    },

    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
  .modal-main {
    padding: 22px 20px;
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
    align-items: center;
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


  .address-select-title {
    display: flex;
    align-items: center;
  }

  .select-title {
    padding-left: 20px;
    padding-right: 30px;
  }
  .btn-address-add.btn {
    width: 80px;
    height: 26px;
    font-size: 14px;
    padding: 4px 0;
  }
</style>
