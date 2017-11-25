

const SearchGrid = require('com/searchGrid')


const VipFestivalView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'click .js-get-gift': 'getPrize',
  },


  getPrize() {
    const self = this
    this.getPrizeXhr().done((res) => {
      // console.log(JSON.stringify(res));
      if (res && res.result == 0) {
        console.log(res)
        const dialogBody = `${'<div class=" fc-re-resultShow text-center">' +
              '<div class="text-center font-sm m-bottom-md ">' +
              '尊敬的<span class="fc-re-result-desc">'}${self.levelName(res.root.level)}</span>，祝您${res.root.holidayName}快乐！<br>无限娱乐特别为您准备了<span class="fc-re-result-desc">${res.root.bonus / 10000}</span>元节日礼金</div>` +
              '</div>'
        $(document).confirm({
          title: '提示',
          content: dialogBody,
          agreeCallback() {
            self.getPrizeXhr1({
            }).done((res) => {
              if (res && res.result === 0) {
                Global.ui.notification.show('领取成功')
                self.renderRefreshData()
              } else {
                Global.ui.notification.show(res.msg)
              }
            })
          },
        })


        // $dialog.on('click', '.js-submit1', function(e) {
        //   var $target = $(e.currentTarget);
        //
        //   self.getPrizeXhr1({
        //   }).done(function(res) {
        //       if (res && res.result === 0) {
        //         Global.ui.notification.show('领取成功。');
        //         $dialog.modal('hide');
        //       } else {
        //         Global.ui.notification.show(res.msg);
        //       }
        //     });
        // });
      } else {
        const $dialog = Global.ui.dialog.show({
          title: '温馨提示',
          body: `${'<div class=" fc-re-resultShow text-center">' +
          '<div class="text-center font-sm m-bottom-md fc-re-result-desc">'}${res.msg}</div>` +
          '</div>',
          footer: '',
        })
      }
    })
  },

  getHolidayListXhr() {
    return Global.sync.ajax({
      url: '/acct/vip/holidaygiftscfg.json',
    })
  },

  getPrizeXhr () {
    return Global.sync.ajax({
      url: '/acct/vip/holidaygiftsbonusconfirm.json',
    })
  },

  getPrizeXhr1 () {
    return Global.sync.ajax({
      url: '/acct/vip/dogetholidaybonus.json',
    })
  },

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '日期',
          width: '20%',
        },
        {
          name: '节日类型',
          width: '20%',
        },
        {
          name: '金额',
          width: '30%',
        },
        {
          name: '  ',
          width: '30%',
        },
      ],
      gridOps: {
        emptyTip: '没有记录',
      },
      ajaxOps: {
        url: '/acct/vip/holidaygiftscfg.json',
        abort: false,
      },
      reqData: {
        subUser: 0,
      },
      tip: '', // <div class="m-left-md"><span>提示：</span></div>
      listProp: 'root.itemList',
      height: 370,
    })
  },

  onRender() {
    SearchGrid.prototype.onRender.apply(this, arguments)

    const acctInfo = Global.memoryCache.get('acctInfo')
    this.$('.js_vipLevel').html(this.levelName(acctInfo.memberLevel))
  },

  levelName (level) {
    let levelName = ''
    switch (parseInt(level)) {
      case 0: levelName = '骑士'; break
      case 1: levelName = '男爵'; break
      case 2: levelName = '子爵'; break
      case 3: levelName = '伯爵'; break
      case 4: levelName = '侯爵'; break
      case 5: levelName = '公爵'; break
      case 6: levelName = '大公'; break
    }
    return levelName
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.itemList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })

    // 加上统计行

    this.grid.addFooterRows({

    })
      .hideLoading()
  },
  // 刷新页面数据
  renderRefreshData () {
    const self = this
    this.getHolidayListXhr()
      .done((res) => {
        if (res.result === 0) {
          self.renderGrid(res.root)
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },
  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.holidayTime)
    row.push(rowInfo.holidayName)
    row.push(`${rowInfo.giftName + rowInfo.giftAmount / 10000}元`)
    if (rowInfo.status === 0) {
      row.push('<button class="btn btn-sun btn-linear js-get-gift">领取礼金</button>')
    } else if (rowInfo.status === 1) {
      row.push('<button class="btn btn-grey" disabled>已领取</button>')
    } else {
      row.push('<button class="btn btn-grey" disabled>领取礼金</button>')
    }

    return row
  },

})

module.exports = VipFestivalView
