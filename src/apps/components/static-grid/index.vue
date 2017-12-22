<template>
  <div :class="wrapperClass">
    <div v-if="showHeader">
      <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
        <colgroup>
          <col :width="col.width" v-for="col in colModel">
        </colgroup>

        <thead>
        <tr>
          <th :width="col.width" v-for="col in colModel">{{col.label}}</th>
        </tr>
        </thead>
      </table>
    </div>


    <div class="js-wt-body-main relative">
      <table class="no-margin" :class="[tableClass, {'no-b-bottom': hasBorder}]">
        <colgroup>
          <col :width="col.width" v-for="col in colModel">
        </colgroup>
        <tbody class="js-wt-tbody"></tbody>
      </table>

      <div v-html="loading"></div>

      <div class="empty-container text-center hidden">
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
    },

    data: function () {
      return {
        height: 0,
        colModel: [],
        url: '',
        startOnLoading: true,
        showHeader: true,
        abort: true,
        data: {},
        dataProp: 'root',
        hasBorder: _.isUndefined(this.hasBorder) ? this.tableClass.indexOf('table-bordered') > -1 : this.hasBorder,
        loading: Global.ui.loader.get({
          wrapperClass: 'js-wt-loader-container hidden',
        }),
      }
    },

    getEmptyHtml() {
      const html = []
      if (this.emptyTip) {
      }

      return html.join('')
    },
  }
</script>

<style scoped>

</style>
