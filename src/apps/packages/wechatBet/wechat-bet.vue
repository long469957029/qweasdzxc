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
        <col width="100"><!--微信-->
        <col width="120"><!--注册时间-->
      </colgroup>
      <thead>
      <th>群名称</th>
      <th>时间</th>
      <th>成员名称</th>
      <th>消息</th>
      </thead>
      <tbody>
      <tr v-for="message in messageList">
        <td>{{message.groupName}}</td>
        <td>{{message.date}}</td>
        <td>{{message.useruname}}</td>
        <td>{{message.content}}</td>
      </tr>
      </tbody>
    </table>
    <x-pagination :page-size="pageSize" :total-size="totalSize" v-model="pageIndex"></x-pagination>
  </div>
</template>
<script>
  import {XPagination} from 'build'

  export default {
    name: 'wechat-bet',

    data() {
      return {
        userList: [],
        username: '',
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

    },
    computed: {
      ...mapState({
        messageList: state => state.wechat.messageList,
      }),
    },
    filters: {},
    methods: {

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

