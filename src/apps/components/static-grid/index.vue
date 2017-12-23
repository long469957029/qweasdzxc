<template>
  <div :class="wrapperClass">
    <div v-if="showHeader">
      <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
        <colgroup>
          <col :width="col.width" v-for="col in colModel">
        </colgroup>

        <thead>
        <tr>
          <th :width="col.width" v-for="col in colModel" v-html="Vue.compile(col.label).render"></th>
        </tr>
        </thead>
      </table>
    </div>


    <div class="js-wt-body-main relative" ref="bodyDiv">
      <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
        <colgroup>
          <col :width="col.width" v-for="col in colModel">
        </colgroup>
        <tbody class="js-wt-tbody"></tbody>
      </table>

      <div v-html="loading" v-show="showLoading"></div>

      <div class="empty-container text-center" v-show="showEmpty">
        <div class="empty-container-main">
          <div class="grid-empty sfa-grid-empty"></div>
          {{emptyTip}}
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
      row: {
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
        showEmpty: false,
        abort: true,
        data: {},
        dataProp: 'root',
        hasBorder: _.isUndefined(this.hasBorder) ? this.tableClass.indexOf('table-bordered') > -1 : this.hasBorder,
        loading: Global.ui.loader.get(),
        Vue
      }
    },

    mounted: function() {
      if (this.height > 0) {
        $(this.$refs.bodyDiv).slimScroll({
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

      formatRow(rows) {
        const html = []
        let formatRows = []

        if (_.isArray(rows)) {
          formatRows = _.map(rows, function(row, index, data) {
            return this.formatRowData(row, index, data)
          }, this)

          if (formatRows.length) {
            _(formatRows).each((info, index) => {
              html.push('<tr class="js-gl-static-tr"')
              _.each(rows[index], (value, key) => {
                html.push(` data-${_(key).toDataStyle()}="${_(value).escape()}"`)
              })
              html.push('>')
              _(info).each((cell) => {
                html.push(cell)
              })

              html.push('</tr>')
            })
          }
        } else {
          html.push(`<tr class="js-gl-static-tr ${rows.trClass}">`)
          _(rows.columnEls).each((cell) => {
            html.push(`<td>${cell}</td>`)
          })
          html.push('</tr>')
        }


        return html.join('')
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
        }, [])
      },

      // common APIs

      getRowData($el) {
        const $row = $($el).closest('tr')
        return $row.data()
      },

      getHeight() {
        return this.element.find('table').height()
      },

      clean() {
        this.$tbody.empty()
        this.$footerBody.empty()

        return this
      },

      addRows(rows, options) {
        options = options || {}
        const $rows = $(this.formatRow(rows))

        this.hideLoading()
        this.hideEmpty()

        if (_.isUndefined(options.prepend)) {
          this.$tbody.append($rows)
        } else {
          this.$tbody.prepend($rows)
        }
        return $rows
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

      delRow(index) {
        this.$tbody.find('.js-gl-static-tr').eq(index).remove()
      },

      renderRow(row) {
        let $rows = $()

        if (row.length) {
          this.hideLoading()
          this.hideEmpty()

          $rows = $(this.formatRow(row))
          this.$tbody.html($rows)
        } else {
          this.$tbody.empty()
          this.renderEmpty()
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
        return this
      },

      hideEmpty() {
        this.showEmpty = false
        return this
      },

      renderLoading() {
        this.showLoading = false
        return this
      },

      hideLoading() {
        this.showLoading = true
        return this
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
