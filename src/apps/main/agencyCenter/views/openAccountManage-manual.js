

const OpenAccountManageView = Base.ItemView.extend({

  template: require('agencyCenter/templates/openAccountManage-manual.html'),
  startOnLoading: true,
  events: {
    'click .js-ac-submitOpenAccountInfo': 'submitOpenAccountInfoHandler',
    'blur .js-ac-userName': 'checkUserName',
    // 'click .js-ac-ticket-link': 'ticketPriceViewHandler',
    'blur .js-ac-manual-rebate': 'inputRebateHandler',
    'blur .js-ac-password': 'checkUserPassword',
    // 'blur .js-ac-repeatPassword': 'checkRepeatPassword',
    'click .js-look-bonus': 'lookBonusViewHandler',
  },
  getSubAcctXhr() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json',
      abort: false,
    })
  },
  checkUserExistXhr(data) {
    return Global.sync.ajax({
      url: '/acct/userinfo/userexist.json',
      data,
      async: false,
    })
  },
  initialize() {
    // this.subSubAcctXhr = this.getSubAcctXhr();
  },

  onRender() {
    const self = this

    this.$limit = this.$('.js-ac-quota-container')

    this.$acUserName = this.$('.js-ac-userName')
    this.$acPassword = this.$('.js-ac-password')
    this.$acmanualRebate = this.$('.js-ac-manual-rebate')
    this.$acBonusRangePrompt = this.$('.js-ac-bonus-range-Prompt')
    this.$acOpenAccountManualForm = this.$('.js-ac-openAccountManual-form')
    this.$acUserType = this.$('.js-ac-userType')
    this.$acManualRebateInfo = this.$('.js-ac-manual-rebate-info')

    // this.$acRepeatPassword = this.$('.js-ac-repeatPassword');

    // this.getSubAcctXhr().always(function(){
    //   self.loadingFinish();
    // })
    //   .done(function(res) {
    //     var data = res.root.seriesList;
    //
    //     if (res && res.result === 0) {
    //
    // 	  self._getTable( _(data.ticketSeriesList).map(function(ticketSeries) {
    //           return {
    //             sericeName: ticketSeries.sericeName,
    //             maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
    //             subAcctRebate: data.subRebateRange.subAcctRebate,
    //             maxRebate: data.subRebateRange.rebateMax,
    //             minRebate: data.subRebateRange.rebateMin
    //           };
    //         }));
    //       self._parentView.renderLimit(self.$limit,res.root.quotaList);
    //
    //       var acctInfo = Global.memoryCache.get('acctInfo');
    //       if(acctInfo.merchant) {
    //     	  self.$('.js-ac-rebate-set-container').hide();
    //       }
    //     }
    //   });

    this.getSubAcctXhr().always(() => {
      self.loadingFinish()
    })
      .done((res) => {
        const data = res.root.seriesList

        if (res && res.result === 0) {
          // self._getTable( _(data.ticketSeriesList).map(function(ticketSeries) {
          //   return {
          //     sericeName: ticketSeries.sericeName,
          //     maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
          //     subAcctRebate: data.subRebateRange.subAcctRebate,
          //     maxRebate: data.subRebateRange.rebateMax,
          //     minRebate: data.subRebateRange.rebateMin
          //   };
          // }));

          const subRebateRange = data.subRebateRange
          self.$acmanualRebate.val(_(subRebateRange.subAcctRebate).formatDiv(10, { fixed: 1 }))
          self.$acmanualRebate.attr('data-parsley-range', `[${_(subRebateRange.rebateMin).formatDiv(10, { fixed: 1 })},${_(subRebateRange.rebateMax).formatDiv(10, { fixed: 1 })}]`)
          const subRebateRangePrompt = `${subRebateRange.rebateMin}～${_(subRebateRange.rebateMax > 130 ? 130 : subRebateRange.rebateMax).formatDiv(10, { fixed: 1 })}`

          self.$acBonusRangePrompt.html(subRebateRangePrompt)

          self._parentView.renderLimit(self.$limit, res.root.quotaList)

          const acctInfo = Global.memoryCache.get('acctInfo')
          if (acctInfo.merchant) {
            self.$acUserType.find('button').eq(1).remove()
            self.$acManualRebateInfo.hide()
            self.$acmanualRebate.val(_(acctInfo.userRebate).formatDiv(10, { fixed: 1 })).attr('disabled', 'disabled')
          }
        }
      })
  },

  // _getTable: function(tableInfo) {
  //   var self = this;
  //   this.$('.js-ac-rebate-set-container').staticGrid({
  //     tableClass: 'table table-bordered table-center',
  //     colModel: [
  //       {label: '彩种系列', name: 'sericeName', width: '30%',formatter: function(val,index,info){
  //         var ticket = '';
  //         if(val==='时时彩'){
  //           ticket = 'constant';
  //         }else if(val==='十一选五'){
  //           val = '11选5';
  //           ticket = 'elev';
  //         }else if(val==='低频彩'){
  //           ticket = 'low';
  //         }else if(val==='快乐彩') {
  //           ticket = 'happy';
  //         }
  //
  //         // else if(val==='秒秒彩') {
  //         //   ticket = 'mmc';
  //         // }
  //
  //         return '<a class="js-ac-ticket-link btn-link text-pleasant" data-ticket="'+ticket+'">'+val+'</a>';
  //       }},
  //       {label: '最高奖金', name: 'maxBonus', width: '30%',formatter: function(val,index,info){
  //         return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="'+val+'" data-name="'+info.sericeName+'">' +
  //           self.calculateMaxBonus(info.sericeName,_(info.subAcctRebate).formatDiv(10),val)+'</span>';
  //       }},
  //       {label: '下级返点', name: 'subAcctRebate',width:'40%', merge: true, formatter: function(val, index, info) {
  //         return '<input type="text" class="js-ac-manual-rebate " value="' + _(val).formatDiv(10,{fixed:1}) + '" data-parsley-oneDecimal data-parsley-range="['+_(info.minRebate).formatDiv(10,{fixed:1})+','+_(info.maxRebate).formatDiv(10,{fixed:1})+']" > %<div class="text-center">可配置范围(' +
  //           info.minRebate +  '～' + _(info.maxRebate>130?130:info.maxRebate).formatDiv(10,{fixed:1}) + ')</div>';
  //       }}
  //     ],
  //     row: tableInfo
  //   });
  // },

  // TODO 手工开户提交
  submitOpenAccountInfoHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    // var $cardBindingForm = $('.js-ac-openAccountManual-form');
    // var clpValidate = $cardBindingForm.parsley().validate();

    const rebateValidate = this.$acOpenAccountManualForm.parsley().validate()

    if (this.checkUserName() && this.checkUserPassword() &&　rebateValidate) {
      $target.button('loading')
      const acctInfo = Global.memoryCache.get('acctInfo')
      if (acctInfo.merchant) {
        this.$('.js-ac-manual-rebate').val(13)
      }

      const globalData = {
        userName: this.$acUserName.val(),
        loginPwd: this.$acPassword.val(),
        rebate: _(this.$acmanualRebate.val()).formatMul(10),
      }
      
      const userType = this.$acUserType.find('button.active').data('type')
      Global.sync.ajax({
        url: '/acct/subaccount/savesubacct.json',
        data: {
          userName: this.$acUserName.val(),
          loginPwd: this.$acPassword.val(),
          rebate: _(this.$acmanualRebate.val()).formatMul(10),
          userType,
        },
      }).always(() => {
        $target.button('reset')
      })
        .done((res) => {
          if (res && res.result === 0) {
            self.showCopyDailog(globalData)

            self.render()
          } else {
            Global.ui.notification.show(`保存失败，${res.msg}`)
          }
        })
    }
  },
  checkUserName() {
    const self = this

    const acUserNameVal = this.$acUserName.val()
    const $parentDiv = this.$acUserName.parent()
    let isValidate = false

    const userNameReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
    $parentDiv.find('.js-errorTooltip').remove()

    if (acUserNameVal === '') {
      this.changeEleClass(this.$acUserName, 'error')
      $parentDiv.append(this.getErrorTooltip('用户名不能为空'))
    } else if (userNameReg.test(acUserNameVal)) {
      this.checkUserExistXhr({ username: acUserNameVal }).fail(() => {
      }).done((res) => {
        if (res.result === 0) {
          self.changeEleClass(self.$acUserName, 'success')
          $parentDiv.find('.js-errorTooltip').remove()
          isValidate = true
        } else {
          self.changeEleClass(self.$acUserName, 'error')
          $parentDiv.append(self.getErrorTooltip(res.msg))
        }
      })
    } else {
      this.changeEleClass(this.$acUserName, 'error')
      $parentDiv.append(this.getErrorTooltip('4-16个字符，支持中英文和数字，不能以数字开头'))
    }
    return isValidate
  },
  // ticketPriceViewHandler: function(e){
  //    var $target = $(e.currentTarget);
  //   var ticket = $target.data('ticket');
  //   var rebate = Number(this.$('.js-ac-manual-rebate').val());
  //   if(_(rebate).isNumber()&& _(rebate).isFinite()){
  //     Global.appRouter.navigate('#ac/oam/pd/'+ticket+'?rebate='+rebate,{trigger: true, replace: false});
  //   }else{
  //     Global.ui.notification.show('请输入有效的返点值。');
  //   }
  // },
  lookBonusViewHandler (e) {
    const $target = $(e.currentTarget)
    const ticket = $target.data('ticket')
    const rebate = Number(this.$('.js-ac-manual-rebate').val())
    if (_(rebate).isNumber() && _(rebate).isFinite()) {
      Global.appRouter.navigate(`#ac/oam/pd/${ticket}?rebate=${rebate}`, { trigger: true, replace: false })
    } else {
      Global.ui.notification.show('请输入有效的返点值。')
    }
  },
  inputRebateHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const range = eval($target.data('parsley-range'))
    const rebate = Number($target.val())
    if (rebate !== '' && _(rebate).isFinite() && range.length == 2) {
      if (rebate < range[0]) {
        $target.val(range[0])
      } else if (rebate > range[1]) {
        $target.val(range[1])
      }
    } else {
      $target.val(range[0])
    }
    // rebate = Number($target.val());
    // var $maxBonus = $target.parent().parent().parent().find('.js-ac-openAccount-maxBonus');
    // _($maxBonus).each(function(item,index){
    //   var $item = $(item);
    //   var maxBonus = $item.data('maxbonus');
    //   var ticketName = $item.data('name');
    //   $item.html(self.calculateMaxBonus(ticketName,rebate,maxBonus));
    // });
  },

  showCopyDailog(data) {
    const $dialog = Global.ui.dialog.show({
      title: '开户成功',
      size: 'modal-md',
      body: `${'<form><div class="p-left-lg m-bottom-lg m-top-lg">' +
      '<div class="control-group m-left-sm p-left-lg m-top-md  m-bottom-md"><label class="text-left">账号:&nbsp;&nbsp;&nbsp;&nbsp;  '}${data.userName}</label></div>` +
      `<div class="control-group m-left-sm p-left-lg m-top-md  m-bottom-md"><label class="text-left">密码:&nbsp;&nbsp;&nbsp;&nbsp;  ${data.loginPwd}</label></div>` +
      `<div class="control-group m-left-sm p-left-lg m-top-md  m-bottom-md"><label class="text-left">返点:&nbsp;&nbsp;&nbsp;&nbsp;  ${_(data.rebate).formatDiv(10, { fixed: 1 })}</label></div></div>` +
      '<div class="m-top-lg m-bottom-lg"><button type="button" class="js-ac-ocm-copy ac-ocm-copy btn btn-sun" data-dismiss="modal"><span class="sfa ac-ocm-copy-coin m-right-sm"></span>复制并关闭</button></div></form>',
      bodyClass: 'p-top-xs p-left-lg p-right-lg text-center',
    })

    $dialog.on('hidden.modal', function () {
      $(this).remove()
    })

    //
    $dialog.find('.js-ac-ocm-copy').textCopy({
      text: `账号：${data.userName 
      }\n密码：${data.loginPwd 
      }\n返点：${_(data.rebate).formatDiv(10, { fixed: 1 })}`,
      notShowToolTip: true,
    })
  },
  
  // calculateMaxBonus: function(ticketName,rebate,maxBonus){
  //
  //   var baseNum = 20;
  //   if(ticketName === '十一选五'){
  //     baseNum = 19.8;
  //   }
  //   if(ticketName === '快乐彩') {
  //     baseNum = 14.4;
  //   }
  //   return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  // },

  checkUserPassword () {
    const acPwVal = this.$acPassword.val()
    const $parentDiv = this.$acPassword.parent()
    const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
    let isValidate = false

    $parentDiv.find('.js-errorTooltip').remove()
    if (acPwVal === '') {
      this.changeEleClass(this.$acPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('密码不能为空'))
    } else if (acPwVal.length < 9 && this.strBetweenIsNumber(acPwVal, 0, 7)) {
      this.changeEleClass(this.$acPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else if (!pwReg.test(acPwVal)) {
      this.changeEleClass(this.$acPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else {
      this.changeEleClass(this.$acPassword, 'success')
      $parentDiv.find('.js-errorTooltip').remove()
      isValidate = true
    }
    return isValidate
  },

  // checkRepeatPassword: function () {
  //   var acPwVal = this.$acPassword.val();
  //   var acRepeatPwVal = this.$acRepeatPassword.val();
  //   var $parentDiv = this.$acRepeatPassword.parent();
  //   var isValidate = false;
  //
  //   $parentDiv.find('.js-errorTooltip').remove();
  //   if(acRepeatPwVal===''){
  //
  //     this.changeEleClass(this.$acRepeatPassword, 'error');
  //     $parentDiv.append(this.getErrorTooltip('确认密码不能为空'));
  //   }else if(acPwVal!==acRepeatPwVal){
  //
  //     this.changeEleClass(this.$acRepeatPassword, 'error');
  //     $parentDiv.append(this.getErrorTooltip('两次密码输入不一致'));
  //   } else{
  //
  //     this.changeEleClass(this.$acRepeatPassword, 'success');
  //     $parentDiv.find('.js-errorTooltip').remove();
  //     isValidate = true;
  //   }
  //   return isValidate;
  // },

  getErrorTooltip (errorText) {
    const errorHtml =
      `${'<div class="js-errorTooltip tooltip bottom parsley-errors-list filled">' +
      '<div class="tooltip-arrow"></div>' +
      '<div class="tooltip-inner">'}${errorText}</div>` +
      '</div>'
    return errorHtml
  },

  strBetweenIsNumber (str, star, end) {
    const strArr = str.split('').slice(star, end)
    let isHasNumber = true
    $.each(strArr, (index, item) => {
      if (!$.isNumeric(item)) {
        isHasNumber = false
      }
    })
    return isHasNumber
  },

  changeEleClass ($ele, status) {
    if (status == 'success') {
      $ele.addClass('parsley-success').removeClass('parsley-error')
    } else if (status == 'error') {
      $ele.addClass('parsley-error').removeClass('parsley-success')
    }
  },

})

module.exports = OpenAccountManageView
