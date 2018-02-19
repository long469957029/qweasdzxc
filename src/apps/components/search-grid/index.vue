<template>
  <div class="search-grid">
    <slot name="search-panel"></slot>
    <table class="table no-margin">
      <colgroup v-if="colgroup">
        <col :width="col" v-for="col in colgroup">
      </colgroup>
      <thead>
      <slot name="thead"></slot>
      </thead>
    </table>
    <template v-if="showRows.length">
      <div class="grid-tbody">
        <table class="table no-margin">
          <colgroup v-if="colgroup">
            <col :width="col" v-for="col in colgroup">
          </colgroup>
          <tbody>
          <slot name="tbody" v-for="(row, index) in showRows" :row="row" :rows="showRows" :index="index">
          </slot>
          </tbody>
        </table>
      </div>
      <table class="table no-margin">
        <colgroup v-if="colgroup">
          <col :width="col" v-for="col in colgroup">
        </colgroup>
        <tfoot>
        <slot name="tfoot" :res-data="resData"></slot>
        </tfoot>
      </table>
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

  export default {
    name: 'search-grid',

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
      }
    },

    data() {
      return {
        showRows: [],
        resData: {},
        loading: Global.ui.loader.get(),
      }
    },

    methods: {
      search() {
        this.filterHelper.serializeObject({
          reset: true,
        })

        const filters = this.filterHelper.get()

        this.searchApi(
          _.chain(filters).pick(_.identity).defaults(this.reqData).value(),
          ({data}) => {
            if (data && data.result === 0) {
              this.showRows = _(this.dataProp.split('.')).reduce((_res, prop) => {
                return _res[prop]
              }, data)

              this.resData = data.root
            }
          }, () => {
            this.showRows = []
            this.resData = {}
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
