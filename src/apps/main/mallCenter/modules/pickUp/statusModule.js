/**
 * Created by dean on 2017/9/8.
 */



const statusModuleView = Base.ItemView.extend({
  template: require('./index.html'),

  // 兑换优惠券 礼物 弹窗
  hintTpl: _(require('./hint.html')).template(),

  // 设定收货讯息弹窗
  formTpl: _(require('./form.html')).template(),

  // 幸运夺宝用弹窗
  resultTpl: _(require('./result.html')).template(),

  events: {
    'click .js-set-info-confirm': 'setInfoHandler',
    'click .js-my-cou-info': 'lookMyCouponHandler',
  },


  // 编辑收货地址
  editExInfoXhr (data) {
    return Global.sync.ajax({
      url: '/mall/gift/editExInfo.json',
      data,
    })
  },

  initialize () {
    const self = this
    const options = {
      status: 0, // 领取状态0成功，1失败
      moneyImg: true, // 头部背景是否显示带钱的图片
      seal: true, // 是否显示印章图片
      title: '', // 页首文字
      msg: '', // 上方文字
      text: '', // 下方文字
      type: 'hint', // hint:提示成功失败 form:填写表单
    }
    _.extend(options, {
      type: this.options.type, // template 类型

      // 兑换弹窗 参数
      status: this.options.status,
      seal: this.options.seal,
      title: this.options.title,
      moneyImg: this.options.moneyImg,
      msg: this.options.msg,
      text: this.options.text,

      // 设定收货讯息弹窗 参数
      exName: this.options.exName, // 收货人
      exAddr: this.options.exAddr, // 收货地址
      exPhone: this.options.exPhone, // 收货电话
      itemId: this.options.itemId, // 礼物Id
      showLookBtn: this.options.showLookBtn || false, // 显示查看按钮

      // 幸运夺宝弹窗 参数
      couponType: this.options.couponType,
      treasureType: this.options.treasureType,
      desc: this.options.desc, // 描述
      statName: this.options.statName, // 彩票 / 游戏 名称
      itemName: this.options.itemName,
      integral: this.options.integral,
      picUrl: this.options.picUrl, // 如果是实体礼物会有图片
      isSuccess: this.options.isSuccess, // 成功 / 失败
      validEndDate: this.options.validEndDate, // 如果是优惠券会有有效期限
      validDay: this.options.validDay, // 如果是除了代金, 现金券之外的优惠券会有这个
      awardTypeId: this.options.awardTypeId, // 奖品类型 1: 优惠券 2: 礼物 3: 积分

    })

    self.options = options
  },

  onRender () {
    const self = this
    self.$container = self.$('.js-mc-pu-content')
    self.$resultContainer = self.$('.js-treasure-content')
    if (this.options.type === 'form') {
      const formHtml = self.formTpl(self.options)
      self.$container.html(formHtml)
    } else if (this.options.type === 'treasure') {
      const resultHtml = self.resultTpl(self.options)
      self.$resultContainer.html(resultHtml)
    } else {
      const hintHtml = self.hintTpl(self.options)
      self.$container.html(hintHtml)
    }
  },

  setInfoHandler () {
    const self = this
    const clpValidate = $('.js-set-info-form').parsley().validate()

    if (clpValidate) {
      const reqData = _($('.js-set-info-form').serializeArray()).serializeObject()
      self.editExInfoXhr(reqData)
        .done((res) => {
          if (res && res.result === 0) {
            Global.ui.notification.show('收货地址提交成功，我们将尽快为您安排邮寄！', {
              type: 'success',
              btnContent: '查看',
              event() {
                self.trigger('show:myGift')
              },
            })
            self.trigger('refresh:list')
            self.trigger('hidden.dialog')
          } else {
            Global.ui.notification.show(res.msg)
            self.trigger('hidden.dialog')
          }
        })
    }
  },
  lookMyCouponHandler () {
    this.trigger('show:myCoupon')
  },
})

module.exports = statusModuleView
