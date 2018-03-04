<template>
  <div :class="wrapperClass">
    <div v-if="showHeader">
      <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
        <colgroup>
          <col :width="col.width" v-for="col in colModel">
        </colgroup>

        <thead>
        <tr>
          <th :width="col.width" v-for="col in colModel" v-html="col.label"></th>
        </tr>
        </thead>
      </table>
    </div>

    <div class="relative" ref="body">
      <status-cell :status="loading" :has-data="showRows.length" :loading-tip="loadingTip" :transition="transition">
        <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
          <colgroup>
            <col :width="col.width" v-for="col in colModel">
          </colgroup>
          <!--<transition-group-->
          <!--enter-active-class="animated-quick fadeIn"-->
          <!--leave-active-class="animated-quick fadeOut"-->
          <!--tag="tbody"-->
          <!--&gt;-->
          <tbody ref="tbody">
          <slot name="row" v-for="(row, index) in showRows" :row="row" :rows="showRows" :index="index"></slot>
          <slot name="ex-row"></slot>
          </tbody>
          <!--</transition-group>-->
        </table>
        <slot name="empty-tip" slot="empty-tip">
          <div slot="empty-tip" v-if="emptyTip" v-html="emptyTip"></div>
        </slot>
      </status-cell>
    </div>
    <div class="js-wt-footer-main relative">
      <table class="no-margin" :class="tableClass">
        <colgroup>
          <col :width="col.width" v-for="col in colModel">
        </colgroup>
        <tbody></tbody>
      </table>
    </div>
  </div>

</template>

<script>
  export default {
    name: "slot-static-grid",

    model: {
      prop: 'list',
      event: 'change'
    },

    props: {
      list: {
        type: Array
      },
      tableClass: {
        type: String,
        default: 'table table-bordered '
      },
      wrapperClass: {
        type: String,
        default: ''
      },

      loadingTip: {
        type: String,
        default: ''
      },

      emptyTip: {
        type: String,
        default: '暂无数据'
      },
      rows: {
        type: Array,
        default() {
          return []
        }
      },
      initRemote: {
        type: Boolean,
        default: true
      },
      height: {
        type: Number,
        default: 0
      },
      minHeight: {
        type: Number,
        default: 0
      },
      url: {
        type: String,
        default: '',
      },
      colModel: {
        type: Array,
        default() {
          return []
        }
      },
      dataProp: {
        type: String,
        default: 'root'
      },
      reqData: {
        type: Object,
        default() {
          return {}
        }
      },
      abort: {
        type: Boolean,
        default: true
      },
      scroll: {
        type: Boolean,
        default: true
      },
      transition: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        showLoading: this.initRemote,
        showEmpty: !_.isEmpty(this.emptyTip),
        startOnLoading: this.initRemote,
        showHeader: true,
        showRows: [],
        innerRows: [],
        hasBorder: _.isUndefined(this.hasBorder) ? this.tableClass.indexOf('table-bordered') > -1 : this.hasBorder,
        loading: this.initRemote ? 'loading' : 'completed'
      }
    },

    watch: {
      rows: {
        handler() {
          this.innerRows = this.rows
        },
        deep: true
      },
      innerRows: {
        handler(data) {
          this.showRows = data
          this.$emit('change', this.showRows)
        },
        deep: true
      },
      colModel: {
        handler() {
          this.showRows = this.innerRows
        }
      },
      height: {
        handler() {
          this.$nextTick(() => {
            if (this.height > 0) {
              if (this.scroll) {
                $(this.$refs.body).slimScroll({
                  height: this.height,
                })
              }
              this.$refs.body.style.height = `${this.height}px`
            } else {
              this.$refs.body.style.height = ''
            }
          })
        },
        immediate: true
      },
      minHeight: {
        handler() {
          this.$nextTick(() => {
            if (this.minHeight > 0) {
              this.$refs.body.style.minHeight = `${this.minHeight}px`
            } else {
              this.$refs.body.style.minHeight = ''
            }
          })
        },
        immediate: true
      }
    },

    mounted() {
      if (this.url && this.initRemote) {
        this.$_getDataXhr()
      } else if (_.isEmpty(this.showRows)) {
        if (this.startOnLoading) {
          this.renderLoading()
        } else {
          this.toggleEmpty(true)
        }
      }
    },

    methods: {
      update() {
        this.$_getDataXhr()
      },
      setHeight(height) {
        this.height = height
        if (this.height > 0) {
          $(this.$refs.body).slimScroll({
            height: this.height,
          })
        }
      },

      $_getDataXhr() {
        this.clean()
        // this.renderLoading()
        this.loading = 'loading'

        $http({
          url: this.url,
          abort: this.abort,
          data: this.reqData,
        })
          .catch((xhr, type) => {
            if (type !== 'abort') {
              this.renderFail()
            }
          })
          .then(({data}) => {
            if (data && data.result === 0) {
              this.innerRows = _(this.dataProp.split('.')).reduce((_res, prop) => {
                let data = _res[prop]
                if (!data) {
                  data = []
                }
                return data
              }, data)
              this.toggleEmpty(_.isEmpty(this.innerRows))
            } else {
              this.renderFail()
            }
          })
          .finally(() => {
            this.loading = 'completed'
          })
      },

      // common APIs

      clean() {
        this.innerRows = []
        this.$emit('change', [])
      },

      addFooterRows(rows, options) {
        options = options || {}

        const $rows = $(this.formatRow(rows))

        this.hideLoading()
        this.toggleEmpty(false)

        if (_.isUndefined(options.prepend)) {
          this.$footerBody.append($rows)
        } else {
          this.$footerBody.prepend($rows)
        }
        return $rows
      },

      getRows() {
        return this.$refs.tbody && this.$refs.tbody.children || []
      },

      toggleEmpty(flag) {
        this.showEmpty = flag
      },

      renderFail() {
        this.toggleEmpty(false)
      }
    },
  }
</script>

<style scoped>

</style>
