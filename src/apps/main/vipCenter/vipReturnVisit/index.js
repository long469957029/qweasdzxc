

const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const VipReturnVisit = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-uc-confirm': 'visitrefer',
  },
  // 电话回访表单验证
  visitrefer () {
    let namevalidate = false,
      phonevalidate = false,
      questionvalidate = false
    const name = this.$('.js-name').val()
    const phone = this.$('.js-phone').val()
    const question = this.$('.js-question').val()
    const $form = this.$('.js-uc-vip-returnVisit-form')
    const validate = $form.parsley().validate()
    // if (/^[\u4e00-\u9fa5a-zA-Z].{1,16}$/.test(name)) {
    //   this.$('.js-name').removeClass("parsley-error").addClass("parsley-success");
    //   this.$('.js-name').tooltip("hide");
    //   namevalidate = true;
    // } else {
    //   this.$('.js-name').removeClass("parsley-success").addClass("parsley-error");
    //   this.$('.js-name').tooltip("show");
    //   namevalidate = false;
    // }
    // if (!isNaN(phone) && phone.length >= 8 && phone.length <= 11) {
    //   this.$('.js-phone').removeClass("parsley-error").addClass("parsley-success");
    //   this.$('.js-phone').tooltip("hide");
    //   phonevalidate = true;
    // } else {
    //   this.$('.js-phone').removeClass("parsley-success").addClass("parsley-error");
    //   this.$('.js-phone').tooltip("show");
    //   phonevalidate = false;
    // }
    // if (question.length >= 0 && question.length <= 200) {
    //   this.$('.js-question').removeClass("parsley-error").addClass("parsley-success");
    //   this.$('.js-question').tooltip("hide");
    //   questionvalidate = true;
    // } else {
    //   this.$('.js-question').removeClass("parsley-success").addClass("parsley-error");
    //   this.$('.js-question').tooltip("show");
    //   questionvalidate = false;
    // }
    const $button = this.$('.js-uc-confirm')


    // if (namevalidate && phonevalidate && questionvalidate) {
    if (validate) {
      $button.button('loading')
      Global.sync.ajax({
        url: '/acct/returnvisit/returnvisitreq.json',
        data: {
          name: this.$('.js-name').val(),
          sex: this.$('input:radio[name="sex"]:checked').val(),
          phone: this.$('.js-phone').val(),
          question: this.$('.js-question').val(),
        },
      }).always(() => {
        $button.button('reset')
      }).done((res) => {
        // console.log(res);
        if (res && res.result === 0) {
          Global.ui.notification.show('添加回访成功！', {
            type: 'success',
          })
        } else {
          Global.ui.notification.show(`添加回访失败!${res.msg}`)
        }
      })
    } else {
      $button.button('reset')
    }
  },

  // //////
  onRender () {

  },


  // initialize: function () {
  //   _(this.options).extend({
  //     columns: [
  //       //{
  //       //  name: '发放时间',
  //       //  width: '25%'
  //       //},
  //       //{
  //       //  name: '礼金名称',
  //       //  width: '25%'
  //       //},
  //       //{
  //       //  name: '金额',
  //       //  width: '25%'
  //       //},
  //       //{
  //       //  name: '备注',
  //       //  width: '25%'
  //       //}
  //     ],
  //     gridOps: {
  //     //  emptyTip: '没有记录'
  //     },
  //     ajaxOps: {
  //     //  url: '/acct/vip/queryGiftsList.json',
  //     //  abort: false
  //     },
  //     reqData: {
  //     //  subUser: 0
  //     },
  //     //listProp: 'root.dataList',
  //     //height: 400
  //   });
  // },
  //
  // //onRender: function() {
  // //  //初始化时间选择
  // //  new Timeset({
  // //    el: this.$('.js-pf-timeset'),
  // //    startDefaultDate: this.options.startTime?this.options.startTime:_(moment().startOf('day')).toTime(),
  // //    endDefaultDate: this.options.endTime?this.options.endTime:_(moment().endOf('day')).toTime(),
  // //    endOps:{
  // //      viewMode: 'years',
  // //      format: 'YYYY/MM'
  // //    },
  // //    startOps:{
  // //      viewMode: 'years',
  // //      format: 'YYYY/MM'
  // //    }
  // //  }).render();
  // //
  // //
  // //
  // //
  // //  SearchGrid.prototype.onRender.apply(this, arguments);
  // //},
  //
  // renderGrid: function(gridData) {
  //   var rowsData = _(gridData.dataList).map(function(info, index, list) {
  //     return {
  //       columnEls: this.formatRowData(info, index, list),
  //       dataAttr: info
  //     };
  //   }, this);
  //
  //   this.grid.refreshRowData(rowsData, gridData.rowCount, {
  //     pageIndex: this.filterHelper.get('pageIndex'),
  //     initPagination: true
  //   });
  //
  //   //加上统计行
  //
  //   this.grid.addFooterRows({
  //     ////trClass: 'tr-footer',
  //     //columnEls: [
  //     //  '','<div class="text-hot">总计</div>',
  //     //  '<div class="text-hot">' + (gridData.totalMoney/10000) + '</div>',
  //     //  ''
  //     //]
  //   })
  //     .hideLoading();
  // },
  //
  // formatRowData: function(rowInfo) {
  //   var row = [];
  //   row.push(rowInfo.sendTime);
  //   row.push(rowInfo.giftsType);
  //   row.push(rowInfo.money/10000);
  //   row.push(rowInfo.remark);
  //   return row;
  // }
})

module.exports = VipReturnVisit
