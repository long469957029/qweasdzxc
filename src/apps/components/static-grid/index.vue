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
      <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
        <colgroup>
          <col :width="col.width" v-for="col in colModel">
        </colgroup>
        <tbody>
          <tr v-for="row in showRows" v-html="row" ref="bodyRows"></tr>
        </tbody>

      </table>

      <div v-html="loading" v-show="_.isEmpty(showRows) && showLoading"></div>

      <div class="empty-container text-center" v-show="_.isEmpty(showRows) && showEmpty">
        <div class="empty-container-main" v-html="emptyTip">
        </div>
      </div>
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

    props: {
      tableClass: {
        type: String,
        default: 'table table-bordered '
      },
      wrapperClass: {
        type: String,
        default: ''
      },

      emptyTip: {
        type: String,
        default: '暂无数据'
      },
      rows: {
        type: Array,
        default: function() {
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
      showLoading: {
        type: Boolean,
        default: false
      },
      colModel: {
        type: Array,
        default: function() {
          return []
        }
      },
    },

    data: function () {
      return {
        url: '',
        startOnLoading: true,
        showHeader: true,
        showEmpty: !_.isEmpty(this.emptyTip),
        abort: true,
        showRows: [],
        dataProp: 'root',
        hasBorder: _.isUndefined(this.hasBorder) ? this.tableClass.indexOf('table-bordered') > -1 : this.hasBorder,
        loading: Global.ui.loader.get(),
      }
    },

    watch: {
      rows: {
        handler: function(data) {
          let showRows = _.map(data, function(item, index, data) {
            return this.formatRowData(item, index, data)
          }, this)

          this.showRows = showRows
        },
        deep: true
      }
    },

    mounted: function() {
      if (this.height > 0) {
        $(this.$refs.body).slimScroll({
          height: this.height,
        })
      }

      // this.$tbody = this.element.find('.js-wt-tbody')
      // this.$footerDiv = this.element.find('.js-wt-footer-main')
      // this.$footerBody = this.$footerDiv.find('tbody')


      if (this.url && this.initRemote) {
        this.$_getDataXhr()
      } else if (_.isEmpty(this.row)) {
        if (this.startOnLoading) {
          this.renderLoading()
        } else {
          this.renderEmpty()
        }
      } else {
        this.renderRow(this.row)
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
          .renderLoading()

        Global.sync.axios({
          url: this.url,
          abort: this.abort,
          data: this.data,
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
              this.currentData = _(this.dataProp.split('.')).reduce((_res, prop) => {
                let data = _res[prop]
                if (!data) {
                  data = []
                }
                return data
              }, data)
              this.renderRow(this.currentData)
              // self.element.trigger('update:done', res.root, res)
            } else {
              this.renderFail()
            }
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

      getHeight() {
        return this.element.find('table').height()
      },

      clean() {
        this.$tbody.empty()
        this.$footerBody.empty()

        return this
      },

      addFooterRows(rows, options) {
        options = options || {}

        const $rows = $(this.formatRow(rows))

        this.hideLoading()
        this.hideEmpty()

        if (_.isUndefined(options.prepend)) {
          this.$footerBody.append($rows)
        } else {
          this.$footerBody.prepend($rows)
        }
        return $rows
      },

      reformat(gridOps) {
        // if (this.currentData) {
        //   if (gridOps) {
        //     this._create(_(gridOps).extend({
        //       initRemote: false,
        //       row: this.currentData,
        //     }))
        //   }
          // this.renderRow()
        // }
      },

      renderEmpty() {
        this.showEmpty = true
      },

      hideEmpty() {
        this.showEmpty = false
      },

      renderLoading() {
        this.showLoading = false
      },

      hideLoading() {
        this.showLoading = true
      },

      renderFail() {
        this.hideEmpty()
        this.$tbody.html(`<tr><td class="text-center" colspan="${this.options.colModel.length}">加载数据失败</td></tr>`)
      }
    },
  }
</script>

<style scoped>

</style>
