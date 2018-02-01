<template>
  <div class="modal-dialog modal-detail">
    <div class="close-badge">
      <a class="close btn-close dialog-close close-icon" data-dismiss="modal"></a>
    </div>
    <img :src="actPic" class="banner" />
    <div class="container">
      <div class="header">
        <div class="title-row">
          <div class="title">{{actTitle}}</div>

          <div class="date">
            <div class="clock-icon"></div>
            {{ `${_(startDate).toTime('YYYY/MM/DD')} ~ ${_(endDate).toTime('YYYY/MM/DD')}`}}
          </div>
        </div>
        <div class="desc">{{actSummary}}</div>
      </div>
      <div class="content" v-html="actContent"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'active-dialog',
  props: [
    'actTitle',
    'actSummary',
    'actContent',
    'actPic',
    'startDate',
    'endDate',
  ],
}
</script>
<style lang="scss" scoped>
  .modal-detail {
    width: 710px;
    height: 640px;
    background: white;
  }

  .close-badge {
    background: white;
    width: 59px;
    height: 41px;
    position: absolute;
    top: 27px;
    right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 21px;
    border-bottom-left-radius: 21px;
    margin-left: 20px;
  }

  .close-icon {
    background: url('./misc/close-icon.png');
    width: 27px;
    height: 27px;
    top: 7px;
  }

  .banner {
    width: 710px;
    height: 200px;
  }

  .container {
    padding: 25px 15px;
    height: 390px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .header {
    padding: 0 10px;
    border-bottom: 1px solid #e6e6e6;

    .title-row {
      display: flex;
      justify-content: space-between;

      .title {
        font-size: 16px;
        color: #333;
        margin-bottom: 10px;
      }

      .clock-icon {
        background: url('./misc/clock-icon.png');
        width: 18px;
        height: 18px;
        display: inline-block;
        vertical-align: bottom;
        margin-right: 3px;
      }

      .date {
        font-size: 12px;
        color: #666;
        margin-left: 6px;
      }
    }

    .desc {
      font-size: 14px;
      color: #999;
      margin-bottom: 25px;
    }
  }

  .content {
    padding: 27px 10px;
    // .title {
    //   font-size: 14px;
    //   color: #333;
    //   margin-bottom: 15px;
    // }

    // .desc {
    //   font-size: 14px;
    //   height: 230px;
    //   line-height: 30px;
    //   color: #666;
    //   overflow-y: scroll;
    //   overflow-x: hidden;
    // }
  }
</style>
