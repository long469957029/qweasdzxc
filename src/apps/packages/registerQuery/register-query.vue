<template>
  <div class="register-query">
    <form class="query-form">
      <div class="form-group hidden">
        <span class="data-title">用户名</span>
        <input type="text" name="username" class="input"/>
        <span class="data-title">链接ID</span>
        <input type="text" name="linkId" :value="linkId" class="input hidden"/>

        <!--<span class="data-title">手机</span>http://game.5x5x.info/register.html?linkId=729fe685061a40efbbda039b6f3f5cb9-->
        <!--<input type="text" name="mobile" class="input"/>-->
        <!--<span class="data-title">QQ</span>-->
        <!--<input type="text" name="qq" class="input"/>-->
        <!--<span class="data-title">微信</span>-->
        <!--<input type="text" name="wechat" class="input"/>-->
        <!--<span class="date-title">按日期</span>-->
        <!--<div class="date-panel timer-calendar-input timer-record-input">-->
        <!--<input type="text" ref="date" v-model="date"/>-->
        <!--<span class="timer-calendar sfa-icon-time" @click="$($refs.date).data('DateTimePicker').show()"></span>-->
        <!--</div>-->
        <button type="button" class="query" @click="getUserList">查询</button>
      </div>
    </form>
    <table>
      <colgroup>
        <col width="100"><!--用户名-->
        <col width="100"><!--手机-->
        <col width="100"><!--qq-->
        <col width="100"><!--微信-->
        <col width="100"><!--注册时间-->
      </colgroup>
      <thead>
      <th>用户名</th>
      <th>手机</th>
      <th>QQ</th>
      <th>微信</th>
      <th>注册时间</th>
      </thead>
      <tbody>
      <tr v-for="user in userList">
        <td>{{user.username}}</td>
        <td>{{user.phoneNo}}</td>
        <td>{{user.qqNo}}</td>
        <td>{{user.webchat}}</td>
        <td>{{user.regTime}}</td>
      </tr>
      </tbody>
    </table>
    <x-pagination :page-size="pageSize" :total-size="totalSize" v-model="pageIndex"></x-pagination>
  </div>
</template>
<script>
  import {getSpecialRegisterIdUserListApi} from 'api/other'
  import {XPagination} from 'build'

  export default {
    name: 'register-query',

    data() {
      return {
        userList: [],
        username: '',
        linkId: '1698f36287e3409aa0c338f23c4613c8',//729fe685061a40efbbda039b6f3f5cb9
        // mobile:'',
        // qq:'',
        // wechat:'',
        // time:'',
        totalSize: 0,
        pageIndex: 0,
        pageSize: 20,
      }
    },

    props: {},

    components: {
      XPagination
    },

    watch: {},
    mounted() {
      this.getUserList();
      // $(this.$refs.date).datetimepicker({
      //   format: 'YYYY-MM-DD',
      //   useCurrent: false,
      //   minDate: _(moment().endOf('day').add('-6', 'days')).toDate(),
      //   maxDate: _(moment().endOf('day')).toDate(),
      // }).on('dp.change', (e) => {
      //   this.pageSize = ''
      //   this.date = e.currentTarget.value
      //   this.resetData()
      // })
    },
    computed: {},
    filters: {},
    methods: {
      getUserList() {
        getSpecialRegisterIdUserListApi(
          {
            username: this.username,
            linkId: this.linkId,
            // mobile:this.mobile,
            // qq:this.qq,
            // wechat:this.wechat,
            // time:this.time,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
          },
          ({data}) => {
            if (data && data.result === 0) {
              this.userList = (data.root && data.root.records) || []
              this.totalSize = data.rowCount||0
              this.urlConnectTest(this.userList)
            }
          },
          () => {
            //this.userList = [{name: 'smile11111',qqNo: '888888',phoneNo: '012-222222',webchat: 'avi',regTime:'1524479846653'}]
            Global.ui.notification.show('数据请求失败')
          }
        )
      },

    },

  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/imports";

  .register-query {
    width: 600px;
    margin: 0 auto 30px;
    padding: 10px;
    background: #fff;
    span {
      color: #333;
    }
    button{
      width: 60px;
      color: #333;
      margin: 0 10px;
      border-radius: 5px;
      outline: none;
    }
    table {
      border: 1px solid #e6e6e6;
      width: 100%;
      margin: 30px 0;
      font-size: 12px;
      background-color: #ffffff;
      th {
        padding: 10px 3px;
        line-height: 20px;
        text-align: center;
        background-color: #f5f5f5;
        color: #666666;
        border-right: 1px solid #e6e6e6;
      }
      tr{
        border-bottom: 1px solid #e6e6e6;
      }
      td{
        padding: 10px 3px;
        line-height: 20px;
        text-align: center;
        background-color: #ffffff;
        color: #666666;
        border-right: 1px solid #e6e6e6;
      }
    }

  }
</style>

