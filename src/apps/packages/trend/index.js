import Vue from 'vue'
// import store from '../store/index'

require('./index.scss');
require('./../misc/common-init.js');

var ticketConfig = require('./config');
var Draw = require('./draw-line');

var BtnGroup = require('com/btnGroup');

$.widget('gl.trend', {

  template: require('./index.html'),
  tableTpl: _(require('./table.html')).template(),
  tableTpl_mmc: _(require('./table-mmc.html')).template(),
  tableTpl_hg:_(require('./table-hg.html')).template(),
  tableTpl_mark6:_(require('./table-mark6.html')).template(),

  getDataXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/trendDetail.json',
      data: data
    });
  },

  _create: function () {
    var self = this;
    this.ticketId = Number(_.getUrlParam('ticketId'));
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr();
    this.ticketInfo = ticketConfig.get(this.ticketId);

    this.element.html(_(this.template).template()({
      zhName: this.ticketInfo.zhName,
      mark6TicketIdArr: this.mark6TicketIdArr,
      ticketId: this.ticketId
    }));

    this.$btnGroup = this.element.find('.js-plan-select');
    this.$planTable = this.element.find('.js-plan-table');
    this.$pageToggle = this.element.find('.js-toggle-btn-group');

    var btnConfig = [
      {
        title: '最近30期',
        value: 30,
        active: true
      },
      {
        title: '最近50期',
        value: 50
      },
      {
        title: '最近100期',
        value: 100
      }
    ];

    if (this.ticketInfo.oneDay) {
      btnConfig.push({
        title: '最近一天',
        value: this.ticketInfo.oneDay
      });
    }

    // if(this.ticketId===21){
    //   btnConfig.push({
    //     title: '查看原始号源',
    //     value: 60
    //   });
    // }
    if(this.ticketInfo.viewNumber && this.ticketId != 32){
      btnConfig.push({
        title: '查看原始号源',
        value: 60
      });
    }

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      inputName: 'pageSize',
      btnGroup: btnConfig,
      onBtnClick: function(offset) {
        self.update(offset);
      }
    }).render();

    this.$ticketList = this.element.find('.ticketList');
    this.$ticketList.find("option[value=" + this.ticketId +"]").attr('selected', true);
    this.$ticketList.on('change', function (e) {
      var href = window.location.href;
      var newHref = href.substring(0, href.lastIndexOf("="));
      window.location.href = newHref + "=" + $(this).val();
    });

    if(this.ticketInfo.id == 18) {
      this.$pageToggle.removeClass('hidden');
    }
    // 北京赛车/PK拾分页展示
    // this.$pageToggle.find('.js-toggle-page1').bind('click', function() {
    //   $(this).addClass('active');
    //   $(this).siblings().removeClass('active');
    //   $('.col0').css('display', 'table-cell');
    //   $('.col1').css('display', 'table-cell');
    //   $('.col2').css('display', 'table-cell');
    //   $('.col3').css('display', 'table-cell');
    //   $('.col4').css('display', 'table-cell');
    //   $('.col5').css('display', 'none');
    //   $('.col6').css('display', 'none');
    //   $('.col7').css('display', 'none');
    //   $('.col8').css('display', 'none');
    //   $('.col9').css('display', 'none');
    //   self.draw(0);
    // });
    // this.$pageToggle.find('.js-toggle-page2').bind('click', function() {
    //   $(this).addClass('active');
    //   $(this).siblings().removeClass('active');
    //   $('.col0').css('display', 'none');
    //   $('.col1').css('display', 'none');
    //   $('.col2').css('display', 'none');
    //   $('.col3').css('display', 'none');
    //   $('.col4').css('display', 'none');
    //   $('.col5').css('display', 'table-cell');
    //   $('.col6').css('display', 'table-cell');
    //   $('.col7').css('display', 'table-cell');
    //   $('.col8').css('display', 'table-cell');
    //   $('.col9').css('display', 'table-cell');
    //   self.draw(60);
    // });
    window.onresize = function () {
      if(_.indexOf(self.mark6TicketIdArr, parseInt(self.ticketId))<0){
        window.location.href = window.location.href;
      }
    }
  },

  draw: function(offset) {
    var self = this;
    var $body = $('body');

    if($body.width() < 1366) {
      $body.width(1366);
      this.element.find('.history_code').css('width', this.element.find("#chartsTable").width());
    }

    var colors = ['#FFAAAA', '#B9B9FF', '#FFAAAA', '#B9B9FF', '#FFAAAA', '#B9B9FF', '#FFAAAA', '#B9B9FF', '#FFAAAA', '#B9B9FF'];
    var num = this.ticketInfo.num.length;

    $body.find('canvas').remove();
    Draw.Chart.init();
    Draw.DrawLine.bind("chartsTable","has_line");

    if (self.ticketInfo.id == 18) {
      if (offset) {
        _(self.ticketInfo.count).times(function(index) {
          Draw.DrawLine.color(colors[index]);
          Draw.DrawLine.add((parseInt(index) * num + offset + 1), 2, num, 0);
        });
      } else {
        _(self.ticketInfo.count).times(function(index) {
          Draw.DrawLine.color(colors[index]);
          Draw.DrawLine.add((parseInt(index) * num + 10 + 1), 2, num, 0);
        });
      }
    }else if (self.ticketInfo.id == 6 || self.ticketInfo.id == 16 || self.ticketInfo.id == 17|| self.ticketInfo.id == 29) {
      _(self.ticketInfo.count).times(function(index) {
        Draw.DrawLine.color(colors[index]);
        Draw.DrawLine.add((parseInt(index) * num + 3 + 1), 2, num, 0);
      });
    } else {
      _(self.ticketInfo.count).times(function(index) {
        Draw.DrawLine.color(colors[index]);
        Draw.DrawLine.add((parseInt(index) * num + 5 + 1), 2, num, 0);
      });
    }


    if (self.ticketInfo.id == 19){
      _(self.ticketInfo.count).times(function(index) {
        Draw.DrawLine.color(colors[index]);
        Draw.DrawLine.add((parseInt(index) * num + 5 + 0), 2, num, 0);
      });

    }

    Draw.DrawLine.draw(Draw.Chart.ini.default_has_line);
  },

  update: function(pageSize) {
    var self = this;

    var isNumberDistributed = true;
    if(_.indexOf(this.mark6TicketIdArr, parseInt(this.ticketId))>-1 || this.ticketId===19){
      isNumberDistributed = false;
    }
    var xhrData = {
      ticketId: this.ticketId,
      lastOpenNum: pageSize,
      isNumberDistributed: isNumberDistributed
    };

    this.getDataXhr(xhrData)
        .done(function(res) {
          if (res && res.result === 0) {
            self.openedList = res.root.openedList || [];
            self.showNum = res.root.showNum || [];
            self.avgMissingCount = res.root.avgMissingCount || [];
            self.maxMissingCount = res.root.maxMissingCount || [];
            self.maxRepeatShowCount = res.root.maxRepeatShowCount || [];
            self.distributed = res.root.distributed || [];
            // self.openedList = res.root.openedList || [];
            var temp = self.tableTpl;
            if(self.ticketId===19){//MMC不显示期号
              temp = self.tableTpl_mmc;
            // }else if (self.ticketId===21&&pageSize===60){
            //   temp = self.tableTpl_hg;
            // }
            }else if (self.ticketInfo.viewNumber&&pageSize===60){
              temp = self.tableTpl_hg;
            }else if (_.indexOf(self.mark6TicketIdArr, parseInt(self.ticketId))>-1){
              temp = self.tableTpl_mark6;
            }

            if(_.indexOf(self.mark6TicketIdArr, parseInt(self.ticketId))>-1){

              self.getMarkSixSxNumber({ticketId: self.ticketId}).done(function (numRes) {
                if (numRes && numRes.result === 0) {

                  var mark6SxNumber = _.sortBy(numRes.root.spNums, 'id');

                  $.each(self.openedList, function (index, item) {
                    item.numInfo = [];
                    item.sumVal = 0;
                    item.tmNumType = '';
                    item.tmNumEvenOrOdd = '';
                    item.sumValType = '';
                    item.sumValEvenOrOdd = '';
                    var ticketOpenNumArr = item.ticketOpenNum.split(',');
                    $.each(ticketOpenNumArr, function (numIndex, num) {
                      var numInfo = {};
                      numInfo.num = num;
                      if(_.indexOf(self.ticketInfo.color.redArr, parseInt(num))>-1){
                        numInfo.color = "red";
                      }else if(_.indexOf(self.ticketInfo.color.blueArr, parseInt(num))>-1){
                        numInfo.color = "blue";
                      }else{
                        numInfo.color = "green";
                      }
                      $.each(mark6SxNumber, function (mark6SxNumIndex, mark6SxNum) {
                        if(_.indexOf(mark6SxNum.nums, num) > -1){
                          numInfo.sx = mark6SxNum.name;
                        }
                      });
                      item.numInfo.push(numInfo);
                      item.sumVal += parseInt(num);
                      if(numIndex==ticketOpenNumArr.length-1){
                        item.tmNumType = num == 49 ? '和' : num <= 24 ? '小' : '大';
                        item.tmNumEvenOrOdd = num % 2 == 0 ? '双' : '单';
                      }
                    });
                    item.sumValType = item.sumVal <= 174 ? '小' : '大';
                    item.sumValEvenOrOdd = item.sumVal % 2 == 0 ? '双' : '单';
                  });

                  self.$planTable.html(temp({
                    ticketInfo: self.ticketInfo,
                    list: self.openedList
                  }));
                }
              });

            }else{
              self.$planTable.html(temp({
                positions: self.ticketInfo.positions,
                isSuper: self.ticketInfo.isSuper,
                num: self.ticketInfo.num,
                count: self.ticketInfo.count,
                list: self.openedList,
                repeatArr:self.showNum,
                AverageNum:self.avgMissingCount,
                maxMissNum:self.maxMissingCount,
                maxEqualNum:self.maxRepeatShowCount,
                distributed:self.distributed
              }));
              self.draw();
            }
          }else{
              Global.ui.notification.show(res.msg === 'fail' ? '数据查询失败' : res.msg);
          }
        });
  },
  // 获取六合彩生肖对应的号码
  getMarkSixSxNumber: function(data){
    return Global.sync.ajax({
      url: '/ticket/ticketmod/spNum.json',
      data: data
    });
  }
});


$(document).ready(function() {
  Global.m.oauth.check().done(function(res) {
    $('.js-package').trend().removeClass('package-main');
  });
});
