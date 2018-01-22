<template>
  <div>
    <div class="aa-banner">
      <div class="aa-banner-container"></div>
    </div>
    <div class="aa-container">
      <active-navbar @fetchData="queryActivity" :activityType="activityType" :isFetching="queryFetching"></active-navbar>
      <active-timeline :timelineHeight="timelineHeight" :filterActivityList="filterActivityList"></active-timeline>
      <div>
        <active-item :filterActivityList="filterActivityList" @openDetailDialog="openDetailDialog" :isFetching="openDialogFetching"></active-item>
      </div>
      <div class="timeline-add" v-show="showAddMoreBtn">
        <div :class="`add-btn ${fetchMoreFetching ? 'disabled' : ''}`" @click="fetchMore">点击加载更多</div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="detailDialog" v-show="showDetailDialog">
      <active-dialog :actTitle="actTitle" :actSummary="actSummary" :actContent="actContent" :actPic="actPic" :startDate="startDate" :endDate="endDate"></active-dialog>
    </div>
  </div>
</template>
<script>
import VueIsInView from 'vue-is-in-view';
Vue.use(VueIsInView);

import activity from "api/activity";
import ActiveNavbar from './activeNavbar.vue'
import ActiveItem from './activeItem.vue'
import ActiveTimeline from './activeTimeline.vue'
import ActiveDialog from './activeDialog.vue'

const PAGESIZE = 6
const PAGECOUNT = 1

export default {
  name: "active-center",

  components: {
    ActiveNavbar,
    ActiveItem,
    ActiveTimeline,
    ActiveDialog
  },

  data() {
    return {
      activityList: [],
      pageSize: PAGESIZE,
      pageCount: PAGECOUNT,
      activityType: '',
      showDetailDialog: false,
      dialogBanner: '',
      queryFetching: false,
      fetchMoreFetching: false,
      openDialogFetching: false,

      // 判断是否显示加载更多按钮用
      rowCount: 0,


      // 活动详情
      actTitle: '', // 活动主题
      actSummary: '', // 活动摘要
      actContent: '', // 活动内容
      actPic: '', // 活动图片
      startDate: '', // 活动开始时间
      endDate: '', // 活动结束时间
    }
  },
  mounted() {
    activity.getActivityList({ activityType: this.activityType, pageSize: this.pageSize, }, ({ data }) => {
      if (data && data.result === 0) {
        const { records } = data.root
        this.rowCount = data.root.rowCount
        this.activityList = records
      }
    })
  },
  computed: {
    filterActivityList() {
      if (this.activityList && this.activityList.length > 0) {
        return this.activityList.filter(
          activity => activity.activityStatus !== 4
        )
      } else {
        return []
      }
    },
    timelineHeight() {
      const row = Math.round(this.activityList.length / 2)
      return 23 + 360 * row + 40 * (row - 1) + 40
    },

    showAddMoreBtn() {
      const currentItemLength = this.activityList.length
      if (this.rowCount <= currentItemLength) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
    queryActivity(activityType) {
      this.activityType = activityType
      this.queryFetching = true
      activity.getActivityList({activityType: this.activityType, pageSize: this.pageSize}, ({data}) => {
        if (data && data.result === 0) {
          const { records } = data.root
          this.rowCount = data.root.rowCount
          this.activityList = records
          this.queryFetching = false

          this.pageCount = PAGECOUNT // 更换类型 初始化页数
        }
      })
    },
    fetchMore() {
      if (this.fetchMoreFetching) {
        return
      }
      this.pageCount = this.pageCount + 1
      this.fetchMoreFetching = true
      activity.getActivityList({activityType: this.activityType, pageSize: this.pageSize * this.pageCount}, ({data}) => {
        if (data && data.result === 0) {
          const { records } = data.root
          this.activityList = records

          this.fetchMoreFetching = false
        }
      })
    },
    openDetailDialog(rid) {
      this.openDialogFetching = true

      activity.getActivityDetail({rid}, ({data}) => {
        if (data && data.result === 0) {
          const result = data.root
          this.openDialogFetching = false

          this.actTitle = result.activityTitle
          this.actSummary = result.activitySummary
          this.actContent = result.activityContent
          this.actPic = result.bannerDetailPicUrl
          this.startDate = result.startDate
          this.endDate = result.endDate

          // 代表活动有主题页链结，执行跳转不弹窗
          if (result.linkUrl) {
            window.open(result.linkUrl)
            return
          }

          this.showDetailDialog = true

          this.$nextTick(() => {
            $(this.$refs.detailDialog).modal({
              backdrop: 'static',
            })
              .on('hidden.modal', () => {
                this.showDetailDialog = false
              })
          })
        }
      })
    },
    closeDetailDialog(){
      $(this.$refs.detailDialog).modal('hide')
    },
  }
}
</script>
<style lang='scss' scoped>
@import "../misc/mixin";
@import "../misc/variable";

.aa-banner {
  @include banner-background("misc/aa-banner.png");
  height: 330px;
  width: 100%;

  * {
    box-sizing: border-box;
  }

  .aa-banner-container {
    @include center-center();
    width: 1200px;
  }
}

.aa-container {
  @include center-container(1200px);
  * {
    box-sizing: border-box;
  }
}

.add-btn {
  width: 240px;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: white;
  margin: 24px auto;
  background: $main-deep-color;
  border-radius: 25px / 25px;
  text-align: center;
  cursor: pointer;

  &:hover, &:active {
    background: darken($main-deep-color, 10%)
  }

  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 7px;
  background: #d1d3d6;
  margin: 5px auto;
}

.timeline-add {
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
}
</style>

