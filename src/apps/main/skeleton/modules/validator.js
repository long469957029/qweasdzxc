"use strict";

require('parsleyjs');
require('parsleyjs/dist/parsley.remote');
require('parsleyjs/src/i18n/zh_cn');

var ValidatorModule = Base.Module.extend({

  startWithParent: false,

  initialize: function() {
    ParsleyConfig.errorsWrapper = '<div class="tooltip bottom parsley-errors-list tooltip-error"><span class="sfa sfa-error-icon vertical-sub pull-left"></span></div>';
    ParsleyConfig.errorTemplate =  '<div class="tooltip-inner">';
    ParsleyConfig.trigger = 'blur';

    ParsleyValidator.addValidator('zhmaxlength', function (value, maxLength) {
      return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= (maxLength * 2);
    }, 31)
      .addMessage('zh_cn', 'zhmaxlength', '不能超过%s个汉字');

    //
    ParsleyValidator.addValidator('zhlength', function (value, lengthArr) {
      return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= (lengthArr[1]) &&
        value.replace(/[\u4e00-\u9fa5]/g, '**').length >= (lengthArr[0]);
    }, 32)
      .addMessage('zh_cn', 'zhlength', '长度要在%s到%s个字符之间');

    ParsleyValidator.addValidator('nospecialchar', function (value) {
      var myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
      return !myReg.test(value);
    }, 32)
      .addMessage('zh_cn', 'nospecialchar', '您输入的值不可包含特殊字符');

    ParsleyValidator.addValidator('notequalto', function (value, selector) {
      return value !== $(selector).val();
    }, 34).addMessage('zh_cn', 'notequalto', '两个值不能一致');

    ParsleyValidator.addValidator('qq', function (value, id) {
      var myReg = /^[1-9][0-9]{4,15}$/;
      return myReg.test(value);
    }, 35)
      .addMessage('zh_cn', 'qq', 'QQ格式不正确');

    ParsleyValidator.addValidator('email', function(value, id) {
      var myReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return myReg.test(value);
    }, 36)
      .addMessage('zh_cn', 'email', '请输入一个有效的电子邮箱地址');

    ParsleyValidator.addValidator('zhandletnummaxlen', function (value,maxLength) {
      var myReg = /^[A-Za-z0-9\u4E00-\u9FA5]+$/;
      if (myReg.test(value)) {
        return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= (maxLength * 2);
      } else {
        return false;
      }
    }, 37)
      .addMessage('zh_cn', 'zhandletnummaxlen', '只能输入中文和字母和数字，不能超过%s个字符');

    ParsleyValidator.addValidator('useruname', function (value) {
      var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
      if (myReg.test(value)) {
        return value.replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && value.replace(/[\u4e00-\u9fa5]/g, '**').length <= 16;
      } else {
        return false;
      }
    }, 38)
      .addMessage('zh_cn', 'useruname', '4-16个字符，支持中英文和数字，不能以数字开头');

    // ParsleyValidator.addValidator('customername', function (value) {
    //   var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z\u4e00-\u9fa5]*$/;
    //   if (myReg.test(value)) {
    //     return value.replace(/[\u4e00-\u9fa5]/g, '**').length >= 2 && value.replace(/[\u4e00-\u9fa5]/g, '**').length <= 16;
    //   } else {
    //     return false;
    //   }
    // }, 38)
    //   .addMessage('zh_cn', 'customername', '2-16个字符，支持中英文');


    ParsleyValidator.addValidator('twodecimal', function (value) {
      var myReg = /^(0|[1-9][0-9]*)(.\d{1,2})?$/;//小数点后两  位
      return myReg.test(value);
    }, 39)
      .addMessage('zh_cn', 'twoDecimal', '值最多能精确到小数点后两位');

    ParsleyValidator.addValidator('onedecimal', function (value) {
      var myReg = /^(0|[1-9][0-9]*)(.\d{1})?$/;//小数点后两  位
      return myReg.test(value);
    }, 40)
      .addMessage('zh_cn', 'onedecimal', '值最多能精确到小数点后一位');

    ParsleyValidator.addValidator('username', function (value) {
      var myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/;
      return myReg.test(value);
    }, 41)
      .addMessage('zh_cn', 'username', '仅支持4-16位字符，不能以数字开头');

    ParsleyValidator.addValidator('zhandldbmaxlen', function (value,maxLength) {
      var myReg = /^[A-Za-z\u4E00-\u9FA5](([. \u00B7])?([A-Za-z\u4E00-\u9FA5])+)+$/;
      if (myReg.test(value)) {
        return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= (maxLength*2);
      } else {
        return false;
      }
    }, 42)
      .addMessage('zh_cn', 'zhandldbmaxlen', '请填写有效的开户人姓名');//只能输入中文、字母、点和空格,不能以空格和点开头或结尾，不能出现连续的点或空格,不能超过%s个字

    ParsleyValidator.addValidator('phone', function (value) {
      var myReg = /^[0-9]{11,11}$/;
      return myReg.test(value);
    }, 43)
      .addMessage('zh_cn', 'phone', '手机号格式不正确');

    ParsleyValidator.addValidator('customername', function (value) {
      var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
      if (myReg.test(value)) {
        return value.length >= 2 && value.length <= 16;
      } else {
        return false;
      }
    }, 44)
      .addMessage('zh_cn', 'customername', '2-16个字符，支持中英文和数字，不能以数字开头');


    ParsleyValidator.addValidator('shouldhavecenter', function (value, selector) {
      return value==0 || $(selector).val()==0;
    }, 45).addMessage('zh_cn', 'shouldhavecenter', '只能从中心钱包转入或转出');


    ParsleyValidator.addValidator('password', function (value, selector) {
      return !(!isNaN(password) && password.length < 9);
    }, 46).addMessage('zh_cn', 'password', '不能是9位以下的纯数字（≤8个阿拉伯数字）');

  }
});

module.exports = ValidatorModule;
