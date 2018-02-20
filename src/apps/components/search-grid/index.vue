<template>
  <div class="search-grid">
    <slot name="search-panel"></slot>
    <table class="x-table no-margin">
      <colgroup v-if="colgroup">
        <col :width="col" v-for="col in colgroup">
      </colgroup>
      <thead class="thead">
      <slot name="thead"></slot>
      </thead>
    </table>
    <template v-if="showRows.length">
      <div class="grid-tbody">
        <table class="x-table no-margin">
          <colgroup v-if="colgroup">
            <col :width="col" v-for="col in colgroup">
          </colgroup>
          <tbody class="tbody">
          <slot name="tbody" v-for="(row, index) in showRows" :row="row" :rows="showRows" :index="index">
          </slot>
          </tbody>
        </table>
      </div>
      <table class="x-table tfoot-wrapper">
        <colgroup v-if="colgroup">
          <col :width="col" v-for="col in colgroup">
        </colgroup>
        <tfoot class="tfoot">
        <slot name="tfoot" :res-data="resData"></slot>
        </tfoot>
      </table>
      <x-pagination :page-size="pageSize" :total-size="totalSize" @page-change="search" ref="xPage"></x-pagination>
    </template>
    <template v-else>
      <slot name="empty-tip">
        <div class="empty-container" :style="`height: ${height}`">
          <div class="empty-icon"></div>
          <p>{{emptyTip}}</p>
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
  import FilterHelper from 'skeleton/misc/filterHelper'
  import XPagination from '../x-pagination'

  export default {
    name: 'search-grid',

    components: {
      XPagination
    },

    props: {
      searchForm: {
        required: true,
      },

      colgroup: {
        type: Array,
        required: true,
      },

      searchApi: {
        type: Function,
        required: true,
      },

      reqData: {
        type: Object,
        required: false,
      },
      dataProp: {
        type: String,
        default: 'root',
        required: true,
      },

      emptyTip: {
        type: String,
        default: '亲，暂时没有记录!',
        require: false
      },
      height: {
        type: Number,
        default: 400,
      },
      pageSize: {
        type: Number,
        default: 12,
      },
    },

    data() {
      return {
        showRows: [],
        resData: {},
        totalSize: 0,
        loading: Global.ui.loader.get(),
      }
    },

    methods: {
      search({pageIndex = 0} = {pageIndex: 0}) {
        this.filterHelper.serializeObject({
          reset: true,
        })

        const filters = this.filterHelper.get()

        if (pageIndex === 0 && this.$refs.xPage) {
          this.$refs.xPage.resetIndex()
        }

        this.searchApi({
          ..._.chain(filters).pick(_.identity).defaults(this.reqData).value(),
          pageSize: this.pageSize,
          pageIndex,
        },
          ({data}) => {
            if (data && data.result === 0) {
              this.showRows = _(this.dataProp.split('.')).reduce((_res, prop) => {
                return _res[prop]
              }, data)

              this.resData = data.root
              this.totalSize = data.root.rowCount
            }
          }, () => {
            this.showRows = []
            this.resData = {}
            this.totalSize = 0
            // if (pageIndex === 0) {
            //   this.$refs.xPage.resetIndex()
            // }
          })

        return false
      },
    },

    mounted() {
      this.$nextTick(() => {
        this.filterHelper = new FilterHelper()
        this.filterHelper.setForm(this.searchForm)

        this.search()
      })
    }
  }
</script>

<style lang="scss" scoped>
  $border: #e6e6e6;

  .x-table {
    width: 100%;
    margin-bottom: 20px;
    font-size: 12px;

    .thead {
      th {
        color: #333333;
        vertical-align: middle;
        border-bottom: 1px solid $border;
      }

    }

    .tbody {
      tr{
        &:last-of-type {
          td {
            border-bottom: 0;
          }
        }
      }
      td {
        color: #666666;
        vertical-align: middle;
        border-bottom: 1px solid $border;
      }
    }

    .tfoot {
      td {
        background-color: #f5f5f5;
      }
    }
    th, td {
      padding: 10px 3px;
      line-height: 20px;
      text-align: center;
    }

    &.tfoot-wrapper {
      margin-bottom: 40px;
    }
  }

  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .empty-icon {
      background-image: url(./empty.png);
      width: 204px;
      height: 174px;
      margin-bottom: 15px;
    }
    p {
      font-size: 14px;
      color: #666666;
    }
  }

</style>
