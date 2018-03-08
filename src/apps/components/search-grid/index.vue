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
    <status-cell :has-data="showRows.length" :status="loadingStatus" :height="height">
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
      <x-pagination :page-size="pageSize" :total-size="totalSize" v-model="pageIndex" ref="xPage"></x-pagination>
    </status-cell>
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
        type: String,
        default: '400px',
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
        pageIndex: 0,
        loadingStatus: 'loading',
        loading: Global.ui.loader.get(),
      }
    },

    watch: {
      pageIndex() {
        this.$_search()
      }
    },

    methods: {
      search() {
        this.pageIndex = 0
        this.$_search()
      },
      $_search() {
        this.filterHelper.serializeObject({
          reset: true,
        })

        const filters = this.filterHelper.get()

        if (this.pageIndex === 0 && this.$refs.xPage) {
          this.$refs.xPage.resetIndex()
        }

        this.loadingStatus = 'loading'

        this.searchApi({
          ..._.chain(filters).pick(_.identity).defaults(this.reqData).value(),
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
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
          .finally(() => {
            this.loadingStatus = 'completed'
          })

        return false
      },
    },

    mounted() {
      this.$nextTick(() => {
        this.filterHelper = new FilterHelper()
        this.filterHelper.setForm(this.searchForm)

        this.$_search()
      })
    }
  }
</script>

<style lang="scss">
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
        font-weight: normal;
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


</style>
