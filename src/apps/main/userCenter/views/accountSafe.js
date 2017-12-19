
const AccountSafeView = Base.ItemView.extend({

  template: require('userCenter/templates/accountSafe.html'),

  startOnLoading: true,

  events: {

  },

  className: '',

  initialize() {

  },

  onRender() {
    this.loadingFinish()
  },

})

module.exports = AccountSafeView
