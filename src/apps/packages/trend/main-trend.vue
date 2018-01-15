<template>
  <div class="trend-center">
    <div class="trend-panel">
      <span class="ticket-list-title">
        彩种：
      </span>
      <select class="ticket-list" v-model="ticketId">
        <option v-for="ticket in ticketList" :value="ticket.id">{{ticket.zhName}}</option>
      </select>
    </div>
    <div class="trend-main">
      <div class="trend-select">
        五星走势图
        <label class="m-left-sm">
          <custom-checkbox v-model="missing"></custom-checkbox>
          遗漏
        </label>
        <label class="m-left-sm">
          <custom-checkbox v-model="missingLine"></custom-checkbox>
          遗漏条
        </label>
        <label class="m-left-sm">
          <custom-checkbox v-model="line"></custom-checkbox>
          走势
        </label>
        <label class="m-left-sm">
          <custom-checkbox v-model="hot"></custom-checkbox>
          热号
        </label>

        <div class="btn-group m-left-sm">
          <span class="btn-select cursor-pointer font-sm m-right-xs" v-for="(period, index) in ticketInfo.trendOps.periods" :key="period.value"
                :class="{'btn-selected': currentSearch === index}" @click="selectBy(period.name, period.value, index)">
            {{period.title}}
          </span>
        </div>
      </div>
    </div>
    <table class="table table-border no-margin">
      <colgroup>
        <col width="150">
        <col width="90">
      </colgroup>
      <thead>
      <tr>
        <th rowspan="2">
          期号
        </th>
        <th rowspan="2">
          开奖号码
        </th>
        <th v-for="position in ticketInfo.positions">
          {{position}}
        </th>
      </tr>
      <tr>
        <th class="title-nums" v-for="position in ticketInfo.positions">
          <span class="title-num" v-for="num in ticketInfo.range">{{num}}</span>
        </th>
      </tr>
      </thead>
    </table>
    <div>
      <table id="trend-table" class="table table-border">
        <colgroup>
          <col width="150">
          <col width="90">
        </colgroup>
        <tbody>
        <tr v-for="item in fTrendsList">
          <td>{{item.ticketPlanId}}</td>
          <td>{{item.openResult}}</td>
          <td v-for="(position, i) in ticketInfo.positions">
            <template v-for="miss in item.missList[i]">
              <span class="title-num" :class="{'opacity-0' : !missing}" v-if="miss !== 0">{{miss}}</span>
              <span class="circle-num blue" v-else>{{item.openResult[i]}}</span>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
  import trend from 'api/trend'
  import Draw from './draw-line'

  export default {
    name: "main-trend",
    data() {
      return {
        ticketList: ticketConfig.getAllBy({trend: true}),
        ticketInfo: {},
        ticketId: Number(_.getUrlParam('ticketId')),
        fTrendsList: [],
        missing: true,
        line: true,
        missingLine: false,
        hot: false,
        date: 0,
        pageSize: 30,
        currentSearch: 0,
      }
    },

    watch: {
      ticketId: {
        handler(ticketId) {
          this.ticketInfo = ticketConfig.getById(ticketId)

          this.getData()
        },
        immediate: true
      },
    },

    methods: {
      selectBy(name, value, index) {
        this[name] = value
        this.currentSearch = index
        this.getData()
      },
      getData() {
        if (this.ticketInfo.trendType === 'new') {
          trend.getTrend({
            trendTypeId: 1,
            // ticketId: this.ticketId + 10000,
            ticketId: this.ticketInfo.isOfficial ? this.ticketId : this.ticketId + 10000,
            playSeriesId: this.ticketInfo.playSeriesIdList[0].id,
            day: this.date,
            limit: this.pageSize
          }, (res) => {
            if (res && res.result === 0) {
              this.trendsList = res.root.trendsList || []
              this.formatData()
            }
          })
        } else {
          trend.getTrendByOld({
            ticketId: this.ticketId,
            pageSize: this.pageSize,
            // startDate,
            // endDate,
          })
        }
      },
      formatData() {
        this.fTrendsList = this.trendsList
        this.$nextTick(() => {
          this.draw()
        })
      },

      draw(offset) {
        const $body = $('body');

        if($body.width() < 1366) {
          $body.width(1366);
        }

        const colors = '#14b1bb';

        $body.find('canvas').remove();

        Draw.Chart.init();
        Draw.DrawLine.bind("trend-table");

        const num = this.ticketInfo.counts

        _(this.ticketInfo.counts).times((index) => {
          Draw.DrawLine.color(colors);
          Draw.DrawLine.add((parseInt(index) * num + 10 + 1), 2, num, 0);
        })

        Draw.DrawLine.draw(Draw.Chart.ini.default_has_line);
        Draw.DrawLine.show(this.line)
        console.log(Draw)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .trend-center {

  }
  .trend-panel {
    height: 80px;
    background-color: #129098;
    box-sizing: border-box;
    padding: 20px 30px;
    font-size: 16px;
  }
  .ticket-list-title {
    position: relative;
    bottom: 3px;
  }
  .ticket-list {
    border-radius: 40px;
    height: 40px;
    padding-left: 30px;
    color: #ffffff;
    /*background-color: #0e737a;*/
    border: none;
    background: #0e737a url(./select-arrow.png) no-repeat scroll 95% center;
    option {
      color: #ffffff;
    }
  }
  .trend-select {
    color: $new-inverse-color;
    height: 60px;
    line-height: 60px;
    padding-left: 30px;
    border-bottom: 1px solid $im-line-color;
    font-size: 14px;
  }
  .btn-select {
    &:hover {
      color: #14b1bb;
    }
  }
  .btn-selected {
    color: #14b1bb;
  }
  .title-num {
    width: 20px;
    line-height: 30px;
    color: #333333;
    display: inline-block;
    text-align: center;
  }
  .circle-num {
    width: 18px;
    height: 18px;
    border-radius: 10px;
    display: inline-block;
    color: #ffffff;
  }
  .blue {
    background-color: #14b1bb;
  }
  .yellow {
    background-color: #f09932;
  }

  .table {
    tr {
      td {
        border-bottom: 1px solid #ffffff;
      }
      &:nth-of-type(5n) {
        td {
          border-bottom: 1px;
        }
      }
    }
  }

</style>
