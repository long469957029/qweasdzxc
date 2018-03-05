<template>
  <div class="ticket-records">
    <search-grid :search-api="getMyGiftRecordsApi" :search-form="searchForm" data-prop="root.records"
                 :colgroup="[160, 290, 130, 330, 130, 160]" ref="searchGrid" :page-size="10"
    >
      <form class="m-TB-lg" slot="search-panel" ref="searchForm">
        <control-group>
          <control-cell title="时间"><div ref="timeset"></div></control-cell>
          <control-cell title="礼物名称">
            <input type="text" name="itemName" class="control-input">
          </control-cell>
          <button type="submit" class="btn control-btn" @click.prevent="$refs.searchGrid.search()">查询</button>
        </control-group>
      </form>
      <tr slot="thead">
        <th>兑换时间</th>
        <th>礼物</th>
        <th>参考价格</th>
        <th>收货信息</th>
        <th>消耗积分值</th>
        <th>状态</th>
      </tr>
      <tr slot="tbody" slot-scope="{row, index}" :key="index">
        <td>{{row.exchangeDate | toTime}}</td>
        <td style="padding-left: 40px;">
          <div class="text-left">
            <img :src="row.picUrl" class="gift-img" width="62" height="62">&nbsp;&nbsp;
            <span class="inline-block">{{row.itemName}}</span>
          </div>
        </td>
        <td>
          <template v-if="row.refPrice">
            {{row.refPrice | convert2yuan}}元
          </template>
        </td>
        <td class="text-left location-td">
          <div class="location">
            <div>收货人：{{row.exName ? row.exName : '暂无'}}</div>
            <div>联系电话：{{row.exPhone ? row.exPhone : '暂无'}}</div>
            <div>收货地址：{{row.exAddr ? row.exAddr : '暂无'}}</div>
          </div>
          <div class="location-edit" v-if="!row.exAddr" @click="addAddressOpen(row)"></div>
        </td>
        <td>
          {{row.requireIntegral | convert2yuan}}
        </td>
        <td>
          <template v-if="row.itemStatus === 0">
            未发货
          </template>
          <template v-else>
            <div class="text-center">
              {{row.exStore}}<br>
              {{row.exTradeId}}
            </div>
          </template>
        </td>
      </tr>

      <tr slot="tfoot" slot-scope="{resData}">
        <td>所有页总计</td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{resData.dataTotal && resData.dataTotal.totalIntegral | convert2yuan}}</td>
        <td></td>
      </tr>
    </search-grid>

    <div v-transfer-dom>
      <points-address v-model="isShowAddressModal" v-if="isShowAddressModal" type="select"
                      @address-selected="addAddress"
      ></points-address>
    </div>
  </div>
</template>

<script>
  import {getMyGiftRecordsApi, addAddressToGiftApi} from 'api/points'
  import {ControlGroup, ControlCell} from 'build'
  import PointsAddress from '../points-address'
  import Timeset from 'com/timeset'

  export default {
    name: 'gift-records',

    filters: {
    },

    components: {
      ControlGroup,
      ControlCell,
      PointsAddress,
    },

    data() {
      return {
        searchForm: {},
        itemInfo: {},
        getMyGiftRecordsApi,
        isShowAddressModal: false,
      }
    },

    methods: {
      addAddressOpen(itemInfo) {
        this.itemInfo = itemInfo
        this.isShowAddressModal = true
      },
      addAddress(addressInfo) {
        addAddressToGiftApi({
          itemId: this.itemInfo.itemId,
          addressId: addressInfo.rid,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.isShowAddressModal = false
            this.$store.dispatch(types.GET_USER_MALL_INFO)

            this.$refs.searchGrid.search()

            Global.ui.notification.show(`<div class="m-bottom-lg">添加地址成功!</div>`, {
              type: 'success',
              hasFooter: false,
              displayTime: 1000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })
          } else {
            Global.ui.notification.show(data.msg)
          }
        })
      },
    },

    mounted() {
      this.searchForm = this.$refs.searchForm
      new Timeset({
        el: this.$refs.timeset,
        startTime: 'startDate',
        endTime: 'endDate',
        startDefaultDate: _(moment().startOf('day')).toDate(),
        endDefaultDate: _(moment().endOf('day')).toDate(),
        startOps: {
          format: 'YYYY-MM-DD',
        },
        endOps: {
          format: 'YYYY-MM-DD',
        },
        showIcon: true,
      }).render()
    }
  }
</script>

<style lang="scss" scoped>
  .location-td {
    padding-left: 40px;
  }
  .location-edit {
    background-image: url(./misc/gift-records-edit.png);
    width: 21px;
    height: 20px;
    cursor: pointer;
    display: inline-block;
    float: right;
    margin-top: 20px;
    margin-right: 40px;
  }
  .location {
    display: inline-block;
  }
</style>
