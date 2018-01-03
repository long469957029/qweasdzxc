const TransferView = require('./userTransfer')

const LowLevelMoneyTransferView = TransferView.extend({

  initialize(options) {
    _(this.options).extend({
      reqData: {
        userId: options.userId,
        username: _.getUrlParam('name'),
      },
      triggerTab: 'jsfctfut',
    })
    TransferView.prototype.initialize.apply(this, arguments)

    // this.template = '<div class="clearfix">' +
    //  '<button class="btn btn-sm btn-inverse pull-right sub-return" type="button">返回</button>' +
    //  '<label>给' + _.getUrlParam('name') + '转账</label></div><hr />' +
    //  this.template;
  },
})

module.exports = LowLevelMoneyTransferView
