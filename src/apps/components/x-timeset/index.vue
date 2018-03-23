<template>
  <div class="xtime-timer-calendar">
    <span class="xtime-dateGroup inline-block m-right-sm vertical-middle" v-if="showRange">
      <button type="button" class="btn btn-silent" @click="selectHistoryData(0)"
              :class="{active:activeItem===0}">今日</button>
      <button type="button" class="btn btn-silent" @click="selectHistoryData(-1)"
              :class="{active:activeItem===-1}">昨日</button>
      <button type="button" class="btn btn-silent" @click="selectHistoryData(-7)"
              :class="{active:activeItem===-7}">最近7天</button>
      <button type="button" class="btn btn-silent" @click="selectHistoryData(-30)"
              :class="{active:activeItem===-30}">最近30天</button>
    </span>
    <span class="xtime-timer-text" v-if="showRange"> 日期：</span>
    <div class="xtime-timer inline-block">
      <date-picker class="timeset-box" v-model="startDate" :config="startConfig"></date-picker>
      <span class="timer-calendar" :class="{'sfa-icon-time':showIcon}"></span>
    </div>
    <div class="xtime-timer-calendar-to inline-block">
      至
    </div>
    <div class="xtime-timer inline-block">
      <date-picker class="timeset-box" v-model="endDate" :config="endConfig"></date-picker>
      <span class="timer-calendar" :class="{'sfa-icon-time':showIcon}"></span>
    </div>
  </div>
</template>
<script>
//  import datePicker from 'vue-bootstrap-datetimepicker'
//  import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
  export default{
    name: 'index',

    data () {
      return {
        startDate: new Date(),
        endDate: new Date(),
        activeItem: 1,
        dateList: [],
      }
    },

    props: {
      showIcon: {
        type: Boolean,
        default: true,
      },
      showRange: {
        type: Boolean,
        default: false,
      },
      placeholder: String,
      startTime: String,
      endTime: String,
      isRefreshDate: Boolean,
      startConfig: {
        type: Object,
        default () {
          return {
            format: 'YYYY-MM-DD H:mm:ss',
            locale: moment.locale('zh-cn')
          }
        }
      },
      endConfig: {
        type: Object,
        default () {
          return {
            format: 'YYYY-MM-DD H:mm:ss',
            locale: moment.locale('zh-cn')
          }
        }
      }
    },

    components: {
      datePicker,
    },

    mounted () {
      this.GetSelectedDateList()

    },

    watch: {
      startDate(){
        this.onStartTimeChange()
      },
      endDate(){
        this.onEndTimeChange()
      },
    },

    computed: {},

    filters: {},

    methods: {
      selectHistoryData(offset){
        this.startDate = _(moment().add(offset, 'days').startOf('day')).toDate()
        this.endDate = _(moment().add(offset < 0 ? -1 : 0, 'days').endOf('day')).toDate()
        this.isSelectedItem()
        this.$emit('update:startTime', this.startDate)
        this.$emit('update:endTime', this.endDate)
        this.$emit('update:isRefreshDate', true)
      },
      onStartTimeChange(){
        if (Date.parse(this.endDate) < Date.parse(this.startDate)) {
          this.endDate = this.startDate
        }
        this.$emit('update:startTime', this.startDate)
        if(this.showRange){
          this.isSelectedItem()
        }
      },
      onEndTimeChange(){
        if (Date.parse(this.startDate) > Date.parse(this.endDate)) {
          this.startDate = this.endDate
        }
        this.$emit('update:endTime', this.endDate)
        if(this.showRange){
          this.isSelectedItem()
        }
      },

      isSelectedItem(){
        const days = _(this.dateList).findWhere({
          startDay: this.startDate,
          endDay: this.endDate
        })
        if (days !== undefined && days !== null) {
          this.activeItem = days.num
        } else {
          this.activeItem = 1
        }
      },
      GetSelectedDateList(){
        const dList = [0, -1, -7, -30]
        this.dateList = []
        _(dList).each((item) => {
          const o = {
            num: item,
            startDay: _(moment().add(item, 'days').startOf('day')).toDate(),
            endDay: _(moment().add(item < 0 ? -1 : 0, 'days').endOf('day')).toDate()
          }
          this.dateList.push(o)
        })
      },
//      GetDateStr(AddDayCount) {
//        const dd = new Date();
//        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
//        const y = dd.getFullYear();
//        const m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
//        const d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
//        return y + "-" + m + "-" + d
//      },
    }
  }
</script>

<style scoped lang="scss">
  .xtime-timer-calendar {
    height: 28px;
    line-height: 28px;
    .xtime-timer {
      position: relative;
      border: solid 1px #e6e6e6;
      display: inline-block;
      height: 26px;
      top: 0;
      width: 136px;
      .timeset-box {
        position: absolute;
        padding: 0 0 0 5px;
        border: 0 !important;
        width: 80%;
        height: 100%;
        font-size: 12px;
      }
      &.focus {
        border: solid 1px #14b1bb;
      }
      .timer-calendar {
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
    .xtime-timer-text {
      vertical-align: top;
    }
    .xtime-timer-calendar-to {
      vertical-align: top;
      display: inline-block;
    }
    .xtime-dateGroup {
      border-right: none;
      font-size: 0;
      vertical-align: top;
      float: left;
      .btn {
        min-width: 46px;
        margin-right: 8px;
        background-color: transparent;
        border: 1px solid #cccccc;
        border-radius: 3px;
        font-size: 12px;
        .btn-silent {
          border-radius: 3px !important;
          min-width: 46px !important;
          color: #666666;
          background-color: transparent;
          border: 1px solid #cccccc;
          font-size: 12px !important;
          height: 24px !important;
          line-height: 24px !important;
        }
        &.active, &:hover {
          border: 1px solid #14b1bb;
          color: #14b1bb;
          background-color: transparent;
        }
      }
    }
  }
</style>

