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
      <status-cell :status="loading" :has-data="showRows.length" :loading-tip="loadingTip" :transition="transition" :empty-tip="emptyTip">
        <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
          <colgroup>
            <col :width="col.width" v-for="col in colModel">
          </colgroup>
          <transition-group
            enter-active-class="animated-quick fadeIn"
            leave-active-class="animated-quick fadeOut"
            tag="tbody"
          >
            <tr v-for="(row, i) in showRows" :key="i" v-html="row" ref="bodyRows"></tr>
          </transition-group>

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
    name: "static-grid",

    model: {
      prop: 'list',
      event: 'change'
    },

    props: {
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
          this.showRows = _.map(data, (item, index, data) => {
            return this.formatRowData(item, index, data)
          }, this)
          this.$emit('change', this.showRows)
        },
        deep: true
      },
      colModel: {
        handler() {
          this.showRows = _.map(this.innerRows, (item, index, data) => {
            return this.formatRowData(item, index, data)
          }, this)
        }
      },
    },

    mounted() {

      if (this.height > 0) {
        if (this.scroll) {
          $(this.$refs.body).slimScroll({
            height: this.height,
          })
        }
        this.$refs.body.style.height = `${this.height}px`
      }


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
        this.loading = 'loading'

        $http({
          url: this.url,
          abort: this.abort,
          data: this.reqData,
        })
          .catch((xhr, type) => {
            this.hideLoading()
            if (type !== 'abort') {
              this.renderFail()
            }
          })
          .then(({data}) => {
            this.hideLoading()
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

      formatRowData(row, index, data) {
        // 合并行
        _(this.colModel).each((colInfo) => {
          if (colInfo.merge) {
            _(data).reduceRight((repeat, info) => {
              if (!_(repeat.val).isUndefined() && info[colInfo.name] === repeat.val) {
                repeat.num += 1
              } else {
                repeat.val = info[colInfo.name]
                repeat.num = 0
              }
              info[`${colInfo.name}Rowspan`] = repeat.num + 1

              return repeat
            }, {
              val: null,
              num: 0,
            })
          }
        })

        return _(this.colModel).reduce((formatRow, colInfo) => {
          const cell = []
          let cellContent = ''
          let rowName = ''
          let dataName = ''
          if (_(colInfo.name).indexOf('.') > -1) {
            const arr = colInfo.name.split('.')
            rowName = row[`${arr[0]}`][`${arr[1]}`]
            dataName = index > 0 ? data[index - 1][`${arr[0]}`][`${arr[1]}`] : ''
          } else {
            rowName = row[`${colInfo.name}`]
            dataName = index > 0 ? data[index - 1][`${colInfo.name}`] : ''
          }
          if (colInfo.merge && index > 0 && rowName === dataName) {
            cell.push('')
          } else {
            cell.push(`<td rowspan="${row[`${colInfo.name}Rowspan`] || 1}">`)
            if (colInfo.formatter) {
              cellContent = colInfo.formatter(rowName, index, row)
            } else if (rowName || rowName === 0) {
              cellContent = rowName
            }

            cell.push(cellContent)

            cell.push('</td>')
          }

          formatRow.push(cell.join(''))

          return formatRow
        }, []).join('')
      },

      // common APIs

      getRows() {
        return this.$refs.bodyRows || []
      },

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

      toggleEmpty(flag) {
        this.showEmpty = flag
      },

      renderLoading() {
        this.showLoading = true
      },

      hideLoading() {
        this.showLoading = false
      },

      renderFail() {
        this.toggleEmpty(false)
      }
    },
  }
</script>

<style scoped>

</style>
