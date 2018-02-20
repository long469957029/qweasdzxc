<template>
  <div class="address-manage-panel">
    <div class="address-top">
      <span class="title">
        已保存的收货地址
      </span>
      <span class="detail">
        您已经创建<span class="text-cool">4</span>个收货地址，最多可创建<span class="text-cool">10</span>个
      </span>
    </div>

    <div class="address-main">
      <div class="address-cell" v-for="i in 3">
        <div class="cell-top">
          <div class="top-left">
            <span class="user-avatar"></span>
            张三
          </div>
          <div class="top-right">设为默认地址</div>
        </div>
        <div class="cell-main">
          <span class="location-icon"></span>
          <span class="location-detail">
          北京市   昌平区  东小口地区  清水园
          7号楼2-501
          </span>
        </div>
        <div class="cell-bottom">
          <div class="bottom-left">
            <span class="phone-icon"></span>
            <span class="phone-detail">185****520</span>
          </div>
          <div class="bottom-right">
            <div class="address-edit">
              <span class="address-edit-icon"></span>
              修改
            </div>
            <div class="address-delete">
              <span class="address-delete-icon"></span>
              删除
            </div>
          </div>
        </div>
      </div>

      <div class="address-cell address-cell-default">
        <div class="default-address">默认地址</div>
        <div class="cell-top">
          <span class="user-avatar"></span>
          张三
        </div>
        <div class="cell-main">
          <span class="location-icon"></span>
          <span class="location-detail">
          北京市   昌平区  东小口地区  清水园
          7号楼2-501
          </span>
        </div>
        <div class="cell-bottom">
          <div class="bottom-left">
            <span class="phone-icon"></span>
            <span class="phone-detail">185****520</span>
          </div>
          <div class="bottom-right">
            <div class="address-edit">
              <span class="address-edit-icon"></span>
              修改
            </div>
            <div class="address-delete">
              <span class="address-delete-icon"></span>
              删除
            </div>
          </div>
        </div>
      </div>

      <div class="address-add">
        <div class="add-icon"></div>
        <div class="add-brief">添加收货地址</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'address-manage',

    data() {
      return {
      }
    },
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

      &.address-cell-default {
        background-image: url(./misc/address-border-selected.png);
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
  }

  .top-right {
    font-size: 12px;
    color: #999999;
    cursor: pointer;
  }

  .cell-main {
    display: flex;
    align-items: flex-start;
    padding: 22px 0;
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
