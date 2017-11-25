

require('./index.scss')
const SearchGrid = require('com/searchGrid')

const VipCardView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'click .js-use-rule': 'userRule',
    'click .js-card-info': 'cardInfoClick',
  },

  getVipUseRecordXhr (pageIndex, pageSize) { // 查看vip特权卡使用记录
    return Global.sync.ajax({
      url: '/acct/vip/userprivilegelist.json',
      data: {
        pageSize, // 每页条数
        pageIndex, // 当前页数
      },
    })
  },

  getVipPriDetailXhr () { // 查看vip特权详情
    return Global.sync.ajax({
      url: '/acct/vip/userprivilegedetail.json',
    })
  },

  getVipConfirmXhr(type, tradeNo) { // 特权卡使用确认
    return Global.sync.ajax({
      url: '/acct/vip/useprivilegeconfirm.json',
      data: {
        type,
        tradeNo,
      },
    })
  },

  getVipBonusXhr (type, tradeNo) { // 领取奖金
    if (type != '') {
      return Global.sync.ajax({
        url: '/acct/vip/getprivilegebonus.json',
        data: {
          type,
          tradeNo,
        },
      })
    }
  },

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '日期',
          width: '33%',
        },
        {
          name: '特权卡种类',
          width: '34%',
        },
        {
          name: '获得奖励',
          width: '33%',
        },
      ],
      gridOps: {
        emptyTip: '没有记录',
      },
      ajaxOps: {
        url: '/acct/vip/userprivilegelist.json',
        abort: false,
      },
      reqData: {
        pageSize: 10,
        pageIndex: 0,
      },
      // listProp: root==null? '[]':'root.dataList',
      height: 320,
    })
  },


  onRender() {
    this.$recCardNum = this.$('.js-rec-card-num')
    this.$tranCardNum = this.$('.js-tran-card-num')
    this.$conCardNum = this.$('.js-con-card-num')
    this.$awardCardNum = this.$('.js-awards-card-num')
    this.$userRuleBody = ''

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    // console.log("renderGrid :"+gridData);
    const self = this

    const rowsData = _(gridData && gridData.dataList || []).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData && gridData.rowCount || 0, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })

    // 加上统计行

    this.grid.hideLoading()

    this.getVipPriDetailXhr()
      .done((res) => {
        // console.log(""+JSON.stringify(res));
        if (res.result === 0) {
          if (res.root != '' && res.root != null) {
            self.renderGridInfo(res.root)
          }
        }
      })
  },

  renderGridInfo (gridData) { // 显示各种卡剩余个数及使用规则中的数据
    const vipCfg = gridData.cfg
    const vipList = vipCfg.itemList
    const vipRate = vipCfg.rate
    const vipCount = gridData.count
    this.recCardNumber = vipCount[0] // 充值卡有多少个
    this.$recCardNum.html(vipCount[0])
    this.$tranCardNum.html(vipCount[1])
    this.$conCardNum.html(vipCount[2])
    this.$awardCardNum.html(vipCount[3])
    this.$userRuleBody = `<p><span class='font-bold'>男爵</span>每月可领取充值卡*${vipList[1].num[1]}，转运卡*${vipList[1].num[2]}，消费卡*${vipList[1].num[3]}，加奖卡*${vipList[1].num[4]}</p>` +
        `<p><span class='font-bold'>子爵</span>每月可领取充值卡*${vipList[2].num[1]}，转运卡*${vipList[2].num[2]}，消费卡*${vipList[2].num[3]}，加奖卡*${vipList[2].num[4]}</p>` +
        `<p><span class='font-bold'>伯爵</span>每月可领取充值卡*${vipList[3].num[1]}，转运卡*${vipList[3].num[2]}，消费卡*${vipList[3].num[3]}，加奖卡*${vipList[3].num[4]}</p>` +
        `<p><span class='font-bold'>侯爵</span>每月可领取充值卡*${vipList[4].num[1]}，转运卡*${vipList[4].num[2]}，消费卡*${vipList[4].num[3]}，加奖卡*${vipList[4].num[4]}</p>` +
        `<p><span class='font-bold'>公爵</span>每月可领取充值卡*${vipList[5].num[1]}，转运卡*${vipList[5].num[2]}，消费卡*${vipList[5].num[3]}，加奖卡*${vipList[5].num[4]}</p>` +
        `<p><span class='font-bold'>男爵</span>每月可领取充值卡*${vipList[6].num[1]}，转运卡*${vipList[6].num[2]}，消费卡*${vipList[6].num[3]}，加奖卡*${vipList[6].num[4]}</p>` +
        // "<p><span class='font-bold'>男爵</span>每月可领取充值卡*"+vipList[7].num[1]+"，转运卡*"+vipList[7].num[2]+"，消费卡*"+vipList[7].num[3]+"，加奖卡*"+vipList[7].num[4]+"</p>" +
        '<p>卡牌领取后只限当月使用，过期清除。</p>' +
        '<p>同种类的卡片一天只能使用一张</p>' +
        '<br>' +
        '<p><span class=\'font-bold text-hot\'>特权卡介绍</span></p>' +
        `<p><span class='font-bold'>充值卡：</span>可以获得当日任意单笔充值<span class='text-hot'>${_.formatDiv(vipRate[0], 10000)}%</span>的返利</p>` +
        `<p><span class='font-bold'>转运卡：</span>可以获得当日亏损金额<span class='text-hot'>${_.formatDiv(vipRate[1], 10000)}%</span>的返利</p>` +
        `<p><span class='font-bold'>消费卡：</span>可以获得当日消费金额<span class='text-hot'>${_.formatDiv(vipRate[2], 10000)}%</span>的返利</p>` +
        `<p><span class='font-bold'>加奖卡：</span>可以获得当日总计中奖<span class='text-hot'>${_.formatDiv(vipRate[3], 10000)}%</span>的返利</p>`
  },

  // 刷新页面数据
  renderVipRefresh () {
    const self = this
    this.getVipUseRecordXhr(0, 10)
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
    row.push(_(rowInfo.createTime).toTime('YYYY年MM月DD日 H:mm:ss'))
    switch (rowInfo.type) {
      case 1:
        var cardName = '充值卡'
        break
      case 2:
        var cardName = '转运卡'
        break
      case 3:
        var cardName = '消费卡'
        break
      case 4:
        var cardName = '加奖卡'
        break
      default:
        break
    }
    row.push(cardName)
    row.push(_.formatDiv(rowInfo.bonus, 10000))
    return row
  },

  userRule() { // 使用规则调用方法
    const self = this
    $(document).confirm({
      title: '特权卡领取规则',
      content: self.$userRuleBody,
      btnRightText: '关闭',
      btnLeft: false,
    })
  },

  getBonusConfirm(type, tradeNo) { // 领取奖金确认弹窗
    const self = this
    // console.log("getBonusConfirm type :"+ type +" tradeNo :"+ tradeNo);
    if (type != '') {
      this.getVipBonusXhr(type, tradeNo).done((res) => {
        // console.log("getBonusConfirm :"+JSON.stringify(res));
        if (res.result === 0) {
          Global.ui.notification.show('领取成功')
          self.renderVipRefresh()
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
    }
  },

  cardInfoClick (e) { // 各种卡点击事件
    const self = this
    const $target = $(e.currentTarget)
    this.cardtype = $target.attr('data-type')
    this.option = {}
    this.orderNum = ''
    if (this.cardtype === '1') {
      // if(self.recCardNumber === 0){
      //   Global.ui.notification.show("特权卡已使用完");
      // }else{
      this.getVipConfirmXhr(this.cardtype, '')
        .done((res) => {
          if (res.result === 0) {
            // if(res.msg === '无效订单'){
            const $dialog = Global.ui.dialog.show({
              title: '请输入需要领取充值礼金的订单号:',
              body: '<div class="text-center">' +
                  '<input class="js-rec-input input-lg" type="text" value="">' +
                  '<p class="text-hot js-rec-error"></p>' +
                  '</div>',
              footer: '<button class="btn btn-sun btn-linear js-submit1">确认</button>      <button class="btn btn-sun btn-linear js-hide-dialog"> 取消</div>',
            })
            $dialog.on('click', '.js-submit1', (e) => {
              const $target = $(e.currentTarget)
              const v = $dialog.find('.js-rec-input').val()
              self.$msgerror = $dialog.find('.js-rec-error')
              // console.log(v);
              if (!v || v === '') {
                self.$msgerror.html('*订单号不能为空')
              } else {
                self.getVipConfirmXhr(self.cardtype, v)
                  .done((res) => {
                    // console.log("useprivilegeconfirm.json res:"+JSON.stringify(res));
                    if (res.result === 0) {
                      $dialog.modal('hide')
                      self.orderNum = res.root.tradeNo
                      $(document).confirm({
                        title: '充值卡礼金领取：',
                        content: `<div class="text-center"><p>您的订单号：${res.root.tradeNo}充值金额：${_.formatDiv(res.root.amount, 10000)}</p><p>使用充值卡可以领取的礼金：${_.formatDiv(res.root.bonus, 10000)}</p></div>`,
                        btnLeftText: '确认领取',
                        agreeCallback() {
                          self.getBonusConfirm(self.cardtype, self.orderNum) // 调用奖金确认领取方法
                        },
                      })
                    } else {
                      // $dialog.find('.js-rec-error').removeClass("hidden"); //如果卡号无效，显示错误
                      self.$msgerror.html('*对不起，您输入的的订单号有误，请确认是否为当日有效充值订单。')
                    }
                  })
              }
            })
            $dialog.on('click', '.js-hide-dialog', (e) => {
              $dialog.modal('hide')
            })
            // }else{
            //   Global.ui.notification.show(res.msg);
            // }
          } else {
            Global.ui.notification.show(res.msg)
          }
        })


      // }
    } else {
      // 此处调用特权卡使用确认接口
      this.getVipConfirmXhr(this.cardtype, '')
        .done((res) => {
          // console.log(res);
          if (res.result === 0) {
            switch (self.cardtype) {
              case '2':
                self.option.title = '转运卡礼金领取：'
                self.option.content = `${'<div class="text-center">' +
                      '<p>您当日累计的亏损金为:'}${_.formatDiv(res.root.amount, 10000)}</p>` +
                      `<p>使用转运卡可以领取的礼金：${_.formatDiv(res.root.bonus, 10000)}</p>` +
                      '</div>'
                break
              case '3':
                self.option.title = '消费卡礼金领取：'
                self.option.content = `${'<div class="text-center">' +
                      '<p>您当日累积的有效投注金额为：'}${_.formatDiv(res.root.amount, 10000)}</p>` +
                      `<p>使用消费卡可以领取的礼金：${_.formatDiv(res.root.bonus, 10000)}</p>` +
                      '</div>'
                break
              case '4':
                self.option.title = '加奖卡礼金领取：'
                self.option.content = `${'<div class="text-center">' +
                      '<p>您当日累积的中奖金额为：'}${_.formatDiv(res.root.amount, 10000)}</p>` +
                      `<p>使用加奖卡可以领取的礼金：${_.formatDiv(res.root.bonus, 10000)}</p>` +
                      '</div>'
                break
            }
            self.option.btnLeftText = '确认领取'
            $(document).confirm({
              title: self.option.title,
              content: self.option.content,
              btnLeftText: self.option.btnLeftText,
              agreeCallback() {
                self.getBonusConfirm(self.cardtype, '')
              },
            })
          } else {
            Global.ui.notification.show(res.msg)
          }
        })
    }
  },

})

module.exports = VipCardView
