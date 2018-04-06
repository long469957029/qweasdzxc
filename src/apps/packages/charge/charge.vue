<template>
  <div class="main">
    <div class="charge-img">
      <img src="./charge-success.png" v-if="type === 0" />
      <img src="./charge-fail.png" v-else />
    </div>
    <div class="charge-text">
      <span class="font-md" v-if="type === 0">充值成功，请返回平台查看充值结果！</span>
      <div v-else>
        <span class="font-md">充值异常！</span><br/>
        <span class="font-sm">因为网络延迟以及第三方支付系统的延迟有可能导致您的到账较慢，</span><br/>
        <span class="font-sm">请耐心等待。</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'charge',
    data () {
      return{
        type: 0
      }
    },
    mounted(){
      this.type = Number(_.getUrlParam('type'))
    }
  }
</script>
<style lang="scss" scoped>
  body {
    height: initial;
  }
  .main{
    width: 100%;
    height: 100%;
    background-color: #cccccc;
    position: absolute;
  }
  .charge-img-success {
    margin-left: auto;
    margin-right: auto;
    background-image: url('charge-success.png');
    width: 223px;
    background-repeat: no-repeat;
    background-position: 8px center;
    text-indent: 22px;

  }
  .charge-img-fail {
    margin-left: auto;
    margin-right: auto;
    background-image: url('charge-success.png');
    width: 223px;
    background-repeat: no-repeat;
    background-position: 8px center;
    text-indent: 22px;
  }
  .charge-img {
    width:50px;
    margin-top:200px;
    margin-left: auto;
    margin-right: auto;
  }
  .charge-text {
    text-align: center;
    margin-top: 35px;
    margin-left: auto;
    margin-right: auto;
    font-size: 13px;
  }
</style>
